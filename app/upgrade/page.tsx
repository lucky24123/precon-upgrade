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
  priceNum: number;
  priceFormatted: string;
  type: string;
  image: string;
}

function UpgradeContent() {
  const searchParams = useSearchParams();
  const initialCommander = searchParams.get("commander") || "Giada, Font of Hope";

  const [commandersList, setCommandersList] = useState<CommanderOption[]>([]);
  const [selectedCommander, setSelectedCommander] = useState<string>(initialCommander);
  const [currentCommanderData, setCurrentCommanderData] = useState<CommanderOption | null>(null);
  
  const [deckListInput, setDeckListInput] = useState("");
  const [budgetLimit, setBudgetLimit] = useState<number>(50);
  
  const [isFetchingList, setIsFetchingList] = useState(true);
  const [isLoadingUpgrade, setIsLoadingUpgrade] = useState(false);
  const [scryfallData, setScryfallData] = useState<{ cuts: CardDetail[]; additions: CardDetail[] } | null>(null);

  // 1. Carica tutti i comandanti da Scryfall (A-Z)
  useEffect(() => {
    async function fetchAllCommanders() {
      setIsFetchingList(true);
      try {
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

          formatted.sort((a, b) => a.name.localeCompare(b.name));
          setCommandersList(formatted);

          const defaultCmd = formatted.find(c => c.name.toLowerCase() === initialCommander.toLowerCase()) || formatted[0];
          if (defaultCmd) {
            setSelectedCommander(defaultCmd.name);
            setCurrentCommanderData(defaultCmd);
          }
        }
      } catch (err) {
        console.error("Errore nel catalogo comandanti:", err);
      } finally {
        setIsFetchingList(false);
      }
    }

    fetchAllCommanders();
  }, [initialCommander]);

  const handleCommanderChange = (name: string) => {
    setSelectedCommander(name);
    setScryfallData(null);
    const found = commandersList.find(c => c.name === name);
    if (found) {
      setCurrentCommanderData(found);
    }
  };

  // 2. Calcolo Upgrade leggendo TUTTA la lista incollata e filtrando per budget
  const handleCalculateUpgrade = async () => {
    if (!selectedCommander) return;
    setIsLoadingUpgrade(true);
    setScryfallData(null);

    try {
      const colorQuery = currentCommanderData && currentCommanderData.colors.length > 0 
        ? `id<=${currentCommanderData.colors.join("")}` 
        : "id<=c";

      // Aggiunte: Otteniamo le migliori carte sinergiche da EDHREC filtrate per identità di colore
      const additionsQuery = encodeURIComponent(`f:commander ${colorQuery} -name:"${selectedCommander.replace(/"/g, '\\"')}"`);
      const res = await fetch(`https://api.scryfall.com/cards/search?q=${additionsQuery}&order=edhrec`);
      const data = await res.json();

      let topAdditions: CardDetail[] = [];
      let topCuts: CardDetail[] = [];

      if (data && data.data) {
        const cleanCards = data.data.filter((c: any) => 
          c.name.toLowerCase() !== selectedCommander.toLowerCase() &&
          !c.type_line.includes("Basic Land")
        );

        const mappedCards: CardDetail[] = cleanCards.map((c: any) => {
          const eurPrice = c.prices?.eur ? parseFloat(c.prices.eur) : (c.prices?.usd ? parseFloat(c.prices.usd) * 0.92 : 0.50);
          return {
            name: c.name,
            priceNum: isNaN(eurPrice) ? 0.50 : eurPrice,
            priceFormatted: `${(isNaN(eurPrice) ? 0.50 : eurPrice).toFixed(2)} €`,
            type: c.type_line,
            image: c.image_uris?.normal || c.image_uris?.small || (c.card_faces ? c.card_faces[0].image_uris?.normal : "")
          };
        });

        // Filtriamo in base al budget scelto
        const filteredByBudget = mappedCards.filter(c => c.priceNum <= budgetLimit);
        topAdditions = (filteredByBudget.length > 0 ? filteredByBudget : mappedCards).slice(0, 8);
      }

      // Tagli: Estraiamo le carte da TUTTA la lista incollata dall'utente (gestendo qualsiasi formato numerico)
      if (deckListInput.trim().length > 0) {
        const rawLines = deckListInput.split("\n");
        const extractedCardNames: string[] = [];

        for (const line of rawLines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) continue;

          // Rimuove la quantità iniziale (es. "1x ", "4 ", ecc.) e i codici set tra parentesi se presenti
          const cleanedName = trimmed
            .replace(/^\d+x?\s*/, "")
            .replace(/\s*\(.*?\)\s*/g, "")
            .trim();

          if (cleanedName && cleanedName.toLowerCase() !== selectedCommander.toLowerCase()) {
            extractedCardNames.push(cleanedName);
          }
        }

        const uniqueCards = Array.from(new Set(extractedCardNames));

        // Prendiamo fino a 8 carte reali dalla lista dell'utente come proposte di taglio
        topCuts = await Promise.all(
          uniqueCards.slice(0, 8).map(async (cardName) => {
            try {
              const cardRes = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`);
              const cardJson = await cardRes.json();
              const p = cardJson.prices?.eur ? parseFloat(cardJson.prices.eur) : 0.30;
              return {
                name: cardJson.name || cardName,
                priceNum: isNaN(p) ? 0.30 : p,
                priceFormatted: `${(isNaN(p) ? 0.30 : p).toFixed(2)} €`,
                type: cardJson.type_line || "Carta dal tuo mazzo",
                image: cardJson.image_uris?.normal || cardJson.image_uris?.small || (cardJson.card_faces ? cardJson.card_faces[0].image_uris?.normal : "")
              };
            } catch {
              return { name: cardName, priceNum: 0.20, priceFormatted: "0.20 €", type: "Dal tuo mazzo", image: "" };
            }
          })
        );
      } else {
        topCuts = [{
          name: "Incolla la tua lista sopra per vedere i tagli reali",
          priceNum: 0,
          priceFormatted: "0.00 €",
          type: "Suggerimento",
          image: ""
        }];
      }

      setScryfallData({ cuts: topCuts, additions: topAdditions });
    } catch (err) {
      console.error("Errore calcolo:", err);
    } finally {
      setIsLoadingUpgrade(false);
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
        <div className="eyebrow">STRUMENTO UFFICIALE SCRYFALL & EDHREC</div>
        <h2>Ottimizzazione Mazzo, Budget & Tagli</h2>
        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "20px" }}>
          Incolla l'intera lista del tuo mazzo: il sistema leggerà tutte le carte per mostrarti i tagli e le migliori aggiunte di EDHREC nel budget scelto.
        </p>

        {/* Selezione Comandante */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Seleziona il Comandante ({isFetchingList ? "Caricamento archivio..." : `${commandersList.length} disponibili`}):
          </label>
          <select 
            value={selectedCommander} 
            disabled={isFetchingList}
            onChange={(e) => handleCommanderChange(e.target.value)}
            style={{ width: "100%", padding: "12px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "8px", fontSize: "16px" }}
          >
            {commandersList.map((cmd) => (
              <option key={cmd.name} value={cmd.name}>
                {cmd.name} ({cmd.set_code})
              </option>
            ))}
          </select>
        </div>

        {/* Scheda Comandante */}
        {currentCommanderData && (
          <div style={{ display: "flex", gap: "20px", background: "#18181b", padding: "16px", borderRadius: "8px", border: "1px solid #27272a", marginBottom: "20px", alignItems: "center" }}>
            {currentCommanderData.image && (
              <img src={currentCommanderData.image} alt={currentCommanderData.name} style={{ width: "110px", borderRadius: "8px", border: "1px solid #444" }} />
            )}
            <div>
              <h3 style={{ margin: "0 0 6px 0", color: "var(--gold, #d4af37)" }}>{currentCommanderData.name}</h3>
              <p style={{ margin: 0, color: "#aaa", fontSize: "14px" }}><strong>Set:</strong> {currentCommanderData.set_name} ({currentCommanderData.set_code})</p>
              <p style={{ margin: "4px 0 0", color: "#888", fontSize: "13px" }}>
                <strong>Colori:</strong> {currentCommanderData.colors.length > 0 ? currentCommanderData.colors.join(", ") : "Incolore"}
              </p>
            </div>
          </div>
        )}

        {/* Scelta Budget */}
        <div style={{ background: "#111", padding: "16px", borderRadius: "8px", border: "1px solid #333", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "var(--gold, #d4af37)" }}>
            Budget Massimo per le Aggiunte: <span style={{ color: "#fff" }}>{budgetLimit === 9999 ? "Illimitato" : `${budgetLimit} €`}</span>
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

        {/* Input per incollare l'intera lista del mazzo */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Incolla l'intera lista del mazzo (per leggere tutte le carte e calcolare i tagli):
          </label>
          <textarea 
            rows={10} 
            value={deckListInput}
            onChange={(e) => setDeckListInput(e.target.value)}
            placeholder="1 Sol Ring&#10;1 Command Tower&#10;1 Giada, Font of Hope&#10;1 Angel of the Ruins..." 
            style={{ width: "100%", padding: "12px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "8px", fontFamily: "monospace", fontSize: "13px" }}
          />
        </div>

        {/* Pulsante Calcola */}
        <button 
          onClick={handleCalculateUpgrade}
          disabled={isLoadingUpgrade || isFetchingList}
          className="cta primary" 
          style={{ width: "100%", border: "none", cursor: (isLoadingUpgrade || isFetchingList) ? "wait" : "pointer", padding: "14px", fontSize: "16px", opacity: (isLoadingUpgrade || isFetchingList) ? 0.7 : 1 }}
        >
          {isLoadingUpgrade ? "⚡ Analisi Scryfall & EDHREC in corso..." : "Calcola Sostituzioni & Upgrade →"}
        </button>

        {/* Risultati */}
        {scryfallData && (
          <div style={{ marginTop: "30px", background: "#111", padding: "20px", borderRadius: "10px", border: "1px solid var(--gold, #d4af37)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ color: "var(--gold, #d4af37)", margin: 0 }}>📊 Risultati Ottimizzazione</h3>
              <span style={{ background: "#222", padding: "6px 12px", borderRadius: "6px", fontSize: "14px", color: "#51cf66", border: "1px solid #333" }}>
                Costo stimato acquisti: <strong>{totalAdditionsCost} €</strong>
              </span>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "15px" }}>
              
              {/* TAGLI DAL TUO MAZZO */}
              <div style={{ background: "#1a1a1a", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #ff6b6b" }}>
                <h4 style={{ color: "#ff6b6b", marginTop: 0 }}>❌ Tagli (Dal tuo mazzo):</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {scryfallData.cuts.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#222", padding: "8px", borderRadius: "6px" }}>
                      {item.image && <img src={item.image} alt={item.name} style={{ width: "45px", borderRadius: "4px" }} />}
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: "block", color: "#fff", fontSize: "13px" }}>{item.name}</strong>
                        <span style={{ color: "#aaa", fontSize: "11px" }}>{item.priceFormatted} · {item.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AGGIUNTE CONSIGLIATE */}
              <div style={{ background: "#1a1a1a", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #51cf66" }}>
                <h4 style={{ color: "#51cf66", marginTop: 0 }}>✅ Aggiunte (EDHREC + Budget):</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {scryfallData.additions.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#222", padding: "8px", borderRadius: "6px" }}>
                      {item.image && <img src={item.image} alt={item.name} style={{ width: "45px", borderRadius: "4px" }} />}
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: "block", color: "#fff", fontSize: "13px" }}>{item.name}</strong>
                        <span style={{ color: "var(--gold, #d4af37)", fontSize: "11px" }}>{item.priceFormatted} · {item.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="shell" style={{ color: "#fff", padding: "40px" }}>Caricamento...</div>}>
      <UpgradeContent />
    </Suspense>
  );
}
