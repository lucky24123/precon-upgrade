// Lista delle carte bannate in Commander, letta da Scryfall.
// Serve alla pagina /ban: non fa parte del database utente.

export type BannedCard = {
  name: string;
  oracleText: string; // regole della carta: spiega il motivo del divieto
  imageUrl: string | null;
};

const headers = { "User-Agent": "PreconUpgrade/1.1 (lucianoippolito49@gmail.com)" };

export async function fetchBanned(): Promise<BannedCard[]> {
  const res = await fetch("https://api.scryfall.com/cards/search?q=banned:commander&unique=cards", {
    headers,
    next: { revalidate: 21600 },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error("Scryfall non ha restituito l'elenco dei ban.");
  const data = await res.json();
  return (data.data as any[]).map(c => ({
    name: c.name,
    oracleText: c.oracle_text || "",
    imageUrl: c.image_uris?.normal || null,
  }));
}
