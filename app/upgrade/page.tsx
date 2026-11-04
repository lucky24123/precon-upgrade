"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Database completo associato direttamente ai Comandanti
const COMMANDERS_DATA: Record<string, { name: string; preconName: string; code: string; date: string; cards: [string, number][] }> = {
  "Giada, Font of Hope": {
    name: "Giada, Font of Hope",
    preconName: "Calling All Angels",
    code: "FDC",
    date: "2026-10-02",
    cards: [
      ["Giada, Font of Hope", 1], ["Always Watching", 1], ["Angel of the Ruins", 1], ["Angelic Destiny", 1],
      ["Angelic Field Marshal", 1], ["Archangel of Tithes", 1], ["Austere Command", 1], ["Bishop of Wings", 1],
      ["Lyra Dawnbringer", 1], ["Righteous Valkyrie", 1], ["Sephara, Sky's Blade", 1], ["Swords to Plowshares", 1],
      ["Arcane Signet", 1], ["Sol Ring", 1], ["Plains", 32]
    ]
  },
  "Sai, Master Thopterist": {
    name: "Sai, Master Thopterist",
    preconName: "Keen Engineering",
    code: "FDC",
    date: "2026-10-02",
    cards: [
      ["Sai, Master Thopterist", 1], ["All Is Dust", 1], ["Broodstar", 1], ["Kappa Cannoneer", 1],
      ["Master of Etherium", 1], ["Shimmer Dragon", 1], ["Counterspell", 1], ["Propaganda", 1], ["Thoughtcast", 1], ["Sol Ring", 1], ["Island", 34]
    ]
  },
  "Jace, Multiverse Architect": {
    name: "Jace, Multiverse Architect",
    preconName: "Multiverse Reforged",
    code: "FRC",
    date: "2026-10-02",
    cards: [
      ["Jace, Multiverse Architect", 1], ["Nissa, Leyline Tamer", 1], ["Omnath, Locus of the Void", 1],
      ["Elspeth, Sun's Champion", 1], ["Brainstorm", 1], ["Path to Exile", 1], ["Sol Ring", 1]
    ]
  },
  "Lathliss, Dragon Queen": {
    name: "Lathliss, Dragon Queen",
    preconName: "Reign of Dragons",
    code: "FDC",
    date: "2026-10-02",
    cards: [
      ["Lathliss, Dragon Queen", 1], ["Atsushi, the Blazing Sky", 1], ["Blasphemous Act", 1], ["Chaos Warp", 1],
      ["Drakuseth, Maw of Flames", 1], ["Scourge of Valkas", 1], ["Utvara Hellkite", 1], ["Lightning Bolt", 1], ["Mountain", 32]
    ]
  },
  "Ghalta, Primal Hunger": {
    name: "Ghalta, Primal Hunger",
    preconName: "Tramplesaurus Rex",
    code: "FDC",
    date: "2026-10-02",
    cards: [
      ["Ghalta, Primal Hunger", 1], ["Birds of Paradise", 1], ["Carnage Tyrant", 1], ["Elder Gargaroth", 1],
      ["Garruk's Uprising", 1], ["Llanowar Elves", 1], ["Overwhelming Stampede", 1], ["Forest", 32]
    ]
  },
  "Ghoulcaller Gisa": {
    name: "Ghoulcaller Gisa",
    preconName: "Wretched Ranks",
    code: "FDC",
    date: "2026-10-02",
    cards: [
      ["Ghoulcaller Gisa", 1], ["Army of the Damned", 1], ["Cemetery Reaper", 1], ["Cryptbreaker", 1],
      ["Gravecrawler", 1], ["Gray Merchant of Asphodel", 1], ["Phyrexian Arena", 1], ["Swamp", 33]
    ]
  },
  "Trostani, Selesnya's Voice": {
    name: "Trostani, Selesnya's Voice",
    preconName: "Hatsune Miku",
    code: "SLD",
    date: "2026-08-10",
    cards: [
      ["Trostani, Selesnya's Voice", 1], ["Archangel of Thune", 1], ["Cultivate", 1], ["Finale of Devastation", 1],
      ["Path to Exile", 1], ["Swords to Plowshares", 1], ["Sol Ring", 1]
    ]
  },
  "Captain America, Team Leader": {
    name: "Captain America, Team Leader",
    preconName: "Avengers Assemble",
    code: "MSC",
    date: "2026-06-26",
    cards: [
      ["Captain America, Team Leader", 1], ["Iron Man, Armored Avenger", 1], ["Thor, Asgard's Avenger", 1],
      ["Austere Command", 1], ["Swords to Plowshares", 1], ["Arcane Signet", 1], ["Sol Ring", 1],
      ["Plains", 6], ["Island", 5], ["Mountain", 5]
    ]
  },
  "Doctor Doom, King of Latveria": {
    name: "Doctor Doom, King of Latveria",
    preconName: "Doom Prevails",
    code: "MSC",
    date: "2026-06-26",
    cards: [
      ["Doctor Doom, King of Latveria", 1], ["Toxic Deluge", 1], ["Blasphemous Act", 1], ["Chaos Warp", 1],
      ["Skullclamp", 1], ["Arcane Signet", 1], ["Sol Ring", 1], ["Island", 4], ["Swamp", 6], ["Mountain", 5]
    ]
  },
  "Invisible Woman": {
    name: "Invisible Woman",
    preconName: "The Fantastic Four",
    code: "MSC",
    date: "2026-06-26",
    cards: [
      ["Invisible Woman", 1], ["Mister Fantastic", 1], ["Human Torch", 1], ["The Thing", 1],
      ["Galactus, Devourer of Worlds", 1], ["Cultivate", 1], ["Sol Ring", 1], ["Plains", 5], ["Island", 4], ["Mountain", 3], ["Forest", 5]
    ]
  },
  "T'Challa, the Black Panther": {
    name: "T'Challa, the Black Panther",
    preconName: "Wakanda Forever",
    code: "MSC",
    date: "2026-06-26",
    cards: [
      ["T'Challa, the Black Panther", 1], ["Shuri, the Black Panther", 1], ["Storm, Queen of Wakanda", 1],
      ["Divine Visitation", 1], ["Sol Ring", 1], ["Plains", 12], ["Forest", 12]
    ]
  },
  "Zada, Hedron Grinder": {
    name: "Zada, Hedron Grinder",
    preconName: "Goblin Storm",
    code: "SLD",
    date: "2026-05-18",
    cards: [
      ["Zada, Hedron Grinder", 1], ["Krenko, Mob Boss", 1], ["Skirk Prospector", 1], ["Skullclamp", 1],
      ["Impact Tremors", 1], ["Mana Geyser", 1], ["Sol Ring", 1]
    ]
  }
};

