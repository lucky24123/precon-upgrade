import "./globals.css";
import type { Metadata } from "next";
import { LangProvider, SiteFooter } from "../lib/i18n";
import { SITE_URL, SITE_NAME, GOOGLE_SITE_VERIFICATION } from "../lib/site";

const description =
  "Upgrade gratuiti per i precon Commander di Magic: The Gathering. Inserisci la lista del mazzo e ricevi sostituzioni basate su EDHREC, con prezzi in euro e budget. Nessuna AI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Precon Upgrade — upgrade per i mazzi precostruiti Commander (MTG)",
    template: "%s | Precon Upgrade",
  },
  description,
  applicationName: SITE_NAME,
  keywords: ["precon upgrade", "upgrade precon", "commander precon", "EDH", "Magic: The Gathering", "EDHREC", "mazzo commander", "budget"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: "/",
    title: "Precon Upgrade — upgrade per i precon Commander",
    description,
    locale: "it_IT",
    alternateLocale: ["en_US"],
  },
  twitter: { card: "summary_large_image", title: "Precon Upgrade — upgrade per i precon Commander", description },
  robots: { index: true, follow: true },
  ...(GOOGLE_SITE_VERIFICATION ? { verification: { google: GOOGLE_SITE_VERIFICATION } } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <LangProvider>
          {children}
          <SiteFooter />
        </LangProvider>
      </body>
    </html>
  );
}
