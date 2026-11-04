"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Database precon dal tuo JSON
const PRECON_DATA: Record<string, { name: string; commander: string; cards: [string, number][] }> = {
  "Calling-All-Angels": {
    name: "Calling All Angels",
    commander: "Giada, Font of Hope",
    cards: [
      ["Giada, Font of Hope", 1], ["Always Watching", 1], ["Angel of the Ruins", 1], ["Angelic Destiny", 1],
      ["Angelic Field Marshal", 1], ["Archangel of Tithes", 1], ["Austere Command", 1], ["Bishop of Wings", 1],
      ["Lyra Dawnbringer", 1], ["Righteous Valkyrie", 1], ["Sephara, Sky's Blade", 1], ["Swords to Plowshares", 1],
      ["Arcane Signet", 1], ["Sol Ring", 1], ["Plains", 32]
    ]
  },
  "Keen-Engineering": {
    name: "Keen Engineering",
    commander: "Sai, Master Thopterist",
    cards: [
      ["Sai, Master Thopterist", 1], ["All Is Dust", 1], ["Kappa Cannoneer", 1], ["Master of Etherium", 1],
      ["Shimmer Dragon", 1], ["Counterspell", 1], ["Propaganda", 1], ["Thoughtcast", 1], ["Sol Ring", 1], ["Island", 34]
    ]
  },
  "Multiverse-Reforged": {
    name: "Multiverse Reforged",
    commander: "Jace, Multiverse Architect",
    cards: [
      ["Jace, Multiverse Architect", 1], ["Nissa, Leyline Tamer", 1], ["Omnath, Locus of the Void", 1],
      ["Elspeth, Sun's Champion", 1], ["Brainstorm", 1], ["Path to Exile", 1], ["Sol Ring", 1]
    ]
  },
  "Reign-of-Dragons": {
    name: "Reign of Dragons",
    commander: "Lathliss, Dragon Queen",
    cards: [
      ["Lathliss, Dragon Queen", 1], ["Atsushi, the Blazing Sky", 1], ["Blasphemous Act", 1], ["Chaos Warp", 1],
      ["Drakuseth, Maw of Flames", 1], ["Scourge of Valkas", 1], ["Utvara Hellkite", 1], ["Lightning Bolt", 1], ["Mountain", 32]
    ]
  },
  "Tramplesaurus-Rex": {
    name: "Tramplesaurus Rex",
    commander: "Ghalta, Primal Hunger",
    cards: [
      ["Ghalta, Primal Hunger", 1], ["Birds of Paradise", 1], ["Carnage Tyrant", 1], ["Elder Gargaroth", 1],
      ["Garruk's Uprising", 1], ["Llanowar Elves", 1], ["Overwhelming Stampede", 1], ["Forest", 32]
    ]
  },
  "Wretched-Ranks": {
    name: "Wretched Ranks",
    commander: "Ghoulcaller Gisa",
    cards: [
      ["Ghoulcaller Gisa", 1], ["Army of the Damned", 1], ["Cemetery Reaper", 1], ["Cryptbreaker", 1],
      ["Gravecrawler", 1], ["Gray Merchant of Asphodel", 1], ["Phyrexian Arena", 1], ["Swamp", 33]
    ]
  },
  "Hatsune-Miku": {
    name: "Hatsune Miku",
    commander: "Trostani, Selesnya's Voice",
    cards: [
      ["Trostani, Selesnya's Voice", 1], ["Archangel of Thune", 1], ["Cultivate", 1], ["Finale of Devastation", 1],
      ["Path to Exile", 1], ["Swords to Plowshares", 1], ["Sol Ring", 1]
    ]
  },
  "Avengers-Assemble": {
    name: "Avengers Assemble",
    commander: "Captain America, Team Leader",
    cards: [
      ["Captain America, Team Leader", 1], ["Iron Man, Armored Avenger", 1], ["Thor, Asgard's Avenger", 1],
      ["Swords to Plowshares", 1], ["Arcane Signet", 1], ["Sol Ring", 1]
    ]
  },
  "Doom-Prevails": {
    name: "Doom Prevails",
    commander: "Doctor Doom, King of Latveria",
    cards: [
      ["Doctor Doom, King of Latveria", 1], ["Toxic Deluge", 1], ["Blasphemous Act", 1], ["Chaos Warp", 1],
      ["Skullclamp", 1], ["Sol Ring", 1]
    ]
  },
  "The-Fantastic-Four": {
    name: "The Fantastic Four",
    commander: "Invisible Woman",
    cards: [
      ["Invisible Woman", 1], ["Mister Fantastic", 1], ["Human Torch", 1], ["The Thing", 1],
      ["Galactus, Devourer of Worlds", 1], ["Cultivate", 1], ["Sol Ring", 1]
    ]
  },
  "Wakanda-Forever": {
    name: "Wakanda Forever",
    commander: "T'Challa, the Black Panther",
    cards: [
      ["T'Challa, the Black Panther", 1], ["Shuri, the Black Panther", 1], ["Storm, Queen of Wakanda", 1],
      ["Divine Visitation", 1], ["Sol Ring", 1]
    ]
  },
  "Goblin-Storm": {
    name: "Goblin Storm",
    commander: "Zada, Hedron Grinder",
    cards: [
      ["Zada, Hedron Grinder", 1], ["Krenko, Mob Boss", 1], ["Skirk Prospector", 1], ["Skullclamp", 1],
      ["Impact Tremors", 1], ["Mana Geyser", 1], ["Sol Ring", 1]
    ]
  }
};

