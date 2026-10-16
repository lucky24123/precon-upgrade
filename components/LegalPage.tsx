"use client";

import { useLang, LangSwitch } from "../lib/i18n";
import AuthButton from "./AuthButton";
import InstagramLink from "./InstagramLink";

export type LegalSection = { title: string; body: (string | string[])[]; links?: { label: string; href: string }[] };
export type LegalContent = { title: string; intro: string; updated: string; sections: LegalSection[] };

// Pagina legale bilingue (Privacy, Termini) con l'intestazione comune del sito.
export default function LegalPage({ it, en }: { it: LegalContent; en: LegalContent }) {
  const { lang, t } = useLang();
  const c = lang === "en" ? en : it;
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
        <h1>{c.title}</h1>
        <p>{c.intro}</p>
        <p className="fine">{c.updated}</p>
      </section>
      <article className="panel legal">
        {c.sections.map((s) => (
          <section key={s.title}>
            <h3>{s.title}</h3>
            {s.body.map((b, i) =>
              Array.isArray(b) ? (
                <ul key={i} style={{ lineHeight: 1.7, paddingLeft: 20 }}>
                  {b.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              ) : (
                <p key={i} style={{ lineHeight: 1.7 }}>
                  {b}
                </p>
              )
            )}
            {s.links && <ul style={{ lineHeight: 1.7, paddingLeft: 20 }}>
              {s.links.map(link => <li key={link.href}><a href={link.href} target="_blank"
                rel="noopener noreferrer" style={{ color: "var(--green)" }}>{link.label}</a></li>)}
            </ul>}
          </section>
        ))}
      </article>
    </main>
  );
}
