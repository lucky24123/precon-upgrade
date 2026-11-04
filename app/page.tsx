"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang, LangSwitch } from "../lib/i18n";
import AuthButton from "../components/AuthButton";
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
          <p>{t.tagline}</p>
          <AuthButton />
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

        {/* Marquee / Barra scorrevole carte popolari */}
        <div className="marquee" style={{ borderRadius: "12px", margin: "20px 0" }}>
          <div className="marquee-track">
            <span className="marquee-item">⚡ Cyclonic Rift</span>
            <span className="marquee-item">⚡ Smothering Tithe</span>
            <span className="marquee-item">⚡ Demonic Tutor</span>
            <span className="marquee-item">⚡ Rhystic Study</span>
            <span className="marquee-item">⚡ Fierce Guardianship</span>
            <span className="marquee-item">⚡ Teferi's Protection</span>
            <span className="marquee-item">⚡ Mana Crypt</span>
            <span className="marquee-item">⚡ Force of Will</span>
          </div>
        </div>
      </section>

      {/* Sezione Precon Ufficiali */}
      <section className="panel">
        <div className="eyebrow">PRECON UFFICIALI</div>
        <h2>Scegli un precon da potenziare</h2>

        <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", marginTop: "20px" }}>
          <Link href="/upgrade?precon=ruinous-powers" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>The Ruinous Powers</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Warhammer 40,000</p>
          </Link>
          <Link href="/upgrade?precon=ahoy-mateys" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Ahoy Mateys</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>The Lost Caverns of Ixalan</p>
          </Link>
          <Link href="/upgrade?precon=quantum-quandrix" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Quantum Quandrix</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Commander 2021</p>
          </Link>
          <Link href="/upgrade?precon=reap-the-tides" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Reap the Tides</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Commander Legends</p>
          </Link>
          <Link href="/upgrade?precon=subjective-reality" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Subjective Reality</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Commander 2018</p>
          </Link>
          <Link href="/upgrade?precon=miracle-worker" className="links" style={{ display: "block", textDecoration: "none" }}>
            <strong>Miracle Worker</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Duskmourn</p>
          </Link>
        </div>
      </section>

      {/* Sezione Guide e Upgrade Pronti */}
      <section className="panel">
        <div className="eyebrow">GUIDE IN EVIDENZA</div>
        <h2>Mazzi e upgrade pronti</h2>

        <div className="links" style={{ marginTop: "20px" }}>
          <Link href="/mazzi/krenko">
            <strong>Krenko – La Marea Goblin</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Krenko, Mob Boss · +4100 · 🎴 7</p>
          </Link>
          <Link href="/mazzi/elven-empire">
            <strong>Elven Empire – Upgrade</strong>
            <p className="fine" style={{ margin: "4px 0 0" }}>Lathril, Blade of the Elves · +421 · 🎴 7</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
