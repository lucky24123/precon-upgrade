// Aggiorna lib/precons.json con le liste ufficiali dei mazzi Commander precostruiti (fonte: MTGJSON).
// Uso: node scripts/update-precons.mjs   (da rilanciare quando escono nuovi precon)
import { writeFileSync } from "node:fs";

const BASE = "https://mtgjson.com/api/v5";
const res = await fetch(`${BASE}/DeckList.json`);
if (!res.ok) throw new Error(`DeckList ${res.status}`);
const decks = (await res.json()).data.filter((d) => d.type === "Commander Deck");

const out = [];
let i = 0;
async function worker() {
  while (i < decks.length) {
    const d = decks[i++];
    try {
      const r = await fetch(`${BASE}/decks/${d.fileName}.json`);
      if (!r.ok) throw new Error(String(r.status));
      const deck = (await r.json()).data;
      const commanders = (deck.commander || []).map((c) => c.name);
      if (!commanders.length) continue;
      const cards = {};
      for (const c of [...(deck.commander || []), ...(deck.mainBoard || [])]) cards[c.name] = (cards[c.name] || 0) + (c.count || 1);
      out.push({
        name: deck.name,
        code: deck.code,
        date: deck.releaseDate || d.releaseDate || "",
        commanders,
        cards: Object.entries(cards).map(([n, q]) => [n, q]),
      });
    } catch (e) {
      console.warn("skip", d.fileName, e.message);
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
out.sort((a, b) => (b.date || "").localeCompare(a.date || "") || a.name.localeCompare(b.name));
writeFileSync(new URL("../lib/precons.json", import.meta.url), JSON.stringify({ updated: new Date().toISOString().slice(0, 10), source: "MTGJSON", decks: out }));
console.log(`OK: ${out.length} mazzi`);
