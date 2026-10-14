"use client";

// Lista dei mazzi salvati. Richiede l'accesso: senza sessione mostra l'invito
// ad accedere, senza esporre dati di altri utenti (garantito anche da RLS).

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "../../lib/supabase-client";
import { useLang, LangSwitch } from "../../lib/i18n";
import AuthButton from "../../components/AuthButton";
import InstagramLink from "../../components/InstagramLink";

type DeckRow = { id: string; title: string; commander: string; origin: string; updated_at: string; deck_cards: { quantity: number }[] };

export default function MyDecks() {
  const { t, lang } = useLang();
  const [decks, setDecks] = useState<DeckRow[] | null>(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) { setLoggedOut(true); return; }
    let live = true;
    const load = async () => {
      const { data } = await client.auth.getUser();
      if (!live) return;
      if (!data.user) { setLoggedOut(true); setDecks(null); return; }
      setLoggedOut(false);
      const { data: rows, error: queryError } = await client
        .from("decks")
        .select("id,title,commander,origin,updated_at,deck_cards(quantity)")
        .order("updated_at", { ascending: false });
      if (!live) return;
      if (queryError) { setError(lang === "en" ? "Couldn't load saved decks." : "Non riesco a leggere i mazzi salvati."); return; }
      setError(""); setDecks((rows as unknown as DeckRow[]) || []);
    };
    void load();
    window.addEventListener("focus", load);
    const { data: subscription } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") { setDecks(null); setLoggedOut(true); }
    });
    return () => { live = false; window.removeEventListener("focus", load); subscription.subscription.unsubscribe(); };
  }, [lang]);

  const total = (d: DeckRow) => d.deck_cards?.reduce((n, c) => n + c.quantity, 0) || 0;

  return (
    <main className="shell">
      <header>
        <Link href="/" className="brand" style={{ color: "inherit", textDecoration: "none" }}>PRECON UPGRADE <span>NO AI</span></Link>
        <div className="headright"><p>{t.tagline}</p><AuthButton /><LangSwitch /><InstagramLink /></div>
      </header>
      <section className="hero">
        <h1>{t.myDecks}</h1>
        <p>{t.accountHint}</p>
      </section>
      <section className="panel">
        {error && <p role="alert" className="notice">{error}</p>}
        {loggedOut && <AuthButton variant="inline" />}
        {decks === null && !loggedOut && <p className="fine">…</p>}
        {decks && decks.length === 0 && <p className="fine">{t.myDecksEmpty}</p>}
        {decks && decks.map(d => (
          <article className="swap" key={d.id}>
            <div className="top">
              <div>
                <h3>{d.title}</h3>
                <p className="fine">{d.commander} · {total(d)} {t.cardsLabel}</p>
              </div>
              <div className="auth" style={{ display: "flex", gap: 8 }}>
                <button type="button" className="authbtn" onClick={() => openDeck(d.id)}>{t.openDeck}</button>
                <button type="button" className="authbtn" onClick={() => deleteDeck(d.id)}>{t.deleteDeck}</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );

  function openDeck(id: string) {
    window.location.href = `/i-miei-mazzi/${id}`;
  }
  async function deleteDeck(id: string) {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    if (!window.confirm(t.deleteConfirm)) return;
    const { error: deleteError } = await client.from("decks").delete().eq("id", id);
    if (deleteError) { setError(lang === "en" ? "Couldn't delete this deck." : "Non riesco a eliminare il mazzo."); return; }
    setDecks(current => current ? current.filter(d => d.id !== id) : current);
  }
}
