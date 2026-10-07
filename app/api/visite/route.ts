// Contatore pubblico dei visitatori.
// Usa Upstash Redis se sono presenti le variabili d'ambiente (UPSTASH_REDIS_REST_URL/TOKEN
// oppure KV_REST_API_URL/TOKEN, create da Vercel). Altrimenti usa il servizio gratuito Abacus.
export const dynamic = "force-dynamic";

const KEY = "precon-upgrade:visitatori";
const ABACUS = "https://abacus.jasoncameron.dev";
const ABACUS_NS = "precon-upgrade-vercel";
const ABACUS_KEY = "visitatori";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

let cache: { value: number; at: number } | null = null;

async function redis(cmd: string[]): Promise<number> {
  const r = await fetch(redisUrl!, {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Redis ${r.status}`);
  const j = await r.json();
  return Number(j.result ?? 0);
}

async function abacus(action: "get" | "hit"): Promise<number> {
  const r = await fetch(`${ABACUS}/${action}/${ABACUS_NS}/${ABACUS_KEY}`, { cache: "no-store" });
  if (r.status === 404 && action === "get") return 0;
  if (!r.ok) throw new Error(`Abacus ${r.status}`);
  const j = await r.json();
  return Number(j.value ?? 0);
}

async function read(): Promise<number> {
  if (cache && Date.now() - cache.at < 30_000) return cache.value;
  const value = redisUrl && redisToken ? await redis(["GET", KEY]) : await abacus("get");
  cache = { value, at: Date.now() };
  return value;
}

async function increment(): Promise<number> {
  const value = redisUrl && redisToken ? await redis(["INCR", KEY]) : await abacus("hit");
  cache = { value, at: Date.now() };
  return value;
}

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  try {
    return json({ count: await read() });
  } catch (e) {
    console.error(e);
    return json({ error: "Contatore non disponibile" }, 503);
  }
}

export async function POST() {
  try {
    return json({ count: await increment() });
  } catch (e) {
    console.error(e);
    return json({ error: "Contatore non disponibile" }, 503);
  }
}
