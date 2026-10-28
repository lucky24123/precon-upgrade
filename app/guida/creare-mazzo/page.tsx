import type { Metadata } from "next";
import GuidePage, { type GuideContent } from "../../../components/GuidePage";
import { SITE_NAME } from "../../../lib/site";

export const metadata: Metadata = {
  title: `Creare un mazzo Commander da zero — ${SITE_NAME}`,
  description:
    "Guida alla creazione di un mazzo Commander da zero con Precon Upgrade: identità colore, budget in euro, base di 100 carte e revisione della lista prima di giocare.",
  alternates: { canonical: "/guida/creare-mazzo" },
};

const it: GuideContent = {
  title: "Creare un mazzo Commander da zero",
  intro:
    "Costruire un mazzo Commander da zero può disorientare: 100 carte, l'identità colore del comandante e un budget da rispettare. Questa guida spiega come usare il generatore di Precon Upgrade per ottenere una base solida e come trasformarla in un mazzo tuo.",
  sections: [
    {
      title: "1. Scegli comandante e colori",
      body: [
        "Il comandante decide l'identità colore del mazzo: puoi includere solo carte i cui simboli di mana sono contenuti nell'identità del comandante. Sul sito selezioni i colori e scrivi il nome ufficiale del comandante; il server verifica che i colori scelti corrispondano alla sua identità.",
        "Se non hai ancora le idee chiare, parti dal tipo di mazzo che ti diverte: aggressivo, di controllo, combo o tematico. Il comandante giusto è quello che premia ciò che vuoi fare, non quello con le carte più costose.",
      ],
      links: [{ label: "Vai al generatore di mazzi", href: "/crea-mazzo" }],
    },
    {
      title: "2. Imposta il budget",
      body: [
        "Il budget in euro è facoltativo ma consigliato: comprende comandante e terre, usa i prezzi stimati della stampa più economica e non include la spedizione. Con 50–100 € si costruiscono basi solide; salire oltre serve a mazzi più competitivi, non necessariamente più divertenti.",
      ],
    },
    {
      title: "3. Genera la base di 100 carte",
      body: [
        "Il generatore prepara una lista di 100 carte, comandante incluso, partendo dalle statistiche del comandante e verificando ogni carta su Scryfall:",
        [
          "le carte più giocate con quel comandante (inclusione);",
          "le carte che collaborano con la sua strategia (sinergia);",
          "il rispetto del budget per ogni carta inclusa.",
        ],
        "Se il generatore non riesce a verificare il budget per tutte le carte, la lista non viene presentata come completata: in quel caso alza il budget o riduci le pretese.",
      ],
    },
    {
      title: "4. Rivedi la lista prima di giocare",
      body: [
        "La base generata è un punto di partenza, non un mazzo finito. Controlla in particolare:",
        [
          "Curva di mana: quante carte giochi a ogni costo. Troppe carte costose rendono il mazzo lento; una base tipica punta a molte carte a 1–3 mana.",
          "Ramp: rocce e terre che producono più di un mana servono a raggiungere il comandante e le carte importanti in tempo.",
          "Rimozioni: servono risposte alle minacce degli avversari, meglio se flessibili e a basso costo.",
          "Pescata: un mazzo che non pesca si esaurisce; includi carte che si rimpiazzano da sole o pescano al verificarsi di condizioni del mazzo.",
        ],
        "Sostituisci le carte che non ti convincono con altre in tema: la lista è tua, il generatore ha solo riempito i punti di partenza.",
      ],
    },
    {
      title: "5. Salva e itera",
      body: [
        "Salva il mazzo con un account per ritrovarlo in «I miei mazzi». Dopo qualche partita torna sulla lista: le carte che restano in mano senza essere giocate sono le prime candidate all'uscita, mentre quelle che vorresti più spesso meritano copie aggiuntive o cart in grado di recuperarne di più.",
      ],
      links: [
        { label: "Come funziona il generatore", href: "/guida/come-funziona" },
        { label: "Guida: migliorare un precon", href: "/guida/migliorare-precon" },
      ],
    },
  ],
};

const en: GuideContent = {
  title: "Building a Commander deck from scratch",
  intro:
    "Building a Commander deck from scratch can be daunting: 100 cards, the commander's color identity and a budget to respect. This guide explains how to use the Precon Upgrade generator to get a solid base and how to turn it into your own deck.",
  sections: [
    {
      title: "1. Pick commander and colors",
      body: [
        "The commander sets the deck's color identity: you may only include cards whose mana symbols are contained in the commander's identity. On the site you select the colors and type the commander's official name; the server checks that the chosen colors match its identity.",
        "If you are unsure where to start, begin with the deck style you enjoy: aggressive, control, combo or thematic. The right commander rewards what you want to do, not the one with the most expensive cards.",
      ],
      links: [{ label: "Open the deck generator", href: "/crea-mazzo" }],
    },
    {
      title: "2. Set the budget",
      body: [
        "The euro budget is optional but recommended: it includes commander and lands, uses estimated prices of the cheapest printing and excludes shipping. With 50–100 € you can build solid bases; going beyond that serves more competitive decks, not necessarily more fun ones.",
      ],
    },
    {
      title: "3. Generate the 100-card base",
      body: [
        "The generator prepares a 100-card list, commander included, starting from the commander's statistics and verifying every card on Scryfall:",
        [
          "the most played cards with that commander (inclusion);",
          "the cards that cooperate with its strategy (synergy);",
          "respecting the budget for every included card.",
        ],
        "If the generator cannot verify the budget for every card, the list is not presented as complete: in that case raise the budget or lower your ambitions.",
      ],
    },
    {
      title: "4. Review the list before playing",
      body: [
        "The generated base is a starting point, not a finished deck. Check in particular:",
        [
          "Mana curve: how many cards you play at each cost. Too many expensive cards make the deck slow; a typical base aims at many 1–3 mana cards.",
          "Ramp: rocks and lands that produce more than one mana help reach your commander and key cards on time.",
          "Removal: you need answers to opponents' threats, preferably flexible and low-cost.",
          "Draw: a deck that does not draw runs out of steam; include cards that replace themselves or draw when the deck's conditions occur.",
        ],
        "Swap the cards you do not like for others on theme: the list is yours, the generator only filled in the starting points.",
      ],
    },
    {
      title: "5. Save and iterate",
      body: [
        "Save the deck with an account to find it under \"My decks\". After a few games return to the list: cards that stay in your hand unplayed are the first candidates to leave, while the ones you wish you saw more often deserve extra copies or cards that can find them.",
      ],
      links: [
        { label: "How the generator works", href: "/guida/come-funziona" },
        { label: "Guide: upgrading a precon", href: "/guida/migliorare-precon" },
      ],
    },
  ],
};

export default function CreareMazzoPage() {
  return <GuidePage it={it} en={en} />;
}
