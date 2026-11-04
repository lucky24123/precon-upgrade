"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CommanderOption {
  name: string;
  set_name: string;
  set_code: string;
  colors: string[];
  image: string;
}

interface CardDetail {
  name: string;
  price: string;
  type: string;
  image: string;
}

function UpgradeContent() {
  const searchParams = useSearchParams();
  const initialCommander = searchParams.get("commander") || "Giada, Font of Hope";

  const [commandersList, setCommandersList] = useState<CommanderOption[]>([]);
  const [selectedCommander, setSelectedCommander] = useState<string>(initialCommander);
  const [currentCommanderData, setCurrentCommanderData] = useState<CommanderOption | null>(null);
  
  const [customList, setCustomList] = useState("");
  const [activeTab, setActiveTab] = useState<"commanders" | "custom">("commanders");
  
  const [isFetchingList, setIsFetchingList] = useState(true);
  const [isLoadingUpgrade, setIsLoadingUpgrade] = useState(false);
  const [scryfallData, setScryfallData] = useState<{ cuts: CardDetail[]; additions: CardDetail[] } | null>(null);

  // 1. Carica TUTTI i Comandanti ufficiali da Scryfall
  useEffect(() => {
    async function fetchAllCommanders() {
      setIsFetchingList(true);
      try {
        // Query per recuperare tutte le creature leggendarie e Planeswalker usabili come Comandante
        const query = encodeURIComponent("is:commander legal:commander");
        const res = await fetch(`https://api.scryfall.com/cards/search?q=${query}&order=name`);
        const data = await res.json();

        if (data && data.data) {
          const formatted: CommanderOption[] = data.data.map((card: any) => ({
            name: card.name,
            set_name: card.set_name,
            set_code: card.set.toUpperCase(),
            colors: card.color_identity || [],
            image: card.image_uris?.normal || card.image_uris?.small || (card.card_faces ? card.card_faces[0].image_uris?.normal : "")
          }));

          // Ordina alfabeticamente A-Z
          formatted.sort((a, b) => a.name.localeCompare(b.name));
          setCommandersList(formatted);

          const defaultCmd = formatted.find(c => c.name.toLowerCase() === initialCommander.toLowerCase()) || formatted[0];
          if (defaultCmd) {
            setSelectedCommander(defaultCmd.name);
            setCurrentCommanderData(defaultCmd);
          }
        }
      } catch (err) {
        console.error("Errore nel caricamento del catalogo comandanti:", err);
      } finally {
        setIsFetchingList(false);
      }
    }

    fetchAllCommanders();
  }, [initialCommander]);

  // Aggiorna i dati quando l'utente seleziona un comandante diverso dal menu
  const handleCommanderChange = (name: string) => {
    setSelectedCommander(name);
    setScryfallData(null);
    const found = commandersList.find(c => c.name === name);
    if (found) {
      setCurrentCommanderData(found);
    }
  };

  // 2. Calcola Sostituzioni & Upgrade
  const handleCalculateUpgrade = async () => {
    if (!selectedCommander) return;
    setIsLoadingUpgrade(true);
    setScryfallData(null);

    try {
      const colorQuery = currentCommanderData && currentCommanderData.colors.length > 0 
        ? `id<=${currentCommanderData.colors.join("")}` 
        : "id<=c";

      // Query Scryfall: carte ad alta sinergia EDHREC per questa identità di colore, escludendo il comandante
      const query = encodeURIComponent(`f:commander ${colorQuery} -name:"${selectedCommander}"`);
      const res = await fetch(`https://api.scryfall.com/cards/search?q=${query}&order=edhrec`);
      const data = await res.json();

      if (data && data.data) {
        const cleanAdditions = data.data.filter((c: any) => 
          c.name.toLowerCase() !== selectedCommander.toLowerCase() &&
          !c.type_line.includes("Basic Land")
        );

        const topAdditions: CardDetail[] = cleanAdditions.slice(0, 4).map((c: any) => ({
          name: c.name,
          price: c.prices?.eur ? `${c.prices.eur} €` : (c.prices?.usd ? `$${c.prices.usd}` : "0.50 €"),
          type: c.type_line,
          image: c.image_uris?.normal || c.image_uris?.small || (c.card_faces ? c.card_faces[0].image_uris?.normal : "")
        }));

        // Recupera le carte generiche meno usate / sub-ottimali per i tagli
        const cutsQuery = encodeURIComponent(`f:commander ${colorQuery} type:artifact -name:"${selectedCommander}"`);
        const cutsRes = await fetch(`https://api.scryfall.com/cards/search?q=${cutsQuery}&order=edhrec&dir=asc`);
        const cutsData = await cutsRes.json();

        let topCuts: CardDetail[] = [];
        if (cutsData && cutsData.data) {
          topCuts = cutsData.data.slice(0, 4).map((c: any) => ({
            name: c.name,
            price: "Consigliata rimozione",
            type: c.type_line,
            image: c.image_uris?.normal || c.image_uris?.small || (c.card_faces ? c.card_faces[0].image_uris?.normal : "")
          }));
        }

        setScryfallData({ cuts: topCuts, additions: topAdditions });
      }
    } catch (err) {
      console.error("Errore nell'analisi degli upgrade:", err);
    } finally {
      setIsLoadingUpgrade(false);
    }
  };

  return (
    <section className="panel" style={{ marginTop: "30px" }}>
      <div className="eyebrow">CATALOGO GLOBALE COMMANDER</div>
      <h2>Database Completo Comandanti</h2>

      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <button 
          onClick={() => { setActiveTab("commanders"); setScryfallData(null); }}
          className={`cta ${activeTab === "commanders" ? "primary" : "ghost"}`}
          style={{ cursor: "pointer" }}
        >
          Sfoglia Tutti i Comandanti
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
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Seleziona Comandante ({isFetchingList ? "Caricamento archivio in corso..." : `${commandersList.length} Comandanti Trovati`}):
          </label>

          <select 
            value={selectedCommander} 
            disabled={isFetchingList}
            onChange={(e) => handleCommanderChange(e.target.value)}
            style={{ width: "100%", padding: "12px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "8px", fontSize: "16px", marginBottom: "20px" }}
          >
            {commandersList.map((cmd) => (
              <option key={cmd.name} value={cmd.name}>
                {cmd.name} ({cmd.set_code})
              </option>
            ))}
          </select>

          {/* Scheda Comandante Selezionato */}
          {currentCommanderData && (
            <div style={{ display: "flex", gap: "20px", background: "#18181b", padding: "16px", borderRadius: "8px", border: "1px solid #27272a", marginBottom: "20px", alignItems: "center" }}>
              {currentCommanderData.image && (
                <img src={currentCommanderData.image} alt={currentCommanderData.name} style={{ width: "120px", borderRadius: "8px", border: "1px solid #444" }} />
              )}
              <div>
                <h3 style={{ margin: "0 0 8px 0", color: "var(--gold, #d4af37)" }}>{currentCommanderData.name}</h3>
                <p style={{ margin: 0, color: "#aaa" }}><strong>Set:</strong> {currentCommanderData.set_name} ({currentCommanderData.set_code})</p>
                <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
                  <strong>Colori:</strong> {currentCommanderData.colors.length > 0 ? currentCommanderData.colors.join(", ") : "Incolore"}
                </p>
              </div>
            </div>
          )}
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

      {/* Pulsante di Calcolo */}
      <button 
        onClick={handleCalculateUpgrade}
        disabled={isLoadingUpgrade || isFetchingList}
        className="cta primary" 
        style={{ width: "100%", border: "none", cursor: (isLoadingUpgrade || isFetchingList) ? "wait" : "pointer", padding: "14px", fontSize: "16px", opacity: (isLoadingUpgrade || isFetchingList) ? 0.7 : 1 }}
      >
        {isLoadingUpgrade ? "⚡ Calcolo Ottimizzazione & Foto Carte in corso..." : "Calcola Sostituzioni & Upgrade →"}
      </button>

      {/* Risultati Upgrade */}
      {scryfallData && (
        <div style={{ marginTop: "30px", background: "#111", padding: "20px", borderRadius: "10px", border: "1px solid var(--gold, #d4af37)" }}>
          <h3 style={{ color: "var(--gold, #d4af37)", marginTop: 0 }}>📊 Report Ottimizzazione per {selectedCommander}</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
            
            {/* TAGLI */}
            <div style={{ background: "#1a1a1a", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #ff6b6b" }}>
              <h4 style={{ color: "#ff6b6b", marginTop: 0 }}>❌ Sostituzioni Consigliate:</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {scryfallData.cuts.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#222", padding: "8px", borderRadius: "6px" }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: "50px", borderRadius: "4px" }} />}
                    <div>
                      <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>{item.name}</strong>
                      <span style={{ color: "#aaa", fontSize: "12px" }}>{item.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AGGIUNTE */}
            <div style={{ background: "#1a1a1a", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #51cf66" }}>
              <h4 style={{ color: "#51cf66", marginTop: 0 }}>✅ Carte Consigliate (EDHREC Top):</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {scryfallData.additions.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#222", padding: "8px", borderRadius: "6px" }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: "50px", borderRadius: "4px" }} />}
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

      <Suspense fallback={<div className="panel" style={{ marginTop: "30px" }}>Caricamento catalogo...</div>}>
        <UpgradeContent />
      </Suspense>
    </main>
  );
}
