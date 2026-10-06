// Accesso ai dati EDHREC nel rispetto della loro informativa sulla condivisione dei dati:
// - massimo 1 richiesta al secondo (anche in caso di errori)
// - dopo una risposta 429 attendere almeno 2 secondi prima di riprovare
// - User-Agent con nome del progetto e indirizzo email di contatto
// - nessuna documentazione ufficiale: i campi possono cambiare senza preavviso

const CONTACT = process.env.EDHREC_CONTACT_EMAIL || "lucianoippolito49@gmail.com";
export const EDHREC_USER_AGENT = `PreconUpgrade/1.1 (${CONTACT})`;

const MIN_INTERVAL_MS = 1100; // margine sopra 1 richiesta/secondo
const RETRY_AFTER_429_MS = 2500; // almeno 2 secondi dopo un 429
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 ore: le statistiche cambiano lentamente
const MAX_CACHE_ENTRIES = 200;

type Entry = { data: unknown; expires: number };
const cache = new Map<string, Entry>();
const inFlight = new Map<string, Promise<unknown>>();
let queue: Promise<void> = Promise.resolve();
let lastRequest = 0;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Serializza le richieste dell'istanza: una alla volta, distanziate di almeno MIN_INTERVAL_MS.
function throttled<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const waitMs = lastRequest + MIN_INTERVAL_MS - Date.now();
    if (waitMs > 0) await sleep(waitMs);
    try {
      return await task();
    } finally {
      lastRequest = Date.now();
    }
  });
  queue = run.then(() => undefined, () => undefined);
  return run;
}

export class EdhrecError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

function retryDelay(res: Response) {
  const header = Number(res.headers.get("retry-after"));
  return Number.isFinite(header) && header > 0 ? Math.max(header * 1000, RETRY_AFTER_429_MS) : RETRY_AFTER_429_MS;
}

async function download(url: string): Promise<unknown> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await throttled(() =>
      fetch(url, {
        headers: { "User-Agent": EDHREC_USER_AGENT, Accept: "application/json" },
        next: { revalidate: CACHE_TTL_MS / 1000 },
        signal: AbortSignal.timeout(15000),
      })
    );
    if (res.ok) return res.json();
    if (res.status === 429 && attempt === 0) {
      await sleep(retryDelay(res)); // un solo nuovo tentativo, dopo la pausa richiesta
      continue;
    }
    if (res.status === 429) throw new EdhrecError("EDHREC sta limitando le richieste. Riprova tra qualche secondo.", 429);
    if (res.status === 404) throw new EdhrecError("EDHREC non ha una pagina per questo comandante.", 404);
    throw new EdhrecError("Dati EDHREC non disponibili in questo momento.", res.status);
  }
  throw new EdhrecError("Dati EDHREC non disponibili in questo momento.", 502);
}

// Legge un JSON EDHREC usando cache in memoria, cache di Next.js e deduplica delle richieste uguali.
export async function edhrecJson(path: string): Promise<any> {
  const url = `https://json.edhrec.com/pages/${path.replace(/^\/+/, "")}`;
  const hit = cache.get(url);
  if (hit && hit.expires > Date.now()) return hit.data;
  const pending = inFlight.get(url);
  if (pending) return pending;

  const request = download(url)
    .then((data) => {
      if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value as string);
      cache.set(url, { data, expires: Date.now() + CACHE_TTL_MS });
      return data;
    })
    .finally(() => inFlight.delete(url));
  inFlight.set(url, request);
  return request;
}

export function commanderSlug(name: string) {
  return name
    .split(" // ")[0]
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const commanderPage = (name: string) => edhrecJson(`commanders/${commanderSlug(name)}.json`);
