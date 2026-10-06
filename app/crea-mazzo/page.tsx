"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang, LangSwitch } from "../../lib/i18n";

type Card = { name: string; quantity: number; image: string | null; priceEUR: number | null };
type DeckResult = { commander: string; cards: Card[]; warnings: string[] };
const colors = [{ code: "W" }, { code: "U" }, { code: "B" }, { code: "R" }, { code: "G" }];
function Picture({ src, name }: { src: string | null; name: string }) {
  const { t } = useLang();
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <p className="fine">{t.imageMissing}</p>;
  return <a href={src} target="_blank" rel="noreferrer"><img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} style={{ width: "100%", maxWidth: 220, borderRadius: 12 }} /></a>;
}
function isResult(value: unknown): value is DeckResult {
  if (!value || typeof value !== "object") return false;
  const d = value as Partial<DeckResult>;
  return typeof d.commander === "string" && Array.isArray(d.warnings) && d.warnings.every(w => typeof w === "string") && Array.isArray(d.cards) && d.cards.every(c => c && typeof c.name === "string" && Number.isInteger(c.quantity) && c.quantity > 0 && (c.image === null || typeof c.image === "string") && (c.priceEUR === null || (typeof c.priceEUR === "number" && Number.isFinite(c.priceEUR) && c.priceEUR >= 0)));
}
export default function CreateDeck() {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<string[]>(["B", "R"]);
  const [commander, setCommander] = useState("");
  const [budget, setBudget] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<DeckResult | null>(null);
  const [copyMessage, setCopyMessage] = useState("");
  function toggle(color: string) {
    setSelected(current => current.includes(color) ? current.filter(c => c !== color) : [...current, color]);
    setResult(null);
  }
  async function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setResult(null); setCopyMessage("");
    const raw = budget.trim(); const amount = raw === "" ? null : Number(raw.replace(",", "."));
    if (amount !== null && (!Number.isFinite(amount) || amount < 0)) { setMessage(t.invalidBudget); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/build", {
        method: "POST", headers: { "Content-Type": "application/json", "x-lang": lang },
        body: JSON.stringify({ commander: commander.trim(), colors: colors.filter(c => selected.includes(c.code)).map(c => c.code), budgetEUR: amount }),
      });
      if (response.status === 404 || response.status === 405) throw new Error(t.noBuilder);
      const data: unknown = await response.json();
      if (!response.ok) {
        const error = data && typeof data === "object" && "error" in data ? (data as { error: unknown }).error : null;
        throw new Error(typeof error === "string" ? error : t.genFailed);
      }
      if (!isResult(data)) throw new Error(t.invalidData);
      if (data.cards.reduce((sum, c) => sum + c.quantity, 0) !== 100) throw new Error(t.incomplete);
      const knownTotal = data.cards.reduce((sum, c) => sum + Math.round((c.priceEUR ?? 0) * 100) * c.quantity, 0);
      if (amount !== null && (data.cards.some(c => c.priceEUR === null) || knownTotal > Math.floor(amount * 100))) throw new Error(t.budgetUnverified);
      setResult(data);
    } catch (error) { setMessage(error instanceof Error ? error.message : t.unexpected); }
    finally { setBusy(false); }
  }
  async function copyDeck() {
    if (!result) return;
    try { await navigator.clipboard.writeText(result.cards.map(c => `${c.quantity} ${c.name}`).join("\n")); setCopyMessage(t.copied); }
    catch { setCopyMessage(t.copyFallback); }
  }
  const subtotal = result?.cards.reduce((sum, c) => sum + Math.round((c.priceEUR ?? 0) * 100) * c.quantity, 0) ?? 0;
  return <main className="shell">
    <header><div className="brand">PRECON UPGRADE <span>NO AI</span></div><div className="headright"><Link href="/">{t.back}</Link><LangSwitch /></div></header>
    <section className="hero"><h1>{t.buildTitle}</h1><p>{t.buildText}</p></section>
    <section className="panel">
      <form onSubmit={generate}>
        <fieldset disabled={busy}><legend>{t.colorsLegend}</legend><div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>{colors.map(c => <label key={c.code} style={{ display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" checked={selected.includes(c.code)} onChange={() => toggle(c.code)} style={{ width: "auto" }} />{t.colorNames[c.code]}</label>)}</div><p className="fine">{t.colorlessHint}</p></fieldset>
        <label htmlFor="commander">{t.commanderOfficial}</label><input id="commander" required value={commander} disabled={busy} onChange={e => { setCommander(e.target.value); setResult(null); }} placeholder={t.commanderOfficialPh} />
        <label htmlFor="budget">{t.budgetTotal}</label><input id="budget" inputMode="decimal" value={budget} disabled={busy} onChange={e => { setBudget(e.target.value); setResult(null); }} placeholder={t.budgetTotalPh} />
        <p className="fine">{t.budgetHint}</p>
        <button disabled={busy || !commander.trim()} type="submit">{busy ? t.generating : t.generate}</button>
      </form>
      <p role="status" aria-live="polite">{message}</p>
    </section>
    {result && <section className="panel"><h2>{result.commander}</h2><p>{t.cards100} · {result.cards.some(c => c.priceEUR === null) ? t.knownSubtotal : t.estTotal}: {(subtotal / 100).toFixed(2)} €</p>{result.warnings.map((w, i) => <p className="notice" key={i}>{w}</p>)}<button onClick={copyDeck}>{t.copyDeck}</button><p role="status">{copyMessage}</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 20 }}>{result.cards.map((c, i) => <article key={`${c.name}-${i}`}><h3>{c.quantity} × {c.name}</h3><Picture key={c.image} src={c.image} name={c.name} /><p>{c.priceEUR === null ? t.priceNa : `${c.priceEUR.toFixed(2)} ${t.perCopy}`}</p></article>)}</div><label htmlFor="decklist">{t.listToCopy}</label><textarea id="decklist" readOnly value={result.cards.map(c => `${c.quantity} ${c.name}`).join("\n")} /></section>}
    <footer>{t.statsBy} <a href="https://edhrec.com" target="_blank" rel="noopener noreferrer">EDHREC</a>. {t.buildFooter}</footer>
  </main>;
}
