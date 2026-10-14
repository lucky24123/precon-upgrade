"use client";
import { useState } from "react";
import Link from "next/link";
import AuthButton from "./AuthButton";
import { useLang } from "../lib/i18n";
import { SUPABASE_CONFIGURED } from "../lib/supabase-client";

export type SavedCard = {
  name: string; quantity: number; oracle_id: string; is_commander: boolean; price_cents: number | null;
};
export type SavePayload = {
  title: string; commander: string; origin: "build" | "upgrade"; budget_cents: number | null;
  cards: SavedCard[]; result: unknown; input: unknown;
};
export default function SaveDeck({ payload }: { payload: SavePayload }) {
  const { lang } = useLang();
  const en = lang === "en";
  const [title, setTitle] = useState(payload.title);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [id, setId] = useState("");
  if (!SUPABASE_CONFIGURED) return null;
  async function save() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/decks", {
        method: "POST", headers: { "Content-Type": "application/json", "x-lang": lang },
        body: JSON.stringify({ ...payload, title: title.trim() }),
      });
      const data = await response.json();
      if (response.status === 401) {
        setNeedsLogin(true);
        setMessage(en ? "Sign in, then press Save again." : "Accedi, poi premi di nuovo Salva.");
        return;
      }
      if (!response.ok) throw new Error(data.error);
      setId(data.id); setNeedsLogin(false);
      setMessage(en ? "Saved to your account." : "Salvato nel tuo account.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : en ? "Saving failed." : "Salvataggio non riuscito.");
    } finally { setBusy(false); }
  }
  return <div className="save-box">
    <label>{en ? "Name for this save" : "Nome del salvataggio"}
      <input value={title} onChange={e => setTitle(e.target.value)} maxLength={120} disabled={busy || !!id} />
    </label>
    <button onClick={save} disabled={busy || !title.trim() || !!id}>
      {busy ? (en ? "Saving…" : "Salvataggio…") :
        payload.origin === "upgrade" ? (en ? "Save comparison" : "Salva confronto") : (en ? "Save deck" : "Salva mazzo")}
    </button>
    <p role="status">{message}</p>
    {needsLogin && <AuthButton />}
    {id && <Link href={`/i-miei-mazzi/${id}`}>{en ? "Open saved list" : "Apri il salvataggio"}</Link>}
    {payload.origin === "upgrade" && <p className="fine">
      {en ? "Saves the original list and suggested swaps; swaps are not applied automatically." :
        "Salva la lista originale e i cambi suggeriti; le sostituzioni non vengono applicate automaticamente."}
    </p>}
  </div>;
}
