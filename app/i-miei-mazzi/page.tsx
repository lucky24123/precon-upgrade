"use client";

// Dettaglio di un mazzo salvato. RLS impedisce l'accesso ai mazzi altrui.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase-client";
import { useLang, LangSwitch } from "../../lib/i18n";

import AuthButton from "../../components/AuthButton";
import InstagramLink from "../../components/InstagramLink";

type CardRow = { name: string; quantity: number; is_commander: boolean };
type Deck = { 
  id: string; 
  title: string; 
  commander: string; 
  origin: string; 
  deck_cards: CardRow[];
  snapshot?: { 
    swaps?: { 
      cut: string | null; 
      add: string; 
      reason: string; 
      cutImage?: string; 
      addImage?: string 
    }[] 
  }; 
};

export default function DeckDetail() {
  const { t } = useLang();
  const params = useParams<{ id: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) { setMissing(true); return; }
    let live = true;
    const load = async () => {
      const { data } = await client.auth.getUser();
      if (!live) return;
      if (!data.user) { setDeck(null); setMissing(true); return; }
      const { data: row } = await client
        .from("decks")
        .select("id,title,commander,origin,snapshot,deck_cards(name,quantity,is_commander)")
        .eq("id", params.id)
        .maybeSingle();
      if (!live) return;
      if (!row) { setDeck(null); setMissing(true); return; }
      setMissing(false); setDeck(row as unknown as Deck);
    };
    void load();
    window.addEventListener("focus", load);
    const { data: subscription } = client.auth.onAuthStateChange(event => {
      if (event === "SIGNED_OUT") { setDeck(null); setMissing(true); }
    });
    return () => { live = false; window.removeEventListener("focus", load); subscription.subscription.unsubscribe(); };
  }, [params.id]);

  const total = deck?.deck_cards.reduce((n, c) => n + c.quantity, 0) || 0;
  const list = deck ? deck.deck_cards.map(c => `${c.quantity} ${c.name}`).join("\n") : "";

  return (
    <main className="shell">
      <header>
        <Link href="/" className="brand" style={{ color: "inherit", textDecoration: "none" }}>PRECON UPGRADE <span>NO AI</span></Link>
        <div className="headright"><p>{t.tagline}</p><AuthButton /><LangSwitch /><InstagramLink /></div>
      </header>
      <section className="hero"><h1>{deck ? deck.title : "…"}</h1><p>{deck ? `${deck.commander} · ${total} ${t.cardsLabel}` : ""}</p></section>
      {missing && <section className="panel"><p className="notice">{t.deckNotFound}</p></section>}
      {deck && (
        <section className="panel">
          <button type="button" className="authbtn" onClick={() => navigator.clipboard.writeText(list)}>{t.copyDeck}</button>
          <label>{t.listToCopy}</label>
          <textarea readOnly value={list} />
          {deck.origin === "upgrade" && (
            <>
              <h2>{t.possibleSwaps}</h2>
              <p className="fine">{t.swapFine}</p>
              <div className="workspace">
                <div className="swap-col swap-out">
                  <h3>{t.remove}</h3>
                  {deck.snapshot?.swaps?.map((s: any, i: number) =>
                    s.cut ? (
                      <div className="swap-item" key={"o"+i}>
                        {s.cutImage && (
                          <a className="card-picture" href={s.cutImage} target="_blank" rel="noreferrer">
                            <img src={s.cutImage} alt="" />
                          </a>
                        )}
                        <div>
                          <strong>{s.cut}</strong>
                          <div className="pill remove">{t.remove}</div>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
                <div className="swap-col swap-in">
                  <h3>{t.add}</h3>
                  {deck.snapshot?.swaps?.map((s: any, i: number) => (
                    <div className="swap-item" key={"i"+i}>
                      {s.addImage && (
                        <a className="card-picture" href={s.addImage} target="_blank" rel="noreferrer">
                          <img src={s.addImage} alt="" />
                        </a>
                      )}
                      <div>
                        <strong>{s.add}</strong>
                        {s.reason && <div className="reason">{s.reason}</div>}
                        <span className="pill add">{t.add}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}
