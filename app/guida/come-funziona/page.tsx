import type { Metadata } from "next";
import GuidePage, { type GuideContent } from "../../../components/GuidePage";
import { SITE_NAME } from "../../../lib/site";

export const metadata: Metadata = {
  title: `Come funziona — ${SITE_NAME}`,
  description:
    "Come funziona Precon Upgrade: statistiche EDHREC, controlli Scryfall, prezzi in euro e nessuna intelligenza artificiale. Cosa significano inclusione, sinergia e punteggio carta tagliata.",
  alternates: { canonical: "/guida/come-funziona" },
};

const it: GuideContent = {
  title: "Come funziona Precon Upgrade",
  intro:
    "Precon Upgrade è uno strumento gratuito che suggerisce miglioramenti per i mazzi Commander usando dati pubblici, senza intelligenza artificiale. Questa pagina spiega quali dati usiamo, come li combiniamo e quali sono i limiti dei suggerimenti.",
  sections: [
    {
      title: "Quali dati usiamo",
      body: [
        "Il sito combina due fonti pubbliche e non le modifica:",
        [
          "EDHREC: le statistiche di inclusione e sinergia delle carte, calcolate da EDHREC sui mazzi Commander pubblicati. Sono dati di popolarità, non giudizi editoriali.",
          "Scryfall: i dati ufficiali di ogni carta, come identità colore, legalità in Commander, testo delle regole, immagini e prezzi in euro della stampa più economica.",
        ],
        "Non usiamo intelligenza artificiale per scegliere le carte: l'abbinamento tra carta da togliere e carta da aggiungere è un calcolo ripetibile basato sulle statistiche, lo stesso per tutti gli utenti.",
      ],
    },
    {
      title: "Cosa significano i numeri",
      body: [
        "Ogni suggerimento mostra alcuni indicatori che conviene saper leggere:",
        [
          "Inclusione: la percentuale di mazzi Commander con quel comandante che contiene quella carta. Un valore alto significa che la carta è molto giocata, non che è obbligatoriamente la migliore per il tuo piano.",
          "Sinergia: quanto più spesso la carta appare nei mazzi con il tuo comandante rispetto alla media. Indica le carte che «collaborano» con la strategia del comandante.",
          "Punteggio carta tagliata: la posizione della carta da togliere nelle statistiche. Le carte poco incluse e poco sinergiche sono le candidate naturali all'uscita.",
          "Prezzo stimato: il prezzo in euro della stampa più economica disponibile su Scryfall al momento della richiesta, spedizione esclusa.",
        ],
      ],
    },
    {
      title: "Come scegliamo le sostituzioni",
      body: [
        "Per l'upgrade di un precon il confronto segue questo ordine:",
        [
          "La tua lista viene riconosciuta carta per carta su Scryfall; le carte non riconosciute vengono segnalate per la correzione.",
          "Le statistiche del comandante vengono ordinate per trovare le carte più giocate e più sinergiche ancora assenti dal mazzo.",
          "Per ogni carta da aggiungere viene cercata, nella tua lista, la carta più simile per ruolo e con il punteggio più basso da togliere.",
          "Il budget in euro e il numero massimo di cambi limitano la selezione: le sostituzioni più care o fuori budget vengono scartate.",
        ],
        "Il risultato è un elenco di abbinamenti automatici: utili come punto di partenza, ma da valutare sempre con il tuo piano di gioco.",
      ],
    },
    {
      title: "Limiti da conoscere",
      body: [
        "Le statistiche di popolarità descrivono cosa giocano gli altri, non cosa serve al tuo mazzo specifico: un mazzo costruito attorno a una meccanica insolita può avere bisogno di carte poco popolari.",
        "I prezzi sono stime che cambiano con il mercato e non includono spedizione né eventuali ritocchi del venditore: verifica sempre il prezzo reale prima di acquistare.",
        "EDHREC non offre un'API ufficiale per questo tipo di sito: se l'endpoint pubblico cambia, alcune funzioni potrebbero diventare temporaneamente non disponibili.",
      ],
    },
    {
      title: "Dove sono i tuoi dati",
      body: [
        "Gli strumenti pubblici funzionano anche senza account. L'account serve solo a salvare i mazzi che hai generato. Non inviamo a Google o ad altri fornitori pubblicitari né la tua lista, né l'email, né i contenuti dei mazzi salvati. I dettagli completi sono nell'informativa sulla privacy.",
      ],
      links: [
        { label: "Informativa sulla privacy", href: "/privacy" },
        { label: "Guida: migliorare un precon", href: "/guida/migliorare-precon" },
        { label: "Guida: creare un mazzo da zero", href: "/guida/creare-mazzo" },
      ],
    },
  ],
};

