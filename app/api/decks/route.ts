import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase-server";

export async function POST(request: Request) {
  const en = request.headers.get("x-lang") === "en";
  const error = (it: string, english: string, status: number) =>
    NextResponse.json({ error: en ? english : it }, { status });
  const origin = request.headers.get("origin");
  let sameOrigin = false;
  try { sameOrigin = !!origin && new URL(origin).host === request.headers.get("host"); } catch {}
  if (!sameOrigin)
    return error("Richiesta non autorizzata.", "Request not allowed.", 403);
  const client = await createSupabaseServerClient();
  if (!client) return error("Salvataggio non ancora attivo.", "Saving is not enabled yet.", 503);
  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !user) return error("Accedi per salvare.", "Sign in to save.", 401);
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 300000)
      return error("Lista troppo grande.", "List is too large.", 413);
    const payload = JSON.parse(raw);
    const { data, error: saveError } = await client.rpc("save_deck", { p: payload });
    if (saveError) return error(
      "Salvataggio non riuscito. Controlla i dati o riprova.",
      "Saving failed. Check the data or try again.", 400);
    return NextResponse.json({ id: data }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return error("Dati del mazzo non validi.", "Invalid deck data.", 400);
  }
}
