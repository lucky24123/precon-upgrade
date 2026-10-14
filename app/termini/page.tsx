import type { Metadata } from "next";
import LegalPage, { type LegalContent } from "../../components/LegalPage";
import { SITE_NAME } from "../../lib/site";

export const metadata: Metadata = {
  title: `Termini di servizio — ${SITE_NAME}`,
  description: "Termini di servizio di Precon Upgrade, strumento gratuito e non ufficiale per i mazzi Commander di Magic: The Gathering.",
  alternates: { canonical: "/termini" },
};

const EMAIL = "lucianoippolito49@gmail.com";

const it: LegalContent = {
  title: "Termini di servizio",
  intro: "Usando Precon Upgrade accetti questi termini. Se non sei d'accordo, ti chiediamo di non usare il sito.",
  updated: "Ultimo aggiornamento: 14 ottobre 2026",
  sections: [
    {
      title: "Il servizio",
      body: [
        "Precon Upgrade è uno strumento gratuito che suggerisce upgrade per i mazzi precostruiti Commander e crea basi di mazzo, usando le statistiche pubbliche di EDHREC e i dati delle carte di Scryfall. Non usa intelligenza artificiale.",
      ],
    },
    {
      title: "Sito non ufficiale",
      body: [
        "Precon Upgrade non è affiliato, approvato né sponsorizzato da Wizards of the Coast, EDHREC o Scryfall. Magic: The Gathering, i nomi e le immagini delle carte appartengono ai rispettivi titolari.",
      ],
    },
    {
      title: "Account",
      body: [
        "Puoi creare un account accedendo con Google o GitHub, per salvare i tuoi mazzi. Sei responsabile dell'uso del tuo account. Puoi smettere di usarlo e chiederne la cancellazione in qualsiasi momento, come spiegato nell'informativa sulla privacy.",
      ],
    },
    {
      title: "Uso corretto",
      body: [
        "Ti chiediamo di non:",
        [
          "usare il sito in modo da sovraccaricarlo, ad esempio con richieste automatiche massive;",
          "tentare di accedere ai dati di altri utenti o aggirare le misure di sicurezza;",
          "usare il servizio per attività illegali.",
        ],
        "Possiamo sospendere gli account che violano queste regole.",
      ],
    },
    {
      title: "Suggerimenti e prezzi",
      body: [
        "Gli upgrade e i mazzi sono suggerimenti automatici basati su statistiche di popolarità: non sono consigli strategici garantiti. I prezzi sono stime in euro, spedizione esclusa, e possono essere diversi da quelli reali. Controlla sempre carte e prezzi prima di acquistare.",
      ],
    },
    {
      title: "Link di affiliazione",
      body: [
        "Alcuni collegamenti, come quello a TCGplayer, sono link di affiliazione: potremmo ricevere una commissione sugli acquisti idonei, senza costi aggiuntivi per te. Gli acquisti avvengono sui siti esterni e sono regolati dalle loro condizioni.",
      ],
    },
    {
      title: "Disponibilità e responsabilità",
      body: [
        "Il servizio è offerto gratuitamente «così com'è». I dati di EDHREC e Scryfall possono cambiare o non essere disponibili, e il sito può avere interruzioni. Nei limiti consentiti dalla legge, non siamo responsabili di perdite derivanti dall'uso del sito o dei suggerimenti. Restano salvi i diritti che la legge riconosce ai consumatori.",
      ],
    },
    {
      title: "Modifiche e legge applicabile",
      body: [
        "Possiamo aggiornare questi termini: la data in alto indica l'ultima versione. Questi termini sono regolati dalla legge italiana.",
        `Per domande scrivi a ${EMAIL}.`,
      ],
    },
  ],
};

const en: LegalContent = {
  title: "Terms of service",
  intro: "By using Precon Upgrade you agree to these terms. If you don't agree, please don't use the site.",
  updated: "Last updated: October 14, 2026",
  sections: [
    {
      title: "The service",
      body: [
        "Precon Upgrade is a free tool that suggests upgrades for Commander precons and builds deck bases, using public EDHREC statistics and Scryfall card data. It does not use artificial intelligence.",
      ],
    },
    {
      title: "Unofficial site",
      body: [
        "Precon Upgrade is not affiliated with, endorsed or sponsored by Wizards of the Coast, EDHREC or Scryfall. Magic: The Gathering, card names and images belong to their respective owners.",
      ],
    },
    {
      title: "Accounts",
      body: [
        "You can create an account by signing in with Google or GitHub to save your decks. You are responsible for the use of your account. You can stop using it and request its deletion at any time, as explained in the privacy policy.",
      ],
    },
    {
      title: "Fair use",
      body: [
        "Please do not:",
        [
          "use the site in a way that overloads it, for example with massive automated requests;",
          "try to access other users' data or bypass security measures;",
          "use the service for illegal activities.",
        ],
        "We may suspend accounts that break these rules.",
      ],
    },
    {
      title: "Suggestions and prices",
      body: [
        "Upgrades and decks are automatic suggestions based on popularity statistics, not guaranteed strategic advice. Prices are estimates in euros, shipping excluded, and may differ from actual prices. Always check cards and prices before buying.",
      ],
    },
    {
      title: "Affiliate links",
      body: [
        "Some links, such as the TCGplayer one, are affiliate links: we may earn a commission on qualifying purchases at no extra cost to you. Purchases happen on external sites and are governed by their terms.",
      ],
    },
    {
      title: "Availability and liability",
      body: [
        "The service is provided free of charge \"as is\". EDHREC and Scryfall data may change or be unavailable, and the site may have outages. To the extent permitted by law, we are not liable for losses arising from the use of the site or its suggestions. Your statutory consumer rights are not affected.",
      ],
    },
    {
      title: "Changes and governing law",
      body: [
        "We may update these terms: the date at the top shows the latest version. These terms are governed by Italian law.",
        `For questions, write to ${EMAIL}.`,
      ],
    },
  ],
};

export default function TerminiPage() {
  return <LegalPage it={it} en={en} />;
}
