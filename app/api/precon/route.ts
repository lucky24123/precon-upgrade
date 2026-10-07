import { NextResponse } from "next/server";
import data from "../../../lib/precons.json";

type Deck = { name: string; code: string; date: string; commanders: string[]; cards: [string, number][] };
const decks = (data as unknown as { decks: Deck[] }).decks;

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const keys = (name: string) => [norm(name), norm(name.split(" // ")[0])];

// indice comandante -> mazzi (stessa lista ristampata = un solo risultato)
const index = new Map<string, Deck[]>();
for (const d of decks) {
  for (const c of d.commanders) {
    for (const k of keys(c)) {
      const list = index.get(k) || [];
      const sig = d.cards.map(([n, q]) => `${q}${n}`).sort().join("|");
      if (!list.some((x) => x.cards.map(([n, q]) => `${q}${n}`).sort().join("|") === sig)) list.push(d);
      index.set(k, list);
    }
  }
}
const allCommanders = [...new Set(decks.flatMap((d) => d.commanders))].sort((a, b) => a.localeCompare(b));

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.has("list")) {
    return NextResponse.json({ commanders: allCommanders, updated: (data as { updated: string }).updated }, { headers: { "Cache-Control": "public, max-age=86400" } });
  }
  const q = (url.searchParams.get("commander") || "").trim();
  if (!q) return NextResponse.json({ decks: [] });
  const found = index.get(norm(q)) || [];
  return NextResponse.json(
    {
      decks: found.map((d) => ({
        name: d.name,
        set: d.code,
        year: d.date.slice(0, 4),
        commanders: d.commanders,
        // il comandante cercato va nel campo apposito: nella lista restano le altre 99 carte (e l'eventuale partner)
        list: d.cards
          .filter(([n]) => !keys(n).includes(norm(q)))
          .map(([n, qty]) => `${qty} ${n}`)
          .join("\n"),
      })),
    },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}