function UpgradeContent() {
  const searchParams = useSearchParams();
  const preconSlug = searchParams.get("precon") || "Calling-All-Angels";
  
  const [selectedKey, setSelectedKey] = useState(preconSlug);
  const [customList, setCustomList] = useState("");
  const [activeTab, setActiveTab] = useState<"precon" | "custom">("precon");

  useEffect(() => {
    if (preconSlug && PRECON_DATA[preconSlug]) {
      setSelectedKey(preconSlug);
    }
  }, [preconSlug]);

  const currentDeck = PRECON_DATA[selectedKey] || PRECON_DATA["Calling-All-Angels"];

  return (
    <section className="panel" style={{ marginTop: "30px" }}>
      <div className="eyebrow">MODULO UPGRADE & TUNING</div>
      <h2>Potenziamento Mazzi Commander</h2>

      {/* Selettore Modalità */}
      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <button 
          onClick={() => setActiveTab("precon")}
          className={`cta ${activeTab === "precon" ? "primary" : "ghost"}`}
          style={{ cursor: "pointer" }}
        >
          Scegli dai Precon Ufficiali
        </button>
        <button 
          onClick={() => setActiveTab("custom")}
          className={`cta ${activeTab === "custom" ? "primary" : "ghost"}`}
          style={{ cursor: "pointer" }}
        >
          Incolla Lista Personalizzata
        </button>
      </div>

      {activeTab === "precon" ? (
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Seleziona un Precon:</label>
          <select 
            value={selectedKey} 
            onChange={(e) => setSelectedKey(e.target.value)}
            style={{ width: "100%", padding: "12px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "8px", fontSize: "16px", marginBottom: "20px" }}
          >
            {Object.keys(PRECON_DATA).map((key) => (
              <option key={key} value={key}>
                {PRECON_DATA[key].name} ({PRECON_DATA[key].commander})
              </option>
            ))}
          </select>

          <div style={{ background: "#18181b", padding: "16px", borderRadius: "8px", border: "1px solid #27272a", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "var(--gold, #d4af37)" }}>{currentDeck.name}</h3>
            <p style={{ margin: 0, color: "#aaa" }}><strong>Comandante:</strong> {currentDeck.commander}</p>
          </div>

          <h4>Anteprima Carte Mazzo:</h4>
          <ul style={{ maxHeight: "250px", overflowY: "auto", background: "#111", padding: "12px 24px", borderRadius: "8px", border: "1px solid #222" }}>
            {currentDeck.cards.map(([card, qty], idx) => (
              <li key={idx} style={{ padding: "4px 0", color: "#ddd" }}>
                {qty}x {card}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div style={{ margin: "20px 0" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Incolla la tua lista (Moxfield, Archidekt o testo):</label>
          <textarea 
            rows={10} 
            value={customList}
            onChange={(e) => setCustomList(e.target.value)}
            placeholder="1 Sol Ring&#10;1 Command Tower&#10;1 Cyclonic Rift..." 
            style={{ width: "100%", padding: "12px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "8px", fontFamily: "monospace" }}
          />
        </div>
      )}

      <button className="cta primary" style={{ width: "100%", marginTop: "20px", border: "none", cursor: "pointer", padding: "14px", fontSize: "16px" }}>
        Calcola Sostituzioni & Upgrade →
      </button>

      <div style={{ marginTop: "20px" }}>
        <Link href="/" className="cta ghost">← Torna alla Home</Link>
      </div>
    </section>
  );
}

export default function UpgradePage() {
  return (
    <main className="shell">
      <header>
        <Link href="/" className="brand" style={{ color: "inherit", textDecoration: "none" }}>
          PRECON UPGRADE <span>NO AI</span>
        </Link>
      </header>

      <Suspense fallback={<div className="panel" style={{ marginTop: "30px" }}>Caricamento modulo...</div>}>
        <UpgradeContent />
      </Suspense>
    </main>
  );
}
