"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "it" | "en";

const dict = {
  it: {
    tagline: "Statistiche EDHREC + verifica carte Scryfall",
    navUpgrade: "Migliora il mazzo",
    preconLoaded: (n: string, set: string, y: string) => `Lista ufficiale del precon «${n}» (${set} ${y}) inserita qui sotto. Puoi modificarla, oppure svuotarla e incollare il tuo mazzo.`,
    preconAvailable: (n: string) => `Questo comandante è in un precon ufficiale («${n}»). Hai già una lista tua: se vuoi puoi usare quella del precon.`,
    preconEmpty: (n: string) => `Incolla qui sotto il tuo mazzo, oppure usa la lista ufficiale del precon «${n}».`,
    preconChoose: "Scegli il precon",
    preconUse: "Usa la lista del precon",
    preconClear: "Svuota e incolla la mia",
    // Landing
    landKicker: "Magic: The Gathering · Commander",
    landTitle1: "Entra e crea il tuo mazzo Commander.",
    landTitle2: "O fai l'upgrade del tuo precon.",
    landText: "Strumenti gratuiti basati sulle statistiche di EDHREC e sulle carte di Scryfall, con prezzi in euro e un budget a tua scelta. Nessuna AI.",
    landCtaUpgrade: "Upgrade precon →",
    landCtaBuild: "Crea un mazzo →",
    landF1t: "Upgrade dei precon",
    landF1: "Scrivi il comandante: la lista ufficiale del precon si carica da sola (o incolla la tua). Ricevi le sostituzioni più giocate, con cosa togliere e cosa aggiungere.",
    landF2t: "Mazzi da zero",
    landF2: "Scegli comandante e colori: il sito prepara una base da 100 carte con le carte più usate su EDHREC.",
    landF3t: "Budget in euro",
    landF3: "Imposta quanto vuoi spendere: i prezzi sono quelli della stampa più economica in euro.",
    landImgAlt: "Mazzo di carte su un tappetino verde con dadi e deck box",
    navBuild: "Crea un mazzo →",
    navAria: "Modalità del sito",
    langAria: "Lingua",
    imageMissing: "Immagine non disponibile",
    // Home
    heroLabel: "COMMANDER DECK UPGRADE",
    heroTitle1: "Inserisci il comandante.",
    heroTitle2: "Confronta il mazzo.",
    heroText: "Il sistema confronta la lista con le statistiche del comandante su EDHREC, propone carte non già presenti e le verifica su Scryfall. Nessuna chiave Gemini.",
    commander: "Comandante",
    commanderPh: "Es. Cloud, Ex-SOLDIER",
    deckLabel: "Lista completa del precon",
    deckHint: "Una carta per riga, quantità facoltativa (es. 1 Cloud, Ex-SOLDIER). Le intestazioni tipo “Creature” vengono ignorate; le virgole nei nomi carta sono mantenute.",
    maxSwaps: "Numero massimo di cambi",
    upgrades: "upgrade",
    budgetNew: "Budget totale nuove carte (€)",
    budgetPh: "Es. 40",
    loadingUpgrade: "Leggo le statistiche pubbliche EDHREC e verifico le carte su Scryfall…",
    comparing: "Confronto in corso…",
    findUpgrades: "Trova upgrade →",
    compareFailed: "Confronto non riuscito",
    unexpected: "Errore inatteso",
    upgradeFine: "EDHREC fornisce statistiche di inclusione/sinergia; Scryfall controlla l’identità colore e la legalità Commander. L’algoritmo non usa AI.",
    done: "CONFRONTO COMPLETATO",
    recognized: (n: number, t: number) => `${n} nomi riconosciuti · ${t} copie`,
    notRecognized: (l: string) => `Non riconosciute da Scryfall: ${l}. Correggi la lista per migliorare il confronto.`,
    possibleSwaps: "Possibili sostituzioni",
    swapsCount: (n: number) => `${n} cambi`,
    estTotal: "Totale stimato",
    knownSubtotal: "Subtotale prezzi noti",
    swapFine: "Gli abbinamenti sono suggerimenti automatici basati su popolarità/sinergia, non tagli curati editorialmente.",
    remove: "− TOGLI",
    add: "+ AGGIUNGI",
    cardToRemove: "Carta da togliere",
    estPrice: "Prezzo stimato",
    na: "non disponibile",
    inclusion: "inclusione",
    cutScore: "punteggio carta tagliata",
    compareSites: "Confronta anche sui siti",
    homeFooter1: "Versione: immagini + budget + cambi.",
    homeFooter2: "Immagini tramite Scryfall. Magic e le immagini appartengono ai rispettivi titolari; sito non ufficiale. Prezzi stimati, spedizione esclusa.",
    homeFooter3: "EDHREC non è un’API ufficiale; l’endpoint pubblico può cambiare. Le statistiche non sostituiscono il giudizio sul tuo meta e sul budget.",
    // Crea mazzo
    back: "← Torna agli upgrade",
    buildTitle: "Crea una base di mazzo.",
    buildText: "Scegli i colori, inserisci il comandante e imposta il budget. La lista dovrà essere controllata e personalizzata prima di giocare.",
    colorsLegend: "Colori del comandante",
    colorNames: { W: "Bianco", U: "Blu", B: "Nero", R: "Rosso", G: "Verde" } as Record<string, string>,
    colorlessHint: "Nessun colore selezionato = incolore. Il server deve verificare la corrispondenza con l’identità del comandante.",
    commanderOfficial: "Comandante — nome ufficiale",
    commanderOfficialPh: "Inserisci il nome del comandante",
    budgetTotal: "Budget totale in euro — facoltativo",
    budgetTotalPh: "Es. 100",
    budgetHint: "Comprende comandante e terre. Prezzi stimati; spedizione esclusa. Il livello di gioco e la scelta automatica del comandante saranno funzioni successive.",
    generating: "Generazione in corso…",
    generate: "Genera una base di mazzo",
    invalidBudget: "Inserisci un budget valido, per esempio 100 o 100,50.",
    noBuilder: "Il generatore /api/build non è disponibile.",
    genFailed: "Generazione non riuscita.",
    invalidData: "Il generatore ha restituito dati non validi.",
    incomplete: "Lista incompleta: il generatore deve restituire 100 carte, comandante incluso.",
    budgetUnverified: "Il generatore non ha verificato il budget per tutte le carte. Non mostro la lista come completata.",
    copied: "Lista copiata.",
    copyFallback: "Copia automatica non disponibile: seleziona e copia la lista qui sotto.",
    cards100: "100 carte",
    copyDeck: "Copia decklist",
    priceNa: "Prezzo non disponibile",
    perCopy: "€ per copia",
    listToCopy: "Lista da copiare",
    statsBy: "Statistiche delle carte:",
    buildFooter: "Immagini tramite Scryfall. Magic: The Gathering e le immagini appartengono ai rispettivi titolari. Sito non ufficiale.",
    // Layout
    buyTcg: "Acquista su TCGplayer",
    affiliate: "Link affiliato: potremmo ricevere una commissione sugli acquisti idonei.",
    visitors: (n: string, one: boolean) => (one ? `${n} visitatore` : `${n} visitatori`),
  },
  en: {
    tagline: "EDHREC statistics + Scryfall card checks",
    navUpgrade: "Upgrade a deck",
    navBuild: "Build a deck →",
    preconLoaded: (n: string, set: string, y: string) => `Official list of the «${n}» precon (${set} ${y}) added below. You can edit it, or clear it and paste your own deck.`,
    preconAvailable: (n: string) => `This commander leads an official precon («${n}»). You already have your own list: you can switch to the precon list if you want.`,
    preconEmpty: (n: string) => `Paste your deck below, or use the official list of the «${n}» precon.`,
    preconChoose: "Choose the precon",
    preconUse: "Use the precon list",
    preconClear: "Clear and paste mine",
    landKicker: "Magic: The Gathering · Commander",
    landTitle1: "Come in and build your Commander deck.",
    landTitle2: "Or upgrade your precon.",
    landText: "Free tools based on EDHREC statistics and Scryfall card data, with euro prices and a budget of your choice. No AI.",
    landCtaUpgrade: "Upgrade a precon →",
    landCtaBuild: "Build a deck →",
    landF1t: "Precon upgrades",
    landF1: "Type the commander: the official precon list loads by itself (or paste your own). Get the most played swaps, with what to cut and what to add.",
    landF2t: "Decks from scratch",
    landF2: "Pick a commander and colors: the site prepares a 100-card base with the most used cards on EDHREC.",
    landF3t: "Budget in euros",
    landF3: "Set how much you want to spend: prices come from the cheapest printing in euros.",
    landImgAlt: "Deck of cards on a green playmat with dice and a deck box",
    navAria: "Site mode",
    langAria: "Language",
    imageMissing: "Image not available",
    heroLabel: "COMMANDER DECK UPGRADE",
    heroTitle1: "Enter the commander.",
    heroTitle2: "Compare the deck.",
    heroText: "The tool compares your list with the commander's EDHREC statistics, suggests cards that aren't already in the deck and checks them on Scryfall. No Gemini key needed.",
    commander: "Commander",
    commanderPh: "E.g. Cloud, Ex-SOLDIER",
    deckLabel: "Full precon decklist",
    deckHint: "One card per line, quantity optional (e.g. 1 Cloud, Ex-SOLDIER). Headers like “Creature” are ignored; commas in card names are kept.",
    maxSwaps: "Maximum number of swaps",
    upgrades: "upgrades",
    budgetNew: "Total budget for new cards (€)",
    budgetPh: "E.g. 40",
    loadingUpgrade: "Reading public EDHREC statistics and checking cards on Scryfall…",
    comparing: "Comparing…",
    findUpgrades: "Find upgrades →",
    compareFailed: "Comparison failed",
    unexpected: "Unexpected error",
    upgradeFine: "EDHREC provides inclusion/synergy statistics; Scryfall checks color identity and Commander legality. The algorithm does not use AI.",
    done: "COMPARISON COMPLETE",
    recognized: (n: number, t: number) => `${n} names recognized · ${t} copies`,
    notRecognized: (l: string) => `Not recognized by Scryfall: ${l}. Fix the list to improve the comparison.`,
    possibleSwaps: "Possible swaps",
    swapsCount: (n: number) => `${n} swaps`,
    estTotal: "Estimated total",
    knownSubtotal: "Subtotal of known prices",
    swapFine: "Pairings are automatic suggestions based on popularity/synergy, not editorially curated cuts.",
    remove: "− CUT",
    add: "+ ADD",
    cardToRemove: "Card to cut",
    estPrice: "Estimated price",
    na: "not available",
    inclusion: "inclusion",
    cutScore: "cut card score",
    compareSites: "Compare on other sites",
    homeFooter1: "Version: images + budget + swaps.",
    homeFooter2: "Images via Scryfall. Magic and its images belong to their respective owners; unofficial site. Estimated prices, shipping excluded.",
    homeFooter3: "EDHREC is not an official API; the public endpoint may change. Statistics are no substitute for your own judgment about your meta and budget.",
    back: "← Back to upgrades",
    buildTitle: "Build a deck base.",
    buildText: "Pick the colors, enter the commander and set a budget. Review and customize the list before playing.",
    colorsLegend: "Commander colors",
    colorNames: { W: "White", U: "Blue", B: "Black", R: "Red", G: "Green" } as Record<string, string>,
    colorlessHint: "No color selected = colorless. The server checks that the colors match the commander's identity.",
    commanderOfficial: "Commander — official name",
    commanderOfficialPh: "Enter the commander's name",
    budgetTotal: "Total budget in euros — optional",
    budgetTotalPh: "E.g. 100",
    budgetHint: "Includes commander and lands. Estimated prices; shipping excluded. Power level and automatic commander selection will come later.",
    generating: "Generating…",
    generate: "Generate a deck base",
    invalidBudget: "Enter a valid budget, for example 100 or 100.50.",
    noBuilder: "The /api/build generator is not available.",
    genFailed: "Generation failed.",
    invalidData: "The generator returned invalid data.",
    incomplete: "Incomplete list: the generator must return 100 cards, commander included.",
    budgetUnverified: "The generator couldn't verify the budget for every card, so the list is not shown as complete.",
    copied: "List copied.",
    copyFallback: "Automatic copy not available: select and copy the list below.",
    cards100: "100 cards",
    copyDeck: "Copy decklist",
    priceNa: "Price not available",
    perCopy: "€ per copy",
    listToCopy: "List to copy",
    statsBy: "Card statistics:",
    buildFooter: "Images via Scryfall. Magic: The Gathering and its images belong to their respective owners. Unofficial site.",
    buyTcg: "Buy on TCGplayer",
    affiliate: "Affiliate link: we may earn a commission on qualifying purchases.",
    visitors: (n: string, one: boolean) => (one ? `${n} visitor` : `${n} visitors`),
  },
};

