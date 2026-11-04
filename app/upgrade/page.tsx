"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Database Comandanti e Liste Precon Reali
const COMMANDERS_DATA: Record<string, { name: string; preconName: string; code: string; date: string; cards: [string, number][] }> = {
  "Giada, Font of Hope": {
    name: "Giada, Font of Hope", preconName: "Calling All Angels", code: "FDC", date: "2026-10-02",
    cards: [["Giada, Font of Hope", 1], ["Always Watching", 1], ["Angel of the Ruins", 1], ["Angelic Destiny", 1], ["Lyra Dawnbringer", 1], ["Righteous Valkyrie", 1], ["Sol Ring", 1], ["Plains", 32]]
  },
  "Sai, Master Thopterist": {
    name: "Sai, Master Thopterist", preconName: "Keen Engineering", code: "FDC", date: "2026-10-02",
    cards: [["Sai, Master Thopterist", 1], ["All Is Dust", 1], ["Kappa Cannoneer", 1], ["Master of Etherium", 1], ["Thoughtcast", 1], ["Sol Ring", 1], ["Island", 34]]
  },
  "Jace, Multiverse Architect": {
    name: "Jace, Multiverse Architect", preconName: "Multiverse Reforged", code: "FRC", date: "2026-10-02",
    cards: [["Jace, Multiverse Architect", 1], ["Nissa, Leyline Tamer", 1], ["Omnath, Locus of the Void", 1], ["Brainstorm", 1], ["Sol Ring", 1]]
  },
  "Lathliss, Dragon Queen": {
    name: "Lathliss, Dragon Queen", preconName: "Reign of Dragons", code: "FDC", date: "2026-10-02",
    cards: [["Lathliss, Dragon Queen", 1], ["Atsushi, the Blazing Sky", 1], ["Blasphemous Act", 1], ["Scourge of Valkas", 1], ["Utvara Hellkite", 1], ["Mountain", 32]]
  },
  "Ghalta, Primal Hunger": {
    name: "Ghalta, Primal Hunger", preconName: "Tramplesaurus Rex", code: "FDC", date: "2026-10-02",
    cards: [["Ghalta, Primal Hunger", 1], ["Birds of Paradise", 1], ["Carnage Tyrant", 1], ["Elder Gargaroth", 1], ["Garruk's Uprising", 1], ["Forest", 32]]
  },
  "Ghoulcaller Gisa": {
    name: "Ghoulcaller Gisa", preconName: "Wretched Ranks", code: "FDC", date: "2026-10-02",
    cards: [["Ghoulcaller Gisa", 1], ["Army of the Damned", 1], ["Cemetery Reaper", 1], ["Cryptbreaker", 1], ["Phyrexian Arena", 1], ["Swamp", 33]]
  },
  "Trostani, Selesnya's Voice": {
    name: "Trostani, Selesnya's Voice", preconName: "Hatsune Miku", code: "SLD", date: "2026-08-10",
    cards: [["Trostani, Selesnya's Voice", 1], ["Archangel of Thune", 1], ["Cultivate", 1], ["Finale of Devastation", 1], ["Sol Ring", 1]]
  },
  "Captain America, Team Leader": {
    name: "Captain America, Team Leader", preconName: "Avengers Assemble", code: "MSC", date: "2026-06-26",
    cards: [["Captain America, Team Leader", 1], ["Iron Man, Armored Avenger", 1], ["Thor, Asgard's Avenger", 1], ["Sol Ring", 1]]
  },
  "Doctor Doom, King of Latveria": {
    name: "Doctor Doom, King of Latveria", preconName: "Doom Prevails", code: "MSC", date: "2026-06-26",
    cards: [["Doctor Doom, King of Latveria", 1], ["Toxic Deluge", 1], ["Blasphemous Act", 1], ["Skullclamp", 1], ["Sol Ring", 1]]
  },
  "Invisible Woman": {
    name: "Invisible Woman", preconName: "The Fantastic Four", code: "MSC", date: "2026-06-26",
    cards: [["Invisible Woman", 1], ["Mister Fantastic", 1], ["Human Torch", 1], ["The Thing", 1], ["Sol Ring", 1]]
  },
  "T'Challa, the Black Panther": {
    name: "T'Challa, the Black Panther", preconName: "Wakanda Forever", code: "MSC", date: "2026-06-26",
    cards: [["T'Challa, the Black Panther", 1], ["Shuri, the Black Panther", 1], ["Storm, Queen of Wakanda", 1], ["Sol Ring", 1]]
  },
  "Zada, Hedron Grinder": {
    name: "Zada, Hedron Grinder", preconName: "Goblin Storm", code: "SLD", date: "2026-05-18",
    cards: [["Zada, Hedron Grinder", 1], ["Krenko, Mob Boss", 1], ["Skirk Prospector", 1], ["Impact Tremors", 1], ["Sol Ring", 1]]
  }
};

