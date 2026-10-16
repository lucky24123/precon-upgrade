import type { Metadata } from "next";
import LegalPage, { type LegalContent } from "../../components/LegalPage";
import { SITE_NAME } from "../../lib/site";

export const metadata: Metadata = {
  title: `Privacy — ${SITE_NAME}`,
  description: "Informativa sulla privacy di Precon Upgrade: quali dati raccogliamo con l'accesso Google o GitHub, come li usiamo e come eliminarli.",
  alternates: { canonical: "/privacy" },
};

const EMAIL = "lucianoippolito49@gmail.com";

const it: LegalContent = {
  title: "Informativa sulla privacy",
  intro: "Precon Upgrade è un sito gratuito e non ufficiale per migliorare e creare mazzi Commander di Magic: The Gathering. Qui spieghiamo quali dati trattiamo e perché.",
  updated: "Ultimo aggiornamento: 16 ottobre 2026",
  sections: [
    {
      title: "Chi gestisce i dati",
      body: [`Il titolare del trattamento è il gestore di Precon Upgrade. Per qualsiasi richiesta sulla privacy scrivi a ${EMAIL}.`],
    },
    {
      title: "Dati che raccogliamo",
      body: [
        "Puoi usare gli strumenti di upgrade, creazione mazzi e ban senza account. Se scegli di accedere con Google o GitHub, riceviamo dal provider soltanto:",
        [
          "il tuo indirizzo email;",
          "il nome e l'immagine del profilo, se il provider li fornisce;",
          "un identificativo tecnico dell'account presso il provider.",
        ],
        "Non riceviamo mai la tua password. Se salvi un mazzo, conserviamo il titolo, il comandante, l'elenco delle carte, il budget e il risultato del confronto, collegati al tuo account.",
      ],
    },
    {
      title: "Come usiamo i dati",
      body: [
        "Usiamo i dati dell'account e dei mazzi per farti accedere, mantenere la sessione attiva e mostrarti i mazzi che hai salvato. Non li vendiamo e non li inviamo a Google AdSense per personalizzare gli annunci. Il trattamento separato relativo alla pubblicità è descritto nella sezione Google AdSense.",
        "La base giuridica è l'esecuzione del servizio che richiedi creando un account (art. 6.1.b GDPR).",
      ],
    },
    {
      title: "Dati da Google",
      body: [
        "L'uso e il trasferimento ad altre applicazioni delle informazioni ricevute dalle API di Google rispettano le Norme relative ai dati utente dei servizi API di Google, inclusi i requisiti di uso limitato. Chiediamo solo gli ambiti di base (email, profilo, openid) e non accediamo a Gmail, Drive, Contatti o altri dati del tuo account Google.",
      ],
    },
    {
      title: "Cookie e memoria del browser",
      body: [
        "Per il funzionamento del servizio usiamo:",
        [
          "cookie di sessione di Supabase, per mantenere l'accesso;",
          "memoria locale del browser per la lingua scelta e per contare una sola volta la tua visita nel contatore pubblico, che registra solo un totale anonimo.",
        ],
        "Nelle pagine pubbliche può essere caricato Google AdSense, che può usare cookie e identificativi pubblicitari secondo le scelte raccolte dal messaggio di consenso. Questi strumenti sono distinti dai cookie tecnici dell'account.",
      ],
    },
    {
      title: "Google AdSense e scelte sulla pubblicità",
      body: [
        "Usiamo Google AdSense nelle pagine pubbliche per finanziare il sito. Il codice pubblicitario non viene caricato nelle pagine I miei mazzi, Amministrazione e di completamento dell'accesso. Non trasmettiamo ad AdSense email dell'account, elenchi degli iscritti o contenuti dei mazzi salvati.",
        "Google e i suoi partner pubblicitari possono trattare dati tecnici come indirizzo IP, informazioni sul dispositivo e sul browser, identificativi di cookie e interazioni con gli annunci. Quando presti il consenso, possono usare questi dati anche per personalizzare gli annunci.",
        "Per gli utenti interessati dai regolamenti europei, il messaggio di consenso di Google permette di acconsentire, negare il consenso o gestire le opzioni. I trattamenti che richiedono consenso si basano sulle scelte espresse; rifiutare non impedisce di usare gli strumenti del sito. Il rifiuto della personalizzazione non implica necessariamente l'assenza di annunci: Google può mostrare annunci con limitazioni secondo le impostazioni e le regole applicabili.",
        "Puoi rivedere le scelte tramite il comando di gestione della privacy fornito dal messaggio Google. Le finalità, i partner e gli eventuali periodi di conservazione dei dati pubblicitari sono descritti nel messaggio e nelle informative dei rispettivi fornitori.",
      ],
      links: [
        { label: "Informativa sulla privacy di Google", href: "https://www.google.com/intl/it/policies/privacy" },
        { label: "Come funziona la piattaforma di gestione del consenso Google", href: "https://support.google.com/adsense/answer/16918505?hl=it" },
      ],
    },
    {
      title: "Fornitori tecnici",
      body: [
        [
          "Supabase: autenticazione e database dei mazzi salvati;",
          "Vercel: hosting del sito, con log tecnici delle richieste (ad esempio indirizzo IP);",
          "Google e GitHub: se li scegli per accedere; Google interviene inoltre come fornitore pubblicitario tramite AdSense nelle pagine pubbliche;",
          "Google Fonts e Scryfall: caratteri e immagini delle carte caricati dal tuo browser, che quindi ricevono il tuo indirizzo IP.",
        ],
        "Il collegamento a TCGplayer è un link di affiliazione: se lo apri, si applica l'informativa di TCGplayer. Alcuni fornitori possono trattare i dati fuori dall'Unione europea, con le garanzie previste dal GDPR.",
      ],
    },
    {
      title: "Conservazione ed eliminazione",
      body: [
        `Conserviamo account e mazzi finché l'account è attivo. Puoi eliminare i singoli mazzi dalla pagina «I miei mazzi». Per cancellare l'intero account e tutti i dati collegati scrivi a ${EMAIL}: procederemo entro 30 giorni.`,
        "Puoi anche revocare l'accesso del sito dalle impostazioni di sicurezza del tuo account Google o GitHub.",
      ],
    },
    {
      title: "I tuoi diritti",
      body: [
        `Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità dei dati od opporti al trattamento scrivendo a ${EMAIL}. Hai anche il diritto di presentare reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).`,
      ],
    },
    {
      title: "Minori",
      body: ["Il servizio non è rivolto a minori di 14 anni, che non devono creare un account."],
    },
    {
      title: "Modifiche",
      body: ["Se cambiamo questa informativa aggiorneremo la data in alto. Per modifiche importanti lo segnaleremo sul sito."],
    },
  ],
};

