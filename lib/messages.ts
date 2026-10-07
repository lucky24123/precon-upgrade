// Traduzione in inglese dei messaggi restituiti dalle API.
// Il client invia l'intestazione "x-lang: en"; i nomi delle carte non vengono toccati.

const exact: Record<string, string> = {
  "Scryfall non è disponibile. Riprova tra poco.": "Scryfall is unavailable. Please try again shortly.",
  "Inserisci il comandante e la lista del precon.": "Enter the commander and the precon decklist.",
  "Lista vuota o non riconosciuta.": "The list is empty or could not be recognized.",
  "Nessuna carta del mazzo riconosciuta da Scryfall.": "Scryfall did not recognize any card in the deck.",
  "Non riesco a leggere i dati EDHREC ora. Puoi comunque aprire i link di confronto qui sotto.": "EDHREC data can't be read right now. You can still open the comparison links below.",
  "EDHREC non ha restituito dati leggibili per questo comandante.": "EDHREC returned no readable data for this commander.",
  "Budget non valido.": "Invalid budget.",
  "Errore durante il confronto.": "Error during the comparison.",
  "Guide precon su MTGGoldfish": "Precon guides on MTGGoldfish",
  "Guide precon su TCGplayer": "Precon guides on TCGplayer",
  "Mazzi pubblici su Archidekt": "Public decks on Archidekt",
  "Scryfall — controlla le carte": "Scryfall — check the cards",
  "EDHREC — raccomandazioni comandante": "EDHREC — commander recommendations",
  "EDHREC — guide upgrade precon": "EDHREC — precon upgrade guides",
  "I tagli sono una stima meccanica basata su statistiche EDHREC: non equivalgono a una valutazione strategica umana. Controlla ogni sostituzione prima di acquistare.": "Cuts are a mechanical estimate based on EDHREC statistics, not a human strategic assessment. Check every swap before buying.",
  "Scryfall è temporaneamente limitato. Attendi e riprova.": "Scryfall is temporarily rate limited. Wait and try again.",
  "Scryfall non ha restituito le carte richieste. Controlla il nome ufficiale del comandante.": "Scryfall did not return the requested cards. Check the commander's official name.",
  "Inserisci comandante e colori.": "Enter the commander and colors.",
  "Colori non validi.": "Invalid colors.",
  "Questa carta non è legale in Commander.": "This card is not legal in Commander.",
  "Questa prima versione supporta un solo comandante: creatura leggendaria o carta che dichiara di poter essere comandante.": "This version supports a single commander: a legendary creature or a card that says it can be your commander.",
  "Dati EDHREC non disponibili per questo comandante. Il generatore non può completare la lista.": "EDHREC data is not available for this commander. The generator can't complete the list.",
  "Non riesco a recuperare tutte le terre base.": "Couldn't retrieve all basic lands.",
  "Prezzo mancante per comandante o terre: non posso verificare il budget totale.": "Missing price for the commander or lands: the total budget can't be verified.",
  "Prezzo del comandante non disponibile su Scryfall: non posso verificare il budget totale. Riprova senza budget.": "The commander's price isn't available on Scryfall: the total budget can't be verified. Try again without a budget.",
  "Prezzi della stampa più economica con prezzo in euro su Scryfall; spedizione esclusa. Nessun prezzo garantito.": "Prices are for the cheapest printing with a euro price on Scryfall; shipping excluded. No price is guaranteed.",
  "Prezzo delle terre base stimato a 0,10 € ciascuna.": "Basic land prices estimated at €0.10 each.",
  "Controllo interno: numero carte non valido.": "Internal check: invalid card count.",
  "Base sperimentale: 1 comandante, 62 carte non terra e 37 terre base. Non è una valutazione strategica o un mazzo competitivo.": "Experimental base: 1 commander, 62 nonland cards and 37 basic lands. It is not a strategic assessment or a competitive deck.",
  "Terre distribuite uniformemente tra i colori, non in base ai simboli di mana. Correggi la base di mana prima di giocare.": "Lands are split evenly between colors, not by mana symbols. Adjust the mana base before playing.",
  "La selezione usa dati EDHREC, colori, legalità e prezzo. Non garantisce pescata, accelerazione, rimozioni o combo sufficienti.": "Selection uses EDHREC data, colors, legality and price. It does not guarantee enough draw, ramp, removal or combos.",
  "Prezzi delle stampe restituite da Scryfall, non necessariamente le più economiche; spedizione esclusa. Nessun prezzo garantito.": "Prices are for the printings returned by Scryfall, not necessarily the cheapest; shipping excluded. No price is guaranteed.",
  "Alcuni prezzi mancano: il totale è un subtotale.": "Some prices are missing: the total is a subtotal.",
  "Errore di generazione.": "Generation error.",
  "EDHREC sta limitando le richieste. Riprova tra qualche secondo.": "EDHREC is rate limiting requests. Try again in a few seconds.",
  "EDHREC non ha una pagina per questo comandante.": "EDHREC has no page for this commander.",
  "Dati EDHREC non disponibili in questo momento.": "EDHREC data is not available right now.",
};

const patterns: [RegExp, (...m: string[]) => string][] = [
  [/^Scryfall non riconosce il comandante “(.*)”\. Inserisci il nome ufficiale della carta\.$/, (_, n) => `Scryfall doesn't recognize the commander “${n}”. Enter the card's official name.`],
  [/^Alternativa dello stesso tipo \((.*?)\)\. La carta tolta non compare nelle statistiche disponibili: non significa che sia peggiore\. Verifica il taglio\.$/, (_, g) => `Same-type alternative (${g}). The removed card doesn't appear in the available statistics: that doesn't mean it is worse. Check the cut.`],
  [/^Alternativa dello stesso tipo \((.*?)\) con punteggio EDHREC maggiore\. Verifica ruolo e sinergie\.$/, (_, g) => `Same-type alternative (${g}) with a higher EDHREC score. Check role and synergies.`],
  [/^Trovati (\d+) cambi su (\d+) richiesti nei limiti di budget e dati disponibili\.$/, (_, a, b) => `Found ${a} of ${b} requested swaps within the budget and available data.`],
  [/^I colori selezionati non corrispondono al comandante\. Identità richiesta: (.*)\.$/, (_, c) => `The selected colors don't match the commander. Required identity: ${c === "incolore" ? "colorless" : c}.`],
  [/^Solo (\d+) carte non terra utilizzabili: ne servono 62\. Prova un altro comandante o rimuovi il budget\.$/, (_, n) => `Only ${n} usable nonland cards: 62 are needed. Try another commander or remove the budget.`],
  [/^Con i prezzi disponibili, questa base richiede almeno (.*) €\. Non è un minimo globale: prova più budget o un altro comandante\.$/, (_, v) => `With the available prices, this base needs at least €${v}. This is not a global minimum: try a higher budget or another commander.`],
];

export function toEnglish(text: string): string {
  if (exact[text]) return exact[text];
  for (const [re, fn] of patterns) {
    const m = text.match(re);
    if (m) return fn(...m);
  }
  return text;
}

const keys = new Set(["error", "warning", "warnings", "reason", "selectionNotice", "name"]);

// Traduce solo i campi testuali noti; i nomi delle carte restano invariati perché non compaiono nel dizionario.
export function localize<T>(data: T, en: boolean): T {
  if (!en) return data;
  const walk = (v: any, key?: string): any => {
    if (typeof v === "string") return key && keys.has(key) ? toEnglish(v) : v;
    if (Array.isArray(v)) return v.map((x) => walk(x, key));
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x, k)]));
    return v;
  };
  return walk(data);
}
