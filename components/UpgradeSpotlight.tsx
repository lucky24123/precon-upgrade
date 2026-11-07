import Link from "next/link";

const upgrades = [
  {
    href: "/upgrade/edgar-markov",
    name: "Edgar Markov",
    precon: "Vampiric Bloodlust",
  },
  {
    href: "/upgrade/kaalia-of-the-vast",
    name: "Kaalia of the Vast",
    precon: "Heavenly Inferno",
  },
  {
    href: "/upgrade/meren-of-clan-nel-toth",
    name: "Meren of Clan Nel Toth",
    precon: "Plunder the Graves",
  },
  {
    href: "/upgrade/the-ur-dragon",
    name: "The Ur-Dragon",
    precon: "Draghi Commander",
  },
  {
    href: "/upgrade/krenko-mob-boss",
    name: "Krenko, Mob Boss",
    precon: "Goblin Commander",
  },
];

export default function UpgradeSpotlight() {
  return (
    <section className="upgrade-spotlight">
      <div className="upgrade-spotlight-head">
        <h2>Upgrade consigliati</h2>
        <p>Scegli un comandante e scopri come migliorare il tuo precon.</p>
      </div>

      <div className="upgrade-spotlight-grid">
        {upgrades.map((upgrade) => (
          <Link
            key={upgrade.href}
            href={upgrade.href}
            className="upgrade-card"
            aria-label={`Apri l’upgrade di ${upgrade.name}`}
          >
            <div className="upgrade-card-info">
              <h3>{upgrade.name}</h3>
              <p>{upgrade.precon}</p>
              <span>Vedi l’upgrade</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
