// Indirizzo pubblico del sito. Se un giorno usi un dominio tuo, imposta NEXT_PUBLIC_SITE_URL su Vercel.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://precon-upgrade.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "Precon Upgrade";

// Codice di verifica di Google Search Console (metodo "Tag HTML": solo il valore di content="...").
// Si può incollare qui oppure impostare GOOGLE_SITE_VERIFICATION nelle variabili d'ambiente di Vercel.
export const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION || "irC8rfoJuRIeytsdJQMByvOFBh3PEYq33eqT34Mqw6Q";
