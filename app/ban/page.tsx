import type { Metadata } from "next";
import { fetchBanned, type BannedCard } from "../../lib/banned";
import { SITE_NAME } from "../../lib/site";
import { BanList } from "./BanList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Ban Commander — ${SITE_NAME}`,
  description: "Elenco delle carte bannate in Commander da Scryfall, con immagini e testo delle regole. Collegamento alla lista ufficiale Wizards.",
};

export default async function BanPage() {
  let cards: BannedCard[] = [];
  let error: string | null = null;
  try {
    cards = await fetchBanned();
  } catch {
    error = "ban-unavailable";
  }
  return <BanList cards={cards} error={error} />;
}
