"use client";

// Dettaglio di un mazzo salvato. RLS impedisce l'accesso ai mazzi altrui.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase-client";
import { useLang, LangSwitch } from "../../../lib/i18n";
import AuthButton from "../../../components/AuthButton";

type CardRow = { name: string; quantity: number; is_commander: boolean };
type Deck = { id: string; title: string; commander: string; origin: string; deck_cards: CardRow[] };

export default function DeckDetail() {
  const { t } = useLang();
  const params = useParams<{ id: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) { setMissing(true); return; }
    client.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setMissing(true); return; }
      const { data: row } = await client
        .from("decks")
        .select("id,title,commander,origin,deck_cards(name,quantity,is_commander)")
        .eq("id", params.id)
        .maybeSingle();
      if (!row) { setMissing(true); return; }
      setDeck(row as unknown as Deck);
    });
  }, [params.id]);

  const total = deck?.deck_cards.reduce((n, c) => n + c.quantity, 0) || 0;
  const list = deck ? deck.deck_cards.map(c => `${c.quantity} ${c.name}`).join("\n") : "";

  return (
    <main className="shell">
      <header>
        <Link href="/" className="brand" style={{ color: "inherit", textDecoration: "none" }}>PRECON UPGRADE <span>NO AI</span></Link>
        <div className="headright"><p>{t.tagline}</p><AuthButton /><LangSwitch /></div>
      </header>
      <section className="hero"><h1>{deck ? deck.title : "…"}</h1><p>{deck ? `${deck.commander} · ${total} ${t.cardsLabel}` : ""}</p></section>
      {missing && <section className="panel"><p className="notice">{t.deckNotFound}</p></section>}
      {deck && (
        <section className="panel">
          <button type="button" className="authbtn" onClick={() => navigator.clipboard.writeText(list)}>{t.copyDeck}</button>
          <label>{t.listToCopy}</label>
          <textarea readOnly value={list} />
        </section>
      )}
    </main>
  );
}
