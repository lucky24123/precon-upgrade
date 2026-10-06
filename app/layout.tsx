import "./globals.css";
import { LangProvider, SiteFooter } from "../lib/i18n";

export const metadata = {
  title: "Precon Upgrade — no AI",
  description: "Commander upgrade e mazzi basati sui dati EDHREC e Scryfall · Commander upgrades and decks based on EDHREC and Scryfall data",
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