export type Dict = (typeof dict)["it"];

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({ lang: "it", setLang: () => {}, t: dict.it });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    const initial: Lang = saved === "en" || saved === "it" ? saved : navigator.language?.toLowerCase().startsWith("it") ? "it" : "en";
    setLangState(initial);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    localStorage.setItem("lang", l);
    setLangState(l);
  };
  return <Ctx.Provider value={{ lang, setLang, t: dict[lang] as Dict }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

export function LangSwitch() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="lang" role="group" aria-label={t.langAria}>
      {(["it", "en"] as Lang[]).map((l) => (
        <button key={l} type="button" aria-pressed={lang === l} className={lang === l ? "on" : ""} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer style={{ padding: "24px 16px", textAlign: "center", borderTop: "1px solid #64748b", marginTop: 32 }}>
      <a
        href="https://partner.tcgplayer.com/ZV3Z5q"
        target="_blank"
        rel="sponsored noopener noreferrer"
        style={{ display: "inline-block", padding: "12px 20px", borderRadius: 8, backgroundColor: "#2563eb", color: "#ffffff", textDecoration: "none", fontWeight: 600 }}
      >
        {t.buyTcg}
      </a>
      <p style={{ fontSize: "0.875rem", marginTop: 12 }}>{t.affiliate}</p>
      <VisitCounter />
    </footer>
  );
}

// Conta ogni browser una sola volta (flag in localStorage), poi mostra solo il totale.
export function VisitCounter() {
  const { lang, t } = useLang();
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const FLAG = "precon-upgrade-visited";
    let seen = false;
    try {
      seen = localStorage.getItem(FLAG) === "1";
    } catch {}
    fetch("/api/visite", { method: seen ? "GET" : "POST", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        if (typeof d.count === "number" && d.count > 0) {
          setCount(d.count);
          if (!seen) {
            try {
              localStorage.setItem(FLAG, "1");
            } catch {}
          }
        }
      })
      .catch(() => {});
  }, []);
  if (count === null) return null;
  const n = count.toLocaleString(lang === "it" ? "it-IT" : "en-US");
  return (
    <p style={{ fontSize: "0.8rem", marginTop: 10, color: "var(--muted)", fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>
      {t.visitors(n, count === 1)}
    </p>
  );
}
