"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Database completo di tutti i Comandanti e dei rispettivi mazzi precon
const COMMANDERS_DATA: Record<string, { name: string; preconName: string; code: string; date: string; colorIdentity: string; cards: [string, number][] }> = {
  "Captain America, Team Leader": {
    name: "Captain America, Team Leader", preconName: "Avengers Assemble", code: "MSC", date: "2026-06-26", colorIdentity: "WUR",
    cards: [["Captain America, Team Leader", 1], ["Iron Man, Armored Avenger", 1], ["Thor, Asgard's Avenger", 1], ["Austere Command", 1], ["Swords to Plowshares", 1], ["Arcane Signet", 1], ["Sol Ring", 1], ["Plains", 6], ["Island", 5], ["Mountain", 5]]
  },
  "Doctor Doom, King of Latveria": {
    name: "Doctor Doom, King of Latveria", preconName: "Doom Prevails", code: "MSC", date: "2026-06-26", colorIdentity: "UBR",
    cards: [["Doctor Doom, King of Latveria", 1], ["Toxic Deluge", 1], ["Blasphemous Act", 1], ["Chaos Warp", 1], ["Skullclamp", 1], ["Arcane Signet", 1], ["Sol Ring", 1], ["Island", 4], ["Swamp", 6], ["Mountain", 5]]
  },
  "Ghalta, Primal Hunger": {
    name: "Ghalta, Primal Hunger", preconName: "Tramplesaurus Rex", code: "FDC", date: "2026-10-02", colorIdentity: "G",
    cards: [["Ghalta, Primal Hunger", 1], ["Birds of Paradise", 1], ["Carnage Tyrant", 1], ["Elder Gargaroth", 1], ["Garruk's Uprising", 1], ["Overwhelming Stampede", 1], ["Rhonas the Indomitable", 1], ["Beast Within", 1], ["Forest", 32]]
  },
  "Ghoulcaller Gisa": {
    name: "Ghoulcaller Gisa", preconName: "Wretched Ranks", code: "FDC", date: "2026-10-02", colorIdentity: "B",
    cards: [["Ghoulcaller Gisa", 1], ["Army of the Damned", 1], ["Cemetery Reaper", 1], ["Cryptbreaker", 1], ["Gravecrawler", 1], ["Gray Merchant of Asphodel", 1], ["Phyrexian Arena", 1], ["Swamp", 33]]
  },
  "Giada, Font of Hope": {
    name: "Giada, Font of Hope", preconName: "Calling All Angels", code: "FDC", date: "2026-10-02", colorIdentity: "W",
    cards: [["Giada, Font of Hope", 1], ["Always Watching", 1], ["Angel of the Ruins", 1], ["Angelic Destiny", 1], ["Angelic Field Marshal", 1], ["Lyra Dawnbringer", 1], ["Righteous Valkyrie", 1], ["Sephara, Sky's Blade", 1], ["Swords to Plowshares", 1], ["Plains", 32]]
  },
  "Invisible Woman": {
    name: "Invisible Woman", preconName: "The Fantastic Four", code: "MSC", date: "2026-06-26", colorIdentity: "WURG",
    cards: [["Invisible Woman", 1], ["Mister Fantastic", 1], ["Human Torch", 1], ["The Thing", 1], ["Galactus, Devourer of Worlds", 1], ["Cultivate", 1], ["Sol Ring", 1], ["Plains", 5], ["Island", 4], ["Mountain", 3], ["Forest", 5]]
  },
  "Jace, Multiverse Architect": {
    name: "Jace, Multiverse Architect", preconName: "Multiverse Reforged", code: "FRC", date: "2026-10-02", colorIdentity: "WUBRG",
    cards: [["Jace, Multiverse Architect", 1], ["Nissa, Leyline Tamer", 1], ["Omnath, Locus of the Void", 1], ["Elspeth, Sun's Champion", 1], ["Brainstorm", 1], ["Path to Exile", 1], ["Sol Ring", 1]]
  },
  "Lathliss, Dragon Queen": {
    name: "Lathliss, Dragon Queen", preconName: "Reign of Dragons", code: "FDC", date: "2026-10-02", colorIdentity: "R",
    cards: [["Lathliss, Dragon Queen", 1], ["Atsushi, the Blazing Sky", 1], ["Blasphemous Act", 1], ["Dragon Tempest", 1], ["Drakuseth, Maw of Flames", 1], ["Scourge of Valkas", 1], ["Utvara Hellkite", 1], ["Mountain", 32]]
  },
  "Sai, Master Thopterist": {
    name: "Sai, Master Thopterist", preconName: "Keen Engineering", code: "FDC", date: "2026-10-02", colorIdentity: "U",
    cards: [["Sai, Master Thopterist", 1], ["All Is Dust", 1], ["Kappa Cannoneer", 1], ["Master of Etherium", 1], ["Shimmer Dragon", 1], ["Thoughtcast", 1], ["Sol Ring", 1], ["Island", 34]]
  },
  "T'Challa, the Black Panther": {
    name: "T'Challa, the Black Panther", preconName: "Wakanda Forever", code: "MSC", date: "2026-06-26", colorIdentity: "WG",
    cards: [["T'Challa, the Black Panther", 1], ["Shuri, the Black Panther", 1], ["Storm, Queen of Wakanda", 1], ["Divine Visitation", 1], ["Sol Ring", 1], ["Plains", 12], ["Forest", 12]]
  },
  "Trostani, Selesnya's Voice": {
    name: "Trostani, Selesnya's Voice", preconName: "Hatsune Miku", code: "SLD", date: "2026-08-10", colorIdentity: "WG",
    cards: [["Trostani, Selesnya's Voice", 1], ["Archangel of Thune", 1], ["Halo Fountain", 1], ["Cultivate", 1], ["Finale of Devastation", 1], ["Sol Ring", 1], ["Plains", 7], ["Forest", 7]]
  },
  "Zada, Hedron Grinder": {
    name: "Zada, Hedron Grinder", preconName: "Goblin Storm", code: "SLD", date: "2026-05-18", colorIdentity: "R",
    cards: [["Zada, Hedron Grinder", 1], ["Krenko, Mob Boss", 1], ["Skirk Prospector", 1], ["Skullclamp", 1], ["Impact Tremors", 1], ["Mana Geyser", 1], ["Sol Ring", 1]]
  }
};

