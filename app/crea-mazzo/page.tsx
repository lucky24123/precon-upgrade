"use client";

import { useState } from "react";
import Link from "next/link";

type Card = { name: string; quantity: number; image: string | null; priceEUR: number | null };
type DeckResult = { commander: string; cards: Card[]; warnings: string[] };
const colors = [
  { code: "W", name: "Bianco" }, { code: "U", name: "Blu" },
  { code: "B", name: "Nero" }, { code: "R", name: "Rosso" },
  { code: "G", name: "Verde" },
];
function Picture({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <p className="fine">Immagine non disponibile</p>;
  return <a href={src} target="_blank" rel="noreferrer"><img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} style={{ width: "100%", maxWidth: 220, borderRadius: 12 }} /></a>;
}
function isResult(value: unknown): value is DeckResult {
  if (!value || typeof value !== "object") return false;
  const d = value as Partial<DeckResult>;
  return typeof d.commander === "string" && Array.isArray(d.warnings) && d.warnings.every(w => typeof w === "string") && Array.isArray(d.cards) && d.cards.every(c => c && typeof c.name === "string" && Number.isInteger(c.quantity) && c.quantity > 0 && (c.image === null || typeof c.image === "string") && (c.priceEUR === null || (typeof c.priceEUR === "number" && Number.isFinite(c.priceEUR) && c.priceEUR >= 0)));
}
export default function CreateDeck() {
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
    if (amount !== null && (!Number.isFinite(amount) || amount < 0)) { setMessage("Inserisci un budget valido, per esempio 100 o 100,50."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/build", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commander: commander.trim(), colors: colors.filter(c => selected.includes(c.code)).map(c => c.code), budgetEUR: amount }),
      });
      if (response.status === 404 || response.status === 405) throw new Error("La pagina è pronta, ma il generatore /api/build non è ancora installato. Serve aggiungere app/api/build/route.ts.");
      const data: unknown = await response.json();
      if (!response.ok) {
        const error = data && typeof data === "object" && "error" in data ? (data as { error: unknown }).error : null;
        throw new Error(typeof error === "string" ? error : "Generazione non riuscita.");
      }
      if (!isResult(data)) throw new Error("Il generatore ha restituito dati non validi.");
      if (data.cards.reduce((sum, c) => sum + c.quantity, 0) !== 100) throw new Error("Lista incompleta: il generatore deve restituire 100 carte, comandante incluso.");
      const knownTotal = data.cards.reduce((sum, c) => sum + Math.round((c.priceEUR ?? 0) * 100) * c.quantity, 0);
      if (amount !== null && (data.cards.some(c => c.priceEUR === null) || knownTotal > Math.floor(amount * 100))) throw new Error("Il generatore non ha verificato il budget per tutte le carte. Non mostro la lista come completata.");
      setResult(data);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Errore inatteso."); }
    finally { setBusy(false); }
  }
  async function copyDeck() {
    if (!result) return;
    try { await navigator.clipboard.writeText(result.cards.map(c => `${c.quantity} ${c.name}`).join("\n")); setCopyMessage("Lista copiata."); }
    catch { setCopyMessage("Copia automatica non disponibile: seleziona e copia la lista qui sotto."); }
  }
  const subtotal = result?.cards.reduce((sum, c) => sum + Math.round((c.priceEUR ?? 0) * 100) * c.quantity, 0) ?? 0;
  return <main className="shell">
    <header><div className="brand">PRECON UPGRADE <span>NO AI</span></div><Link href="/">← Torna agli upgrade</Link></header>
    <section className="hero"><h1>Crea una base di mazzo.</h1><p>Scegli i colori, inserisci il comandante e imposta il budget. La lista dovrà essere controllata e personalizzata prima di giocare.</p></section>
    <section className="panel">
      <form onSubmit={generate}>
        <fieldset disabled={busy}><legend>Colori del comandante</legend><div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>{colors.map(c => <label key={c.code} style={{ display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" checked={selected.includes(c.code)} onChange={() => toggle(c.code)} style={{ width: "auto" }} />{c.name}</label>)}</div><p className="fine">Nessun colore selezionato = incolore. Il server deve verificare la corrispondenza con l’identità del comandante.</p></fieldset>
        <label htmlFor="commander">Comandante — nome ufficiale</label><input id="commander" required value={commander} disabled={busy} onChange={e => { setCommander(e.target.value); setResult(null); }} placeholder="Inserisci il nome del comandante" />
        <label htmlFor="budget">Budget totale in euro — facoltativo</label><input id="budget" inputMode="decimal" value={budget} disabled={busy} onChange={e => { setBudget(e.target.value); setResult(null); }} placeholder="Es. 100" />
        <p className="fine">Comprende comandante e terre. Prezzi stimati; spedizione esclusa. Il livello di gioco e la scelta automatica del comandante saranno funzioni successive.</p>
        <button disabled={busy || !commander.trim()} type="submit">{busy ? "Generazione in corso…" : "Genera una base di mazzo"}</button>
      </form>
      <p role="status" aria-live="polite">{message}</p>
    </section>
    {result && <section className="panel"><h2>{result.commander}</h2><p>100 carte · {result.cards.some(c => c.priceEUR === null) ? "Subtotale prezzi noti" : "Totale stimato"}: {(subtotal / 100).toFixed(2)} €</p>{result.warnings.map((w, i) => <p className="notice" key={i}>{w}</p>)}<button onClick={copyDeck}>Copia decklist</button><p role="status">{copyMessage}</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 20 }}>{result.cards.map((c, i) => <article key={`${c.name}-${i}`}><h3>{c.quantity} × {c.name}</h3><Picture key={c.image} src={c.image} name={c.name} /><p>{c.priceEUR === null ? "Prezzo non disponibile" : `${c.priceEUR.toFixed(2)} € per copia`}</p></article>)}</div><label htmlFor="decklist">Lista da copiare</label><textarea id="decklist" readOnly value={result.cards.map(c => `${c.quantity} ${c.name}`).join("\n")} /></section>}
    <footer>Immagini tramite Scryfall. Magic: The Gathering e le immagini appartengono ai rispettivi titolari. Sito non ufficiale.</footer>
  </main>;
}
