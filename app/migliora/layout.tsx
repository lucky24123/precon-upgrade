import type { Metadata } from "next";

const description =
  "Upgrade per il tuo precon Commander: incolla la lista del mazzo e ricevi le sostituzioni più giocate su EDHREC per il tuo comandante, con prezzi in euro e budget.";

export const metadata: Metadata = {
  title: "Upgrade precon Commander: cosa togliere e cosa aggiungere",
  description,
  alternates: { canonical: "/migliora" },
  openGraph: { url: "/migliora", title: "Upgrade precon Commander | Precon Upgrade", description },
  twitter: { title: "Upgrade precon Commander | Precon Upgrade", description },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
