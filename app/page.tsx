"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang, LangSwitch } from "../lib/i18n";
import InstagramLink from "../components/InstagramLink";

export default function Home() {
  const { t } = useLang();

  return (
    <main className="shell">
      {/* Header / Navigazione Superiore */}
      <header>
        <Link href="/" className="brand" style={{ color: "inherit", textDecoration: "none" }}>
          PRECON UPGRADE <span>NO AI</span>
        </Link>
        <div className="headright">
          <Link href="/cerca" className="authbtn ghostbtn">Cerca</Link>
          <Link href="/deckbuilder" className="authbtn ghostbtn">Deckbuilder</Link>
          <Link href="/upgrade" className="authbtn">Upgrade</Link>
          <LangSwitch />
          <InstagramLink />
        </div>
      </header>

      {/* Sezione Hero Principale */}
      <section className="hero">
        <div className="eyebrow">MAGIC: THE GATHERING · COMMANDER</div>
        <h1>Eredi il precon.<br /><i>Forgia la leggenda.</i></h1>
        <p>
          Strumenti gratuiti basati su statistiche EDHREC e dati Scryfall, con prezzi e un budget a tua scelta. Nessuna AI.
        </p>

        {/* Pulsanti di azione rapida */}
        <div className="land-ctas" style={{ margin: "24px 0" }}>
          <Link href="/upgrade" className="cta primary">
            Upgrade un precon →
          </Link>
          <Link href="/deckbuilder" className="cta ghost">
            Costruisci da zero
          </Link>
          <Link href="/cerca" className="cta ghost">
            Cerca carte
          </Link>
        </div>
      </section>

      {/* Sezione Precon Ufficiali (Tutti i tuoi mazzi) */}
      <section className="panel">
        <div className="eyebrow">PRECON UFFICIALI</div>
        <h2>Scegli un precon da potenziare</h2>

        <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", marginTop: "20px" }}>
          <Link href="/upgrade?precon=Calling-All-Angels" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Calling All Angels</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Giada, Font of Hope</p>
          </Link>
          <Link href="/upgrade?precon=Keen-Engineering" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Keen Engineering</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Sai, Master Thopterist</p>
          </Link>
          <Link href="/upgrade?precon=Multiverse-Reforged" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Multiverse Reforged</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Jace, Multiverse Architect</p>
          </Link>
          <Link href="/upgrade?precon=Reign-of-Dragons" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Reign of Dragons</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Lathliss, Dragon Queen</p>
          </Link>
          <Link href="/upgrade?precon=Tramplesaurus-Rex" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Tramplesaurus Rex</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Ghalta, Primal Hunger</p>
          </Link>
          <Link href="/upgrade?precon=Wretched-Ranks" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Wretched Ranks</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Ghoulcaller Gisa</p>
          </Link>
          <Link href="/upgrade?precon=Hatsune-Miku" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Hatsune Miku</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Trostani, Selesnya's Voice</p>
          </Link>
          <Link href="/upgrade?precon=Avengers-Assemble" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Avengers Assemble</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Captain America, Team Leader</p>
          </Link>
          <Link href="/upgrade?precon=Doom-Prevails" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Doom Prevails</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Doctor Doom</p>
          </Link>
          <Link href="/upgrade?precon=The-Fantastic-Four" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>The Fantastic Four</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Invisible Woman</p>
          </Link>
          <Link href="/upgrade?precon=Wakanda-Forever" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Wakanda Forever</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>T'Challa, the Black Panther</p>
          </Link>
          <Link href="/upgrade?precon=Goblin-Storm" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Goblin Storm</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Zada, Hedron Grinder</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
