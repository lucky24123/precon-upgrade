"use client";

import type { BannedCard } from "../../lib/banned";
import { useLang, LangSwitch } from "../../lib/i18n";
import AuthButton from "../../components/AuthButton";
import InstagramLink from "../../components/InstagramLink";

export function BanList({ cards, error }: { cards: BannedCard[]; error: string | null }) {
  const { t } = useLang();
  return (
    <main className="shell">
      <header>
        <a href="/" className="brand" style={{ color: "inherit", textDecoration: "none" }}>
          PRECON UPGRADE <span>NO AI</span>
        </a>
        <div className="headright">
          <p>{t.tagline}</p>
          <AuthButton />
          <LangSwitch />
          <InstagramLink />
        </div>
      </header>
      <section className="hero">
        <h1>{t.banTitle}</h1>
        <p>{t.banText}</p>
        <a href="https://magic.wizards.com/en/banned-restricted-list" target="_blank" rel="noopener noreferrer">
          Wizards: Banned &amp; Restricted
        </a>
      </section>
      {error && <p className="notice">{error === "ban-unavailable" ? t.banUnavailable : t.banUnavailable}</p>}
      {cards.length === 0 && !error && <p className="notice">{t.banUnavailable}</p>}
      <div className="ban-grid">
        {cards.map((c) => (
          <article key={c.name} className="panel ban-card">
            {c.imageUrl ? (
              <a href={c.imageUrl} target="_blank" rel="noreferrer">
                <img src={c.imageUrl} alt={c.name} loading="lazy" style={{ width: "100%", maxWidth: 220, borderRadius: 12 }} />
              </a>
            ) : (
              <p className="fine">{t.imageMissing}</p>
            )}
            <h3>{c.name}</h3>
            {c.oracleText && <p className="fine">{c.oracleText}</p>}
          </article>
        ))}
      </div>
    </main>
  );
}
