"use client";

import { useLang, LangSwitch } from "../lib/i18n";
import AuthButton from "./AuthButton";
import InstagramLink from "./InstagramLink";

export type GuideSection = {
  title: string;
  body: (string | string[])[];
  links?: { label: string; href: string }[];
};
export type GuideContent = {
  title: string;
  intro: string;
  sections: GuideSection[];
};

// Pagina di guida bilingue (guide editoriali) con intestazione e navigazione
// comune del sito. Stessa struttura delle pagine legali, ma con i link ai tool.
export default function GuidePage({ it, en }: { it: GuideContent; en: GuideContent }) {
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
      <nav className="links" aria-label={t.navAria}>
        <a href="/migliora">{t.navUpgrade}</a>
        <a href="/crea-mazzo">{t.navBuild}</a>
        <a href="/ban">{t.navBan}</a>
      </nav>
      <section className="hero">
        <h1>{c.title}</h1>
        <p>{c.intro}</p>
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
            {s.links && (
              <ul style={{ lineHeight: 1.7, paddingLeft: 20 }}>
                {s.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--green)" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
    </main>
  );
}
