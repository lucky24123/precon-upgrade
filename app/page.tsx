"use client";
import Link from "next/link";
import { useLang, LangSwitch } from "../lib/i18n";
import AuthButton from "../components/AuthButton";
import InstagramLink from "../components/InstagramLink";

const SHOWCASE = [
  "Pantlaza, Sun-Favored",
  "Cloud, Ex-SOLDIER",
  "Krenko, Mob Boss",
  "Atraxa, Praetors' Voice",
  "The Ur-Dragon",
  "Lathril, Blade of the Elves",
  "Wilhelt, the Rotcleaver",
  "Prosper, Tome-Bound",
];

function scry(name: string) {
  return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}&format=image&version=normal`;
}

export default function Landing() {
  const { t } = useLang();
  return (
    <main className="landing">
      {/* 1. HERO fullscreen — struttura demo */}
      <section className="land-hero">
        <picture>
          <source media="(max-width: 700px)" srcSet="/hero-mazzo-960.webp" />
          <img src="/hero-mazzo.webp" alt={t.landImgAlt} fetchPriority="high" />
        </picture>
        <div className="land-shade" />
        <div className="land-cards" aria-hidden="true">
          {SHOWCASE.slice(0, 5).map((name, i) => (
            <img
              key={name}
              src={scry(name)}
              alt=""
              className={`land-card land-card-${i + 1}`}
              loading={i < 2 ? "eager" : "lazy"}
            />
          ))}
        </div>
        <div className="land-inner">
          <header className="land-head">
            <Link href="/" className="brand">
              PRECON UPGRADE <span>NO AI</span>
            </Link>
            <div className="headright">
              <AuthButton />
              <LangSwitch />
              <InstagramLink />
            </div>
          </header>
          <div className="land-copy">
            <p className="land-kicker">{t.landKicker}</p>
            <h1>
              {t.landTitle1}
              <br />
              <i>{t.landTitle2}</i>
            </h1>
            <p className="land-text">{t.landText}</p>
            <div className="land-ctas">
              <Link href="/migliora" className="cta primary btn-tap">
                {t.landCtaUpgrade}
              </Link>
              <Link href="/crea-mazzo" className="cta ghost btn-tap">
                {t.landCtaBuild}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Marquee carte */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...SHOWCASE, ...SHOWCASE].map((name, i) => (
            <span key={i} className="marquee-item">
              <img src={scry(name)} alt="" />
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Come funziona — 3 step */}
      <section className="shell steps-section">
        <p className="eyebrow">Come funziona</p>
        <h2 className="steps-title">Tre passi. Nessuna AI.</h2>
        <div className="steps">
          <div className="step">
            <span className="step-n">01</span>
            <h3>Cerca</h3>
            <p>Scegli il comandante del tuo precon o incolla la lista.</p>
          </div>
          <div className="step">
            <span className="step-n">02</span>
            <h3>Costruisci</h3>
            <p>Budget in euro e numero di carte: EDHREC + Scryfall fanno il resto.</p>
          </div>
          <div className="step">
            <span className="step-n">03</span>
            <h3>Esporta</h3>
            <p>Salva il mazzo, copia la lista, confronta su altri siti.</p>
          </div>
        </div>
      </section>

      {/* 4. Account */}
      <section className="shell land-account-wrap">
        <AuthButton variant="landing" />
      </section>

      {/* 5. Feature cards */}
      <section className="shell land-features">
        <Link href="/migliora" className="feature card-foil">
          <h2>{t.landF1t}</h2>
          <p>{t.landF1}</p>
        </Link>
        <Link href="/crea-mazzo" className="feature card-foil">
          <h2>{t.landF2t}</h2>
          <p>{t.landF2}</p>
        </Link>
        <Link href="/crea-mazzo" className="feature card-foil">
          <h2>{t.landF3t}</h2>
          <p>{t.landF3}</p>
        </Link>
        <Link href="/guida/come-funziona" className="feature card-foil">
          <h2>{t.landF4t}</h2>
          <p>{t.landF4}</p>
        </Link>
      </section>
    </main>
  );
}
