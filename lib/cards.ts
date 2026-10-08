// Utilità condivise: statistiche EDHREC, ruolo delle carte e prezzi più economici Scryfall.
export const norm = (s: unknown) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export type Stat = { name: string; synergy: number; inclusion: number; score: number };

// inclusione = quota di mazzi del comandante che giocano la carta (num_decks / potential_decks)
export function edhrecStats(payload: any): Map<string, Stat> {
  const stats = new Map<string, Stat>();
  for (const list of payload?.container?.json_dict?.cardlists || []) {
    for (const v of list.cardviews || []) {
      if (typeof v.name !== "string") continue;
      const synergy = Number.isFinite(Number(v.synergy)) ? Number(v.synergy) : 0;
      const pot = Number(v.potential_decks);
      const inclusion = pot > 0 && Number.isFinite(Number(v.num_decks)) ? Math.min(1, Number(v.num_decks) / pot) : 0;
      const score = inclusion + 0.5 * synergy;
      const prev = stats.get(norm(v.name));
      if (!prev || score > prev.score) stats.set(norm(v.name), { name: v.name, synergy, inclusion, score });
    }
  }
  return stats;
}

const BASICS = new Set(["plains", "island", "swamp", "mountain", "forest", "wastes", "snow-covered plains", "snow-covered island", "snow-covered swamp", "snow-covered mountain", "snow-covered forest", "snow-covered wastes"]);
export const isBasic = (name: string) => BASICS.has(norm(name));

export const frontType = (c: any) => String(c?.card_faces?.[0]?.type_line || c?.type_line || "");
const text = (c: any) => [c?.oracle_text, ...(c?.card_faces || []).map((f: any) => f.oracle_text)].filter(Boolean).join("\n");

export type Role = "land" | "ramp" | "draw" | "removal" | "wipe" | "tutor" | "protection" | "synergy";
export const ROLE_IT: Record<Role, string> = { land: "Terra", ramp: "Rampa (mana)", draw: "Pescata", removal: "Rimozione", wipe: "Rimozione di massa", tutor: "Ricerca (tutor)", protection: "Protezione", synergy: "Sinergia col comandante" };

export function role(c: any): Role {
  if (frontType(c).includes("Land")) return "land";
  const t = text(c);
  if (/(destroy|exile) (all|each)|all creatures get -|deals? \d+ damage to each creature|return all (nonland|creatures)/i.test(t)) return "wipe";
  if (/(destroy|exile) (up to \w+ )?target|counter target|deals? (\w+|x) damage to (any target|target creature|target planeswalker)|return target (nonland )?(permanent|creature)[^.]*to its owner'?s hand|fights? (up to one )?target|target (player|opponent) sacrifices/i.test(t)) return "removal";
  if (/add \{|add (one|two|three|x) mana|mana of any (color|type)|search your library for (a|an|up to \w+) (basic )?(land|forest|plains|island|swamp|mountain)|put (a|up to \w+) (basic )?land cards? from your hand onto the battlefield|additional land/i.test(t)) return "ramp";
  if (/draws? (a|an|one|two|three|four|x|that many|cards equal) ?(additional )?cards?|draw cards equal|investigate|connives?/i.test(t)) return "draw";
  if (/search your library for an? (card|creature|artifact|enchantment|instant|sorcery)/i.test(t)) return "tutor";
  if (/(hexproof|indestructible|shroud|protection from)/i.test(t) && !frontType(c).includes("Creature")) return "protection";
  return "synergy";
}

export const centsOf = (c: any): number | null => {
  const p = c?.prices?.eur;
  return p != null && Number.isFinite(Number(p)) && Number(p) >= 0 ? Math.round(Number(p) * 100) : null;
};

const headers = { "Content-Type": "application/json", "User-Agent": "PreconUpgrade/1.0" };
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Prezzo in centesimi della stampa più economica con prezzo in euro (Scryfall prefer:eur-low), in blocchi di nomi.
export async function cheapestPrices(names: string[]): Promise<Map<string, number>> {
  const prices = new Map<string, number>();
  const chunks: string[][] = [];
  let current: string[] = [];
  let len = 0;
  for (const n of names.filter((n) => !n.includes('"'))) {
    const term = `!"${n}"`;
    if (current.length && (len + term.length > 700 || current.length >= 25)) { chunks.push(current); current = []; len = 0; }
    current.push(term); len += term.length + 4;
  }
  if (current.length) chunks.push(current);
  for (const chunk of chunks) {
    let url: string | null = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(`(${chunk.join(" or ")}) game:paper -set:sum -is:oversized -set_type:memorabilia -set_type:funny prefer:eur-low`)}`;
    while (url) {
      await pause(550); // Scryfall: max ~2 richieste/s su /cards/search
      let res: Response;
      try { res = await fetch(url, { headers, cache: "no-store", signal: AbortSignal.timeout(15000) }); } catch { break; }
      if (!res.ok) break;
      const page: any = await res.json();
      for (const c of page.data || []) { const v = centsOf(c); if (v !== null) prices.set(norm(c.name), v); }
      url = page.has_more && typeof page.next_page === "string" ? page.next_page : null;
    }
  }
  return prices;
}
