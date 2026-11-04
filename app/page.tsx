"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang, LangSwitch } from "@/lib/i18n";
import AuthButton from "@/components/AuthButton";
import InstagramLink from "@/components/InstagramLink";

export default function Home() {
  const { t } = useLang();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="shell">
      {/* Header / Navigazione Superiore */}
      <header className="nav-header">
        <Link href="/" className="brand" style={{ color: "inherit", textDecoration: "none" }}>
          PRECON UPGRADE <span>NO AI</span>
        </Link>
        <div className="nav-links-right">
          <Link href="/cerca" className="nav-link-btn">Cerca</Link>
          <Link href="/deckbuilder" className="nav-link-btn">Deckbuilder</Link>
          <Link href="/upgrade" className="nav-link-btn primary">Upgrade</Link>
          <AuthButton />
          <LangSwitch />
          <InstagramLink />
        </div>
      </header>

      {/* Sezione Hero Principale */}
      <section className="hero-section">
        <div className="hero-badge">MAGIC: THE GATHERING · COMMANDER</div>
        <h1 className="hero-title">
          Eredi il precon.<br />
          <span>Forgia la leggenda.</span>
        </h1>
        <p className="hero-subtitle">
          Strumenti gratuiti basati su statistiche EDHREC e dati Scryfall, con prezzi e uri un budget a tua scelta.<br />
          Nessuna AI.
        </p>

        {/* Pulsanti di azione rapida */}
        <div className="hero-actions">
          <Link href="/upgrade" className="btn-primary-gold">
            Upgrade un precon →
          </Link>
          <Link href="/deckbuilder" className="btn-secondary">
            Costruisci da zero
          </Link>
          <Link href="/cerca" className="btn-secondary">
            Cerca carte
          </Link>
        </div>

        {/* Marquee / Barra scorrevole carte popolari */}
        <div className="popular-cards-bar">
          <span>⚡</span>
          <div className="cards-ticker">
            <span>Cyclonic Rift</span>
            <span>Smothering Tithe</span>
            <span>Demonic Tutor</span>
            <span>Rhystic Study</span>
            <span>Fierce Guardianship</span>
            <span>Teferi's Protection</span>
            <span>Mana Crypt</span>
            <span>Force of Will</span>
          </div>
        </div>
      </section>

      {/* Sezione Precon Ufficiali */}
      <section className="content-section">
        <div className="section-header-row">
          <h3>PRECON UFFICIALI</h3>
          <h2>Scegli un precon da potenziare</h2>
        </div>

        <div className="decks-grid">
          {/* Card Precon 1 */}
          <Link href="/upgrade?precon=ruinous-powers" className="deck-card">
            <div className="deck-card-image placeholder-img"></div>
            <div className="deck-card-info">
              <h4>The Ruinous Powers</h4>
              <p>Warhammer 40,000</p>
              <div className="color-indicators">
                <span className="dot b"></span>
                <span className="dot r"></span>
              </div>
            </div>
          </Link>

          {/* Card Precon 2 */}
          <Link href="/upgrade?precon=ahoy-mateys" className="deck-card">
            <div className="deck-card-image placeholder-img"></div>
            <div className="deck-card-info">
              <h4>Ahoy Mateys</h4>
              <p>The Lost Caverns of Ixalan</p>
              <div className="color-indicators">
                <span className="dot w"></span>
                <span className="dot b"></span>
                <span className="dot r"></span>
              </div>
            </div>
          </Link>

          {/* Card Precon 3 */}
          <Link href="/upgrade?precon=quantum-quandrix" className="deck-card">
            <div className="deck-card-image placeholder-img"></div>
            <div className="deck-card-info">
              <h4>Quantum Quandrix</h4>
              <p>Commander 2021</p>
              <div className="color-indicators">
                <span className="dot g"></span>
                <span className="dot u"></span>
              </div>
            </div>
          </Link>

          {/* Card Precon 4 */}
          <Link href="/upgrade?precon=reap-the-tides" className="deck-card">
            <div className="deck-card-image placeholder-img"></div>
            <div className="deck-card-info">
              <h4>Reap the Tides</h4>
              <p>Commander Legends</p>
              <div className="color-indicators">
                <span className="dot g"></span>
                <span className="dot u"></span>
              </div>
            </div>
          </Link>

          {/* Card Precon 5 */}
          <Link href="/upgrade?precon=subjective-reality" className="deck-card">
            <div className="deck-card-image placeholder-img"></div>
            <div className="deck-card-info">
              <h4>Subjective Reality</h4>
              <p>Commander 2018</p>
              <div className="color-indicators">
                <span className="dot w"></span>
                <span className="dot u"></span>
                <span className="dot b"></span>
              </div>
            </div>
          </Link>

          {/* Card Precon 6 */}
          <Link href="/upgrade?precon=miracle-worker" className="deck-card">
            <div className="deck-card-image placeholder-img"></div>
            <div className="deck-card-info">
              <h4>Miracle Worker</h4>
              <p>Duskmourn</p>
              <div className="color-indicators">
                <span className="dot w"></span>
                <span className="dot u"></span>
                <span className="dot b"></span>
              </div>
            </div>
          </Link>
        </div>

        <div className="view-all-link">
          <Link href="/precon">Vedi tutti i precon →</Link>
        </div>
      </section>

      {/* Sezione Guide e Upgrade Pronti */}
      <section className="content-section">
        <div className="section-header-row">
          <h3>GUIDE IN EVIDENZA</h3>
          <h2>Mazzi e upgrade pronti</h2>
        </div>

        <div className="decks-grid small">
          <Link href="/mazzi/krenko" className="deck-card horizontal">
            <div className="deck-card-image small placeholder-img"></div>
            <div className="deck-card-info">
              <h4>Krenko – La Marea Goblin</h4>
              <p>Krenko, Mob Boss</p>
              <div.stats-tag>+4100 · 🎴 7</div.stats-tag>
            </div>
          </Link>

          <Link href="/mazzi/elven-empire" className="deck-card horizontal">
            <div className="deck-card-image small placeholder-img"></div>
            <div className="deck-card-info">
              <h4>Elven Empire – Upgrade</h4>
              <p>Lathril, Blade of the Elves</p>
              <div.stats-tag>+421 · 🎴 7</div.stats-tag>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
