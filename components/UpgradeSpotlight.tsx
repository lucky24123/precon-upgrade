import Link from "next/link";

const upgrades = [
  {
    href: "/upgrade/edgar-markov",
    name: "Edgar Markov",
    precon: "Vampiric Bloodlust",
    image:
      "https://api.scryfall.com/cards/named?exact=Edgar%20Markov&format=image",
  },
  {
    href: "/upgrade/kaalia-of-the-vast",
    name: "Kaalia of the Vast",
    precon: "Heavenly Inferno",
    image:
      "https://api.scryfall.com/cards/named?exact=Kaalia%20of%20the%20Vast&format=image",
  },
  {
    href: "/upgrade/meren-of-clan-nel-toth",
    name: "Meren of Clan Nel Toth",
    precon: "Plunder the Graves",
    image:
      "https://api.scryfall.com/cards/named?exact=Meren%20of%20Clan%20Nel%20Toth&format=image",
  },
  {
    href: "/upgrade/the-ur-dragon",
    name: "The Ur-Dragon",
    precon: "Draghi Commander",
    image:
      "https://api.scryfall.com/cards/named?exact=The%20Ur-Dragon&format=image",
  },
  {
    href: "/upgrade/krenko-mob-boss",
    name: "Krenko, Mob Boss",
    precon: "Goblin Commander",
    image:
      "https://api.scryfall.com/cards/named?exact=Krenko%2C%20Mob%20Boss&format=image",
  },
];

export default function UpgradeSpotlight() {
  return (
    <section className="upgrade-spotlight">
      <div className="upgrade-spotlight-head">
        <h2>Upgrade consigliati</h2>
        <p>
          Scegli un comandante e scopri come migliorare il tuo precon con
          upgrade mirati.
        </p>
      </div>

      <div className="upgrade-spotlight-grid">
        {upgrades.map((upgrade) => (
          <Link
            key={upgrade.href}
            href={upgrade.href}
            className="upgrade-card"
            aria-label={`Apri l’upgrade di ${upgrade.name}`}
          >
            <img
              src={upgrade.image}
              alt={upgrade.name}
              loading="lazy"
            />

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
