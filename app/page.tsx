"use client";
import Link from "next/link";
import { useLang, LangSwitch } from "../lib/i18n";

export default function Landing() {
  const { t } = useLang();
  return (
    <main className="landing">
      <section className="land-hero">
        <picture>
          <source media="(max-width: 700px)" srcSet="/hero-mazzo-960.webp" />
          <img src="/hero-mazzo.webp" alt={t.landImgAlt} fetchPriority="high" />
        </picture>
        <div className="land-shade" />
        <div className="land-inner">
          <header className="land-head">
            <Link href="/" className="brand">PRECON UPGRADE <span>NO AI</span></Link>
            <LangSwitch />
          </header>
          <div className="land-copy">
            <p className="land-kicker">{t.landKicker}</p>
            <h1>{t.landTitle1}<br /><i>{t.landTitle2}</i></h1>
            <p className="land-text">{t.landText}</p>
            <div className="land-ctas">
              <Link href="/migliora" className="cta primary">{t.landCtaUpgrade}</Link>
              <Link href="/crea-mazzo" className="cta ghost">{t.landCtaBuild}</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="shell land-features">
        <Link href="/migliora" className="feature"><h2>{t.landF1t}</h2><p>{t.landF1}</p></Link>
        <Link href="/crea-mazzo" className="feature"><h2>{t.landF2t}</h2><p>{t.landF2}</p></Link>
        <Link href="/crea-mazzo" className="feature"><h2>{t.landF3t}</h2><p>{t.landF3}</p></Link>
      </section>
    </main>
  );
}