function UpgradeContent() {
  const searchParams = useSearchParams();
  const commanderParam = searchParams.get("commander") || "Giada, Font of Hope";
  
  const [selectedCommander, setSelectedCommander] = useState(commanderParam);
  const [customList, setCustomList] = useState("");
  const [activeTab, setActiveTab] = useState<"commanders" | "custom">("commanders");
  const [resultComputed, setResultComputed] = useState(false);

  useEffect(() => {
    if (commanderParam && COMMANDERS_DATA[commanderParam]) {
      setSelectedCommander(commanderParam);
    }
  }, [commanderParam]);

  const currentDeck = COMMANDERS_DATA[selectedCommander] || COMMANDERS_DATA["Giada, Font of Hope"];

  return (
    <section className="panel" style={{ marginTop: "30px" }}>
      <div className="eyebrow">SELETTORE COMANDANTI & UPGRADE</div>
      <h2>Ottimizzazione per Comandante</h2>

      {/* Selettore Modalità */}
      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <button 
          onClick={() => { setActiveTab("commanders"); setResultComputed(false); }}
          className={`cta ${activeTab === "commanders" ? "primary" : "ghost"}`}
          style={{ cursor: "pointer" }}
        >
          Seleziona per Comandante
        </button>
        <button 
          onClick={() => { setActiveTab("custom"); setResultComputed(false); }}
          className={`cta ${activeTab === "custom" ? "primary" : "ghost"}`}
          style={{ cursor: "pointer" }}
        >
          Incolla Lista Personalizzata
        </button>
      </div>

      {activeTab === "commanders" ? (
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Scegli il Comandante:</label>
          <select 
            value={selectedCommander} 
            onChange={(e) => { setSelectedCommander(e.target.value); setResultComputed(false); }}
            style={{ width: "100%", padding: "12px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "8px", fontSize: "16px", marginBottom: "20px" }}
          >
            {Object.keys(COMMANDERS_DATA).map((cmd) => (
              <option key={cmd} value={cmd}>
                {cmd} — ({COMMANDERS_DATA[cmd].preconName})
              </option>
            ))}
          </select>

          <div style={{ background: "#18181b", padding: "16px", borderRadius: "8px", border: "1px solid #27272a", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "var(--gold, #d4af37)" }}>{currentDeck.name}</h3>
            <p style={{ margin: 0, color: "#aaa" }}><strong>Precon d'origine:</strong> {currentDeck.preconName}</p>
            <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>Set: {currentDeck.code} · Rilasciato: {currentDeck.date}</p>
          </div>

          <h4>Lista Carte in Archivio ({currentDeck.cards.length}):</h4>
          <ul style={{ maxHeight: "200px", overflowY
