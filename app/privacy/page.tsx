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
  updated: "Ultimo aggiornamento: 14 ottobre 2026",
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
        "Usiamo questi dati solo per farti accedere, mantenere la sessione attiva e mostrarti i mazzi che hai salvato. Non li vendiamo, non li usiamo per pubblicità e non li condividiamo con terzi, salvo i fornitori tecnici indicati sotto.",
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
        "Usiamo solo strumenti tecnici necessari, senza cookie pubblicitari o di profilazione:",
        [
          "cookie di sessione di Supabase, per mantenere l'accesso;",
          "memoria locale del browser per la lingua scelta e per contare una sola volta la tua visita nel contatore pubblico, che registra solo un totale anonimo.",
        ],
      ],
    },
    {
      title: "Fornitori tecnici",
      body: [
        [
          "Supabase: autenticazione e database dei mazzi salvati;",
          "Vercel: hosting del sito, con log tecnici delle richieste (ad esempio indirizzo IP);",
          "Google e GitHub: solo se li scegli per accedere;",
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
  updated: "Last updated: October 14, 2026",
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
        "We use this data only to sign you in, keep your session active and show you the decks you saved. We don't sell it, use it for advertising or share it with third parties, except for the technical providers listed below.",
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
        "We only use strictly necessary technical tools, with no advertising or profiling cookies:",
        [
          "Supabase session cookies, to keep you signed in;",
          "browser local storage for your language choice and to count your visit only once in the public counter, which records only an anonymous total.",
        ],
      ],
    },
    {
      title: "Technical providers",
      body: [
        [
          "Supabase: authentication and the saved decks database;",
          "Vercel: website hosting, with technical request logs (for example IP address);",
          "Google and GitHub: only if you choose them to sign in;",
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
