import type { Metadata } from "next";

const description =
  "Crea una base di mazzo Commander da 100 carte partendo dal comandante: carte scelte con i dati EDHREC, colori e legalità verificati su Scryfall, budget totale in euro.";

export const metadata: Metadata = {
  title: "Crea un mazzo Commander con budget",
  description,
  alternates: { canonical: "/crea-mazzo" },
  openGraph: { url: "/crea-mazzo", title: "Crea un mazzo Commander con budget | Precon Upgrade", description },
  twitter: { title: "Crea un mazzo Commander con budget | Precon Upgrade", description },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