const en: GuideContent = {
  title: "How Precon Upgrade works",
  intro:
    "Precon Upgrade is a free tool that suggests improvements for Commander decks using public data, with no artificial intelligence. This page explains which data we use, how we combine it, and the limits of the suggestions.",
  sections: [
    {
      title: "The data we use",
      body: [
        "The site combines two public sources and does not modify them:",
        [
          "EDHREC: card inclusion and synergy statistics computed by EDHREC over published Commander decks. This is popularity data, not editorial judgment.",
          "Scryfall: official data for each card, such as color identity, Commander legality, rules text, images and euro prices of the cheapest printing.",
        ],
        "We do not use artificial intelligence to pick cards: the pairing between a card to cut and a card to add is a repeatable calculation based on statistics, identical for every user.",
      ],
    },
    {
      title: "What the numbers mean",
      body: [
        "Each suggestion shows a few indicators worth understanding:",
        [
          "Inclusion: the percentage of Commander decks with that commander that contain the card. A high value means the card is widely played, not that it is necessarily best for your plan.",
          "Synergy: how much more often the card appears in decks with your commander compared to average. It highlights cards that \"cooperate\" with the commander's strategy.",
          "Cut card score: the position of the card to remove in the statistics. Cards with low inclusion and low synergy are natural candidates to leave.",
          "Estimated price: the price in euros of the cheapest printing available on Scryfall at the time of the request, shipping excluded.",
        ],
      ],
    },
    {
      title: "How we choose replacements",
      body: [
        "For a precon upgrade the comparison follows this order:",
        [
          "Your list is recognized card by card on Scryfall; unrecognized cards are reported so you can fix them.",
          "The commander's statistics are sorted to find the most played and most synergistic cards still missing from your deck.",
          "For each card to add, the tool looks in your list for the most similar card by role with the lowest cut score.",
          "The euro budget and the maximum number of swaps limit the selection: swaps that are too expensive or out of budget are discarded.",
        ],
        "The result is a list of automatic pairings: useful as a starting point, but always to be evaluated against your own game plan.",
      ],
    },
    {
      title: "Limits to know",
      body: [
        "Popularity statistics describe what others play, not what your specific deck needs: a deck built around an unusual mechanic may need unpopular cards.",
        "Prices are estimates that change with the market and do not include shipping or seller adjustments: always check the real price before buying.",
        "EDHREC does not offer an official API for this kind of site: if the public endpoint changes, some features may become temporarily unavailable.",
      ],
    },
    {
      title: "Where your data is",
      body: [
        "The public tools work without an account. The account only stores the decks you generated. We do not send your deck list, email or saved deck contents to Google or other advertising vendors. Full details are in the privacy policy.",
      ],
      links: [
        { label: "Privacy policy", href: "/privacy" },
        { label: "Guide: upgrading a precon", href: "/guida/migliorare-precon" },
        { label: "Guide: building a deck from scratch", href: "/guida/creare-mazzo" },
      ],
    },
  ],
};

export default function ComeFunzionaPage() {
  return <GuidePage it={it} en={en} />;
}