const en: LegalContent = {
  title: "Privacy policy",
  intro: "Precon Upgrade is a free, unofficial website for upgrading and building Magic: The Gathering Commander decks. This page explains what data we process and why.",
  updated: "Last updated: October 16, 2026",
  sections: [
    {
      title: "Who controls the data",
      body: [`The data controller is the operator of Precon Upgrade. For any privacy request, write to ${EMAIL}.`],
    },
    {
      title: "Data we collect",
      body: [
        "You can use the upgrade, deck building and ban list tools without an account. If you choose to sign in with Google or GitHub, the provider only sends us:",
        [
          "your email address;",
          "your name and profile picture, if the provider shares them;",
          "a technical identifier of your account with that provider.",
        ],
        "We never receive your password. If you save a deck, we store its title, commander, card list, budget and comparison result, linked to your account.",
      ],
    },
    {
      title: "How we use the data",
      body: [
        "We use account and deck data to sign you in, keep your session active and show you the decks you saved. We do not sell it or send it to Google AdSense to personalize ads. Separate advertising-related processing is described in the Google AdSense section.",
        "The legal basis is performing the service you request by creating an account (Art. 6(1)(b) GDPR).",
      ],
    },
    {
      title: "Data from Google",
      body: [
        "Our use and transfer to any other app of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. We request only the basic scopes (email, profile, openid) and do not access Gmail, Drive, Contacts or any other data in your Google account.",
      ],
    },
    {
      title: "Cookies and browser storage",
      body: [
        "To operate the service, we use:",
        [
          "Supabase session cookies, to keep you signed in;",
          "browser local storage for your language choice and to count your visit only once in the public counter, which records only an anonymous total.",
        ],
        "Public pages may load Google AdSense, which may use advertising cookies and identifiers according to the choices collected by the consent message. These tools are separate from technical account cookies.",
      ],
    },
    {
      title: "Google AdSense and advertising choices",
      body: [
        "We use Google AdSense on public pages to fund the site. Advertising code is not loaded on My decks, Administration or sign-in completion pages. We do not send account email addresses, the registered-user directory or saved deck contents to AdSense.",
        "Google and its advertising partners may process technical data such as IP address, device and browser information, cookie identifiers and ad interactions. With your consent, they may also use this data to personalize ads.",
        "For users covered by European regulations, Google's consent message offers consent, refusal or management of options. Processing that requires consent follows the choices expressed; refusal does not prevent you from using the site's tools. Refusing personalization does not necessarily mean that no ads will appear: Google may display limited ads according to applicable settings and rules.",
        "You can review your choices using the privacy-management control provided by Google's message. Advertising purposes, partners and applicable data retention periods are described in that message and the respective providers' notices.",
      ],
      links: [
        { label: "Google Privacy Policy", href: "https://www.google.com/intl/it/policies/privacy" },
        { label: "How Google's consent management platform works", href: "https://support.google.com/adsense/answer/16918505?hl=en" },
      ],
    },
    {
      title: "Technical providers",
      body: [
        [
          "Supabase: authentication and the saved decks database;",
          "Vercel: website hosting, with technical request logs (for example IP address);",
          "Google and GitHub: if you choose them to sign in; Google also acts as an advertising provider through AdSense on public pages;",
          "Google Fonts and Scryfall: fonts and card images loaded by your browser, which therefore receive your IP address.",
        ],
        "The TCGplayer link is an affiliate link: if you open it, TCGplayer's privacy policy applies. Some providers may process data outside the European Union, with the safeguards required by the GDPR.",
      ],
    },
    {
      title: "Retention and deletion",
      body: [
        `We keep your account and decks while the account is active. You can delete individual decks from the "My decks" page. To delete your whole account and all related data, write to ${EMAIL}: we will do so within 30 days.`,
        "You can also revoke the site's access from the security settings of your Google or GitHub account.",
      ],
    },
    {
      title: "Your rights",
      body: [
        `You can request access, rectification, erasure, restriction, data portability or object to processing by writing to ${EMAIL}. You also have the right to lodge a complaint with your data protection authority (in Italy, the Garante per la protezione dei dati personali).`,
      ],
    },
    {
      title: "Children",
      body: ["The service is not intended for children under 14, who must not create an account."],
    },
    {
      title: "Changes",
      body: ["If we change this policy we will update the date at the top. We will announce important changes on the site."],
    },
  ],
};

export default function PrivacyPage() {
  return <LegalPage it={it} en={en} />;
}
