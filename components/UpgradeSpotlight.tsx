import Link from "next/link";

export default function UpgradeSpotlight() {
  return (
    <section className="upgrade-spotlight">
      <div className="upgrade-spotlight-inner">
        <div className="upgrade-spotlight-text">
          <h2>Upgrade consigliato</h2>
          <h3>Edgar Markov</h3>

          <p>
            Scopri come migliorare <strong>Vampiric Bloodlust</strong>: ramp,
            rimozioni, pescata e Vampiri che generano valore.
          </p>

          <Link href="/upgrade/edgar-markov" className="upgrade-spotlight-button">
            Vedi l’upgrade
          </Link>
        </div>

        <Link
          href="/upgrade/edgar-markov"
          className="upgrade-spotlight-card"
          aria-label="Apri l’upgrade di Edgar Markov"
        >
          <img
            src="https://api.scryfall.com/cards/named?exact=Edgar%20Markov&format=image"
            alt="Edgar Markov"
            loading="lazy"
          />
        </Link>
      </div>
    </section>
  );
}
