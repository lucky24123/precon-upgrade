import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Scambia il codice OAuth con la sessione e torna alla pagina salvata
// in sessionStorage dal pulsante "Accedi per salvare".

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const host = request.headers.get("host") || requestUrl.host;
  const origin = `${process.env.NODE_ENV === "production" ? "https:" : requestUrl.protocol}//${host}`;
  const code = searchParams.get("code");
  const requested = searchParams.get("next") || "/";
  const next = requested.startsWith("/") && !requested.startsWith("//") && !requested.includes("\\")
    ? requested : "/";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const response = NextResponse.redirect(new URL(next, origin));
  response.headers.set("Cache-Control", "private, no-store");
  if (!code || !url || !key) return response;

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const failed = new URL(next, origin);
    failed.searchParams.set("auth_error", "1");
    return NextResponse.redirect(failed);
  }
  return response;
}
