import type { Metadata } from "next";
import GuidePage, { type GuideContent } from "../../../components/GuidePage";
import { SITE_NAME } from "../../../lib/site";

export const metadata: Metadata = {
  title: `Migliorare un precon Commander — ${SITE_NAME}`,
  description:
    "Guida passo a passo per migliorare un precon Commander con Precon Upgrade: trovare il precon, impostare il budget, leggere le sostituzioni e applicare i cambi con giudizio.",
  alternates: { canonical: "/guida/migliorare-precon" },
};

const it: GuideContent = {
  title: "Migliorare un precon Commander",
  intro:
    "I mazzi precostruiti Commander sono pensati per essere giocati subito, ma contengono quasi sempre qualche carta lenta o fuori tema. Questa guida mostra come usare Precon Upgrade per spendere bene un budget di upgrade, passo a passo.",
  sections: [
    {
      title: "1. Trova il tuo precon",
      body: [
        "Nella pagina di upgrade scrivi il nome del comandante: se esiste un precon ufficiale con quel comandante, il sito propone la sua lista ufficiale e puoi caricarla con un clic. Se hai già modificato il tuo precon, incolla la tua lista: il confronto funziona uguale.",
        "Non serve copiare la lista a mano: le intestazioni tipo «Creature» vengono ignorate e puoi mantenere le virgole nei nomi delle carte. Se un nome non viene riconosciuto, il sito te lo segnala: correggilo per un confronto più preciso.",
      ],
      links: [{ label: "Vai allo strumento di upgrade", href: "/migliora" }],
    },
    {
      title: "2. Imposta budget e numero di cambi",
      body: [
        "Due impostazioni guidano la selezione:",
        [
          "Budget in euro: quanto vuoi spendere in totale per le nuove carte. Il filtro scarta le sostituzioni che lo superano.",
          "Numero massimo di cambi: con 5–10 cambi correggi i problemi principali; con 20 o più ricostruisci il mazzo in modo più deciso.",
        ],
        "Un buon punto di partenza per un precon recente è 10 cambi con un budget di 30–50 €: risolvi ramp, rimozioni e pescata senza stravolgere la lista.",
      ],
    },
    {
      title: "3. Leggi le sostituzioni",
      body: [
        "Ogni suggerimento mostra la carta da togliere e quella da aggiungere, con immagini, prezzo stimato e statistiche. Le sostituzioni seguono in genere tre direzioni ricorrenti nei precon:",
        [
          "Ramp e terre: i precon hanno spesso troppo poco acceleratore; le rocce da 2 mana e le terre che entrano senza tuffarsi sono i primi acquisti consigliati.",
          "Rimozioni flessibili: i precon includono rimozioni costose o limitate; le statistiche spingono verso rimozioni a basso costo che gestiscono più tipi di minacce.",
          "Pescata e motori: le carte che «si rimpiazzano da sole» o pescano al verificarsi di condizioni del comandante alzano la costanza del mazzo.",
        ],
        "Ricorda che gli abbinamenti sono automatici: prima di comprare, controlla che la carta in entrata abbia davvero senso nel tuo piano di gioco.",
      ],
    },
    {
      title: "4. Applica i cambi con giudizio",
      body: [
        "Non applicare tutti i suggerimenti in blocco. Un metodo semplice:",
        [
          "Parti dalle sostituzioni con inclusione e sinergia più alte: sono le più collaudate dalla community.",
          "Mantieni la curva di mana: se togli molte carte a basso costo, controlla di non alzare troppo la media.",
          "Conserva le carte che servono al piano del comandante, anche se poco popolari: le statistiche premiano la popolarità, non la coerenza col tuo tema.",
        ],
        "Salva il risultato con un account per ritrovarlo in «I miei mazzi» e confrontarlo dopo i prossimi cambi.",
      ],
    },
    {
      title: "Prima di acquistare",
      body: [
        "Controlla sempre:",
        [
          "il prezzo reale del venditore: la stima usa la stampa più economica e cambia con il mercato;",
          "la legalità della carta in Commander nella pagina Ban;",
          "che il totale delle nuove carte resti nel budget, spedizione esclusa.",
        ],
      ],
      links: [
        { label: "Elenco ban Commander", href: "/ban" },
        { label: "Come funziona il confronto", href: "/guida/come-funziona" },
      ],
    },
  ],
};

const en: GuideContent = {
  title: "Upgrading a Commander precon",
  intro:
    "Commander precons are built to play out of the box, but they almost always contain a few slow or off-theme cards. This guide shows how to use Precon Upgrade to spend an upgrade budget well, step by step.",
  sections: [
    {
      title: "1. Find your precon",
      body: [
        "On the upgrade page type the commander's name: if an official precon exists with that commander, the site offers its official list and you can load it with one click. If you already modified your precon, paste your own list: the comparison works the same.",
        "No need to reformat the list by hand: headers like \"Creatures\" are ignored and commas in card names are kept. If a name is not recognized, the site reports it: fix it for a more precise comparison.",
      ],
      links: [{ label: "Open the upgrade tool", href: "/migliora" }],
    },
    {
      title: "2. Set budget and swap count",
      body: [
        "Two settings drive the selection:",
        [
          "Budget in euros: how much you want to spend on new cards in total. The filter discards swaps that exceed it.",
          "Maximum swaps: with 5–10 swaps you fix the main issues; with 20 or more you rebuild the deck more aggressively.",
        ],
        "A good starting point for a recent precon is 10 swaps with a 30–50 € budget: you solve ramp, removal and draw without turning the list upside down.",
      ],
    },
    {
      title: "3. Read the swaps",
      body: [
        "Each suggestion shows the card to cut and the card to add, with images, estimated price and statistics. Swaps usually follow three recurring directions in precons:",
        [
          "Ramp and lands: precons often run too little acceleration; 2-mana rocks and lands that enter untapped are the first recommended buys.",
          "Flexible removal: precons include costly or narrow removal; the statistics push toward low-cost removal that handles more threat types.",
          "Draw and engines: cards that \"replace themselves\" or draw when the commander's conditions occur raise the deck's consistency.",
        ],
        "Remember that pairings are automatic: before buying, check that the incoming card really fits your game plan.",
      ],
    },
    {
      title: "4. Apply changes with judgment",
      body: [
        "Do not apply every suggestion wholesale. A simple method:",
        [
          "Start from swaps with the highest inclusion and synergy: they are the most community-tested.",
          "Keep the mana curve: if you cut many low-cost cards, check the average does not rise too much.",
          "Keep the cards your commander's plan needs, even unpopular ones: statistics reward popularity, not coherence with your theme.",
        ],
        "Save the result with an account to find it under \"My decks\" and compare it after your next changes.",
      ],
    },
    {
      title: "Before buying",
      body: [
        "Always check:",
        [
          "the vendor's real price: the estimate uses the cheapest printing and changes with the market;",
          "the card's Commander legality on the Ban page;",
          "that the total of new cards stays within budget, shipping excluded.",
        ],
      ],
      links: [
        { label: "Commander ban list", href: "/ban" },
        { label: "How the comparison works", href: "/guida/come-funziona" },
      ],
    },
  ],
};

export default function MigliorarePreconPage() {
  return <GuidePage it={it} en={en} />;
}