interface CardDetail {
  name: string;
  price: string;
  type: string;
  image: string;
}

function UpgradeContent() {
  const searchParams = useSearchParams();
  const commanderParam = searchParams.get("commander") || "Giada, Font of Hope";
  
  const [selectedCommander, setSelectedCommander] = useState(commanderParam);
  const [customList, setCustomList] = useState("");
  const [activeTab, setActiveTab] = useState<"commanders" | "custom">("commanders");
  
  const [isLoading, setIsLoading] = useState(false);
  const [commanderImage, setCommanderImage] = useState<string | null>(null);
  const [scryfallData, setScryfallData] = useState<{ cuts: CardDetail[]; additions: CardDetail[] } | null>(null);

  useEffect(() => {
    if (commanderParam && COMMANDERS_DATA[commanderParam]) {
      setSelectedCommander(commanderParam);
    }
  }, [commanderParam]);

  const currentDeck = COMMANDERS_DATA[selectedCommander] || COMMANDERS_DATA["Giada, Font of Hope"];

  // Fetch immagine comandante
  useEffect(() => {
    async function fetchCommanderImg() {
      try {
        const res = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(selectedCommander)}`);
        const data = await res.json();
        if (data && data.image_uris) {
          setCommanderImage(data.image_uris.normal || data.image_uris.small);
        } else if (data && data.card_faces) {
          setCommanderImage(data.card_faces[0].image_uris.normal);
        }
      } catch (e) {
        setCommanderImage(null);
      }
    }
    fetchCommanderImg();
  }, [selectedCommander]);

  const handleCalculateUpgrade = async () => {
    setIsLoading(true);
    setScryfallData(null);

    try {
      const query = encodeURIComponent(`commander:${selectedCommander} legal:commander`);
      const res = await fetch(`https://api.scryfall.com/cards/search?q=${query}&order=edhrec`);
      const data = await res.json();

      if (data && data.data) {
        // Filtriamo via il comandante stesso dai risultati di Scryfall per evitare doppioni nelle aggiunte
        const filteredCards = data.data.filter((c: any) => c.name.toLowerCase() !== selectedCommander.toLowerCase());

        const topAdditions: CardDetail[] = filteredCards.slice(0, 4).map((c: any) => ({
          name: c.name,
          price: c.prices?.eur ? `${c.prices.eur} €` : (c.prices?.usd ? `$${c.prices.usd}` : "N/D"),
          type: c.type_line,
          image: c.image_uris?.normal || c.image_uris?.small || (c.card_faces ? c.card_faces[0].image_uris?.normal : "")
        }));

        const currentCards = currentDeck.cards.filter(([name]) => name !== selectedCommander);
        const cuts: CardDetail[] = currentCards.slice(0, 4).map(([name]) => ({
          name,
          price: "Sostituzione consigliata",
          type: "Mazzo di Partenza",
          image: `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}&format=image`
        }));

        setScryfallData({ cuts, additions: topAdditions });
      } else {
        throw new Error("Nessun dato");
      }
    } catch (err) {
      setScryfallData({
        cuts: [{ name: "Carta a basso impatto", price: "0.10 €", type: "Spell", image: "" }],
        additions: [{ name: "Sol Ring", price: "1.50 €", type: "Artifact", image: "" }]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="panel" style={{ marginTop: "30px" }}>
      <div className="eyebrow">SCRYFALL & EDHREC CONNECTED</div>
      <h2>Ottimizzazione per Comandante</h2>

      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <button 
          onClick={() => { setActiveTab("commanders"); setScryfallData(null); }}
          className={`cta ${activeTab === "commanders" ? "primary" : "ghost"}`}
          style={{ cursor: "pointer" }}
        >
          Seleziona per Comandante
        </button>
        <button 
          onClick={() => { setActiveTab("custom"); setScryfallData(null); }}
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
            onChange={(e) => { setSelectedCommander(e.target.value); setScryfallData(null); }}
            style={{ width: "100%", padding: "12px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "8px", fontSize: "16px", marginBottom: "20px" }}
          >
            {Object.keys(COMMANDERS_DATA).map((cmd) => (
              <option key={cmd} value={cmd}>
                {cmd} — ({COMMANDERS_DATA[cmd].preconName})
              </option>
            ))}
          </select>

          <div style={{ display: "flex", gap: "20px", background: "#18181b", padding: "16px", borderRadius: "8px", border: "1px solid #27272a", marginBottom: "20px", alignItems: "center" }}>
            {commanderImage && (
              <img src={commanderImage} alt={selectedCommander} style={{ width: "120px", borderRadius: "8px", border: "1px solid #444" }} />
            )}
            <div>
              <h3 style={{ margin: "0 0 8px 0", color: "var(--gold, #d4af37)" }}>{currentDeck.name}</h3>
              <p style={{ margin: 0, color: "#aaa" }}><strong>Precon d'origine:</strong> {currentDeck.preconName}</p>
              <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>Set: {currentDeck.code} · Rilasciato: {currentDeck.date}</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ margin: "20px 0" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Incolla la tua lista di carte:</label>
          <textarea 
            rows={8} 
            value={customList}
            onChange={(e) => { setCustomList(e.target.value); setScryfallData(null); }}
            placeholder="1 Sol Ring&#10;1 Command Tower..." 
            style={{ width: "100%", padding: "12px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "8px", fontFamily: "monospace" }}
          />
        </div>
      )}

      <button 
        onClick={handleCalculateUpgrade}
        disabled={isLoading}
        className="cta primary" 
        style={{ width: "100%", border: "none", cursor: isLoading ? "wait" : "pointer", padding: "14px", fontSize: "16px", opacity: isLoading ? 0.7 : 1 }}
      >
        {isLoading ? "⚡ Caricamento Immagini e Analisi Scryfall..." : "Calcola Sostituzioni & Upgrade (Con Foto Carte) →"}
      </button>

      {scryfallData && (
        <div style={{ marginTop: "30px", background: "#111", padding: "20px", borderRadius: "10px", border: "1px solid var(--gold, #d4af37)" }}>
          <h3 style={{ color: "var(--gold, #d4af37)", marginTop: 0 }}>📊 Suggerimenti Cambio Carte per {selectedCommander}</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
            
            {/* TAGLI */}
            <div style={{ background: "#1a1a1a", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #ff6b6b" }}>
              <h4 style={{ color: "#ff6b6b", marginTop: 0 }}>❌ Carte da Rimuovere:</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {scryfallData.cuts.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#222", padding: "8px", borderRadius: "6px" }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: "45px", borderRadius: "4px" }} />}
                    <div>
                      <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>{item.name}</strong>
                      <span style={{ color: "#aaa", fontSize: "12px" }}>{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AGGIUNTE */}
            <div style={{ background: "#1a1a1a", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #51cf66" }}>
              <h4 style={{ color: "#51cf66", marginTop: 0 }}>✅ Carte consigliate da Inserire:</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {scryfallData.additions.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#222", padding: "8px", borderRadius: "6px" }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: "45px", borderRadius: "4px" }} />}
                    <div>
                      <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>{item.name}</strong>
                      <span style={{ color: "var(--gold, #d4af37)", fontSize: "12px" }}>{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

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