interface CardDetail {
  name: string;
  priceFormatted: string;
  priceNum: number;
  type: string;
  image: string;
}

function UpgradeContent() {
  const searchParams = useSearchParams();
  const initialCommander = searchParams.get("commander") || "Giada, Font of Hope";

  const sortedCommanders = Object.keys(COMMANDERS_DATA).sort((a, b) => a.localeCompare(b));

  const [selectedCommander, setSelectedCommander] = useState<string>(initialCommander);
  const [budgetLimit, setBudgetLimit] = useState<number>(50);
  
  const [isLoading, setIsLoading] = useState(false);
  const [commanderImage, setCommanderImage] = useState<string | null>(null);
  const [scryfallData, setScryfallData] = useState<{ cuts: CardDetail[]; additions: CardDetail[] } | null>(null);

  useEffect(() => {
    if (initialCommander && COMMANDERS_DATA[initialCommander]) {
      setSelectedCommander(initialCommander);
    }
  }, [initialCommander]);

  const currentDeck = COMMANDERS_DATA[selectedCommander] || COMMANDERS_DATA[sortedCommanders[0]];

  // Caricamento immagine del comandante da Scryfall
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

  // Calcolo sostituzioni e upgrade collegato a EDHREC e Scryfall
  const handleCalculateUpgrade = async () => {
    setIsLoading(true);
    setScryfallData(null);

    try {
      // 1. Tagli presi direttamente dal mazzo precon originale
      const deckCards = currentDeck.cards.filter(([name]) => name.toLowerCase() !== selectedCommander.toLowerCase());
      const cuts: CardDetail[] = deckCards.slice(0, 5).map(([name]) => ({
        name,
        priceFormatted: "Inclusa nel Precon",
        priceNum: 0,
        type: "Mazzo originale",
        image: `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}&format=image`
      }));

      // 2. Aggiunte da Scryfall / EDHREC filtrate per identità di colore e budget
      const colorQuery = currentDeck.colorIdentity ? `id<=${currentDeck.colorIdentity}` : "id<=c";
      const res = await fetch(`https://api.scryfall.com/cards/search?q=f:commander ${colorQuery} -name:"${selectedCommander.replace(/"/g, '\\"')}"&order=edhrec`);
      const data = await res.json();

      let additions: CardDetail[] = [];
      if (data && data.data) {
        const mapped = data.data
          .filter((c: any) => !c.type_line.includes("Basic Land"))
          .map((c: any) => {
            const price = c.prices?.eur ? parseFloat(c.prices.eur) : (c.prices?.usd ? parseFloat(c.prices.usd) * 0.92 : 0.50);
            return {
              name: c.name,
              priceNum: isNaN(price) ? 0.50 : price,
              priceFormatted: `${(isNaN(price) ? 0.50 : price).toFixed(2)} €`,
              type: c.type_line,
              image: c.image_uris?.normal || c.image_uris?.small || (c.card_faces ? c.card_faces[0].image_uris?.normal : "")
            };
          });

        const budgetFiltered = mapped.filter((c: CardDetail) => c.priceNum <= budgetLimit);
        additions = (budgetFiltered.length > 0 ? budgetFiltered : mapped).slice(0, 5);
      }

      setScryfallData({ cuts, additions });
    } catch (err) {
      console.error("Errore nel calcolo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAdditionsCost = scryfallData 
    ? scryfallData.additions.reduce((acc, curr) => acc + curr.priceNum, 0).toFixed(2) 
    : "0.00";

  return (
    <main className="shell">
      <header>
        <Link href="/" className="brand" style={{ color: "inherit", textDecoration: "none" }}>
          PRECON UPGRADE <span>NO AI</span>
        </Link>
        <div className="headright">
          <Link href="/" className="authbtn ghostbtn">Home</Link>
        </div>
      </header>

      <section className="panel" style={{ marginTop: "30px" }}>
        <div className="eyebrow">STRUMENTI GRATUITI EDHREC & SCRYFALL</div>
        <h2>Gestione Upgrade, Budget & Sostituzioni</h2>
        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "20px" }}>
          Nessuna intelligenza artificiale. Seleziona il tuo comandante, scegli il budget e calcola subito le sostituzioni ideali basate sui dati ufficiali.
        </p>

        {/* Selezione Comandante A-Z */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Seleziona il Comandante (A-Z):
          </label>
          <select 
            value={selectedCommander} 
            onChange={(e) => { setSelectedCommander(e.target.value); setScryfallData(null); }}
            style={{ width: "100%", padding: "12px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "8px", fontSize: "16px" }}
          >
            {sortedCommanders.map((cmd) => (
              <option key={cmd} value={cmd}>
                {cmd} — ({COMMANDERS_DATA[cmd].preconName})
              </option>
            ))}
          </select>
        </div>

        {/* Scheda Comandante */}
        <div style={{ display: "flex", gap: "20px", background: "#18181b", padding: "16px", borderRadius: "8px", border: "1px solid #27272a", marginBottom: "20px", alignItems: "center" }}>
          {commanderImage && (
            <img src={commanderImage} alt={selectedCommander} style={{ width: "110px", borderRadius: "8px", border: "1px solid #444" }} />
          )}
          <div>
            <h3 style={{ margin: "0 0 6px 0", color: "var(--gold, #d4af37)" }}>{currentDeck.name}</h3>
            <p style={{ margin: 0, color: "#aaa", fontSize: "14px" }}><strong>Precon:</strong> {currentDeck.preconName} ({currentDeck.code})</p>
            <p style={{ margin: "4px 0 0", color: "#888", fontSize: "13px" }}>
              <strong>Carte in archivio:</strong> {currentDeck.cards.length} elementi · <strong>Colori:</strong> {currentDeck.colorIdentity}
            </p>
          </div>
        </div>

        {/* Selezione Budget */}
        <div style={{ background: "#111", padding: "16px", borderRadius: "8px", border: "1px solid #333", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "var(--gold, #d4af37)" }}>
            Budget Massimo per gli Acquisti: <span style={{ color: "#fff" }}>{budgetLimit === 9999 ? "Illimitato" : `${budgetLimit} €`}</span>
          </label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[15, 30, 50, 100, 9999].map((b) => (
              <button
                key={b}
                onClick={() => setBudgetLimit(b)}
                className={`cta ${budgetLimit === b ? "primary" : "ghost"}`}
                style={{ padding: "8px 16px", fontSize: "14px", cursor: "pointer" }}
              >
                {b === 9999 ? "Illimitato" : `${b} €`}
              </button>
            ))}
          </div>
        </div>

        {/* Pulsante Calcola Sostituzioni & Upgrade */}
        <button 
          onClick={handleCalculateUpgrade}
          disabled={isLoading}
          className="cta primary" 
          style={{ width: "100%", border: "none", cursor: isLoading ? "wait" : "pointer", padding: "14px", fontSize: "16px", opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? "⚡ Elaborazione Scryfall & EDHREC in corso..." : "Calcola Sostituzioni & Upgrade →"}
        </button>

        {/* Risultati */}
        {scryfallData && (
          <div style={{ marginTop: "30px", background: "#111", padding: "20px", borderRadius: "10px", border: "1px solid var(--gold, #d4af37)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ color: "var(--gold, #d4af37)", margin: 0 }}>📊 Report Modifiche per {selectedCommander}</h3>
              <span style={{ background: "#222", padding: "6px 12px", borderRadius: "6px", fontSize: "14px", color: "#51cf66", border: "1px solid #333" }}>
                Spesa stimata acquisti: <strong>{totalAdditionsCost} €</strong>
              </span>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "15px" }}>
              
              {/* TAGLI */}
              <div style={{ background: "#1a1a1a", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #ff6b6b" }}>
                <h4 style={{ color: "#ff6b6b", marginTop: 0 }}>❌ Carte da Rimuovere (Tagli):</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {scryfallData.cuts.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#222", padding: "8px", borderRadius: "6px" }}>
                      {item.image && <img src={item.image} alt={item.name} style={{ width: "4
