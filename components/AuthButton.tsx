"use client";

// Pulsante Accedi / profilo con i provider Google e GitHub.
// Se Supabase non è configurato il pulsante è disattivato: niente segreti nel browser.

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient, SUPABASE_CONFIGURED } from "../lib/supabase-client";
import { useLang } from "../lib/i18n";

type SupabaseUser = { id: string; email?: string | null; user_metadata?: Record<string, unknown> };

export default function AuthButton({ compact = false }: { compact?: boolean }) {
  const { t, lang } = useLang();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [menu, setMenu] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState({ google: false, github: false });

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } })
      .then(r => r.ok ? r.json() : null)
      .then(settings => setProviders({ google: settings?.external?.google === true, github: settings?.external?.github === true }))
      .catch(() => {});
    client.auth.getUser().then(({ data }) => setUser(data.user));
    const refresh = () => client.auth.getUser().then(({ data }) => { setUser(data.user); setBusy(false); });
    window.addEventListener("focus", refresh);
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => { sub.subscription.unsubscribe(); window.removeEventListener("focus", refresh); };
  }, []);

  async function signIn(provider: "google" | "github") {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    setBusy(true); setError("");
    // Login in una finestra separata: la lista generata resta nella pagina originale.
    const popup = window.open("about:blank", "precon-login", "width=520,height=720");
    if (!popup) {
      setBusy(false);
      setError(lang === "en" ? "Allow pop-ups to sign in without losing your list." :
        "Consenti le finestre popup per accedere senza perdere la lista.");
      return;
    }
    const { data, error: loginError } = await client.auth.signInWithOAuth({
      provider,
      options: {
        skipBrowserRedirect: true,
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/done`,
      },
    });
    if (loginError || !data.url) {
      popup.close(); setBusy(false);
      setError(lang === "en" ? "This login provider is not configured yet." : "Questo metodo di accesso non è ancora configurato.");
      return;
    }
    popup.location.href = data.url;
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (popup.closed || Date.now() - started > 300000) {
        window.clearInterval(timer); setBusy(false);
        client.auth.getUser().then(({ data }) => setUser(data.user));
      }
    }, 1000);
  }

  async function signOut() {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    setBusy(true);
    await client.auth.signOut();
    setUser(null);
    setMenu(false);
    setBusy(false);
  }

  if (!SUPABASE_CONFIGURED) return null;

  if (user) {
    const name = (user.user_metadata?.full_name as string) || (user.email || "").split("@")[0];
    return (
      <div className="auth" style={{ position: "relative" }}>
        <button type="button" className="authbtn" onClick={() => setMenu(m => !m)} disabled={busy}>
          {name}
        </button>
        {menu && (
          <div className="authmenu">
            <button type="button" onClick={() => { window.location.href = "/i-miei-mazzi"; }}>{t.myDecks}</button>
            <button type="button" onClick={signOut} disabled={busy}>{t.signOut}</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="auth" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button type="button" className="authbtn" onClick={() => signIn("google")} disabled={busy || !providers.google} title="Google">
        {t.signIn} · Google
      </button>
      <button type="button" className="authbtn" onClick={() => signIn("github")} disabled={busy || !providers.github} title="GitHub">
        GitHub
      </button>
      {error && <p role="alert" className="notice">{error}</p>}
      {!providers.google && !providers.github && <p className="fine">
        {lang === "en" ? "Account sign-in is being configured." : "Accesso account in preparazione."}
      </p>}
    </div>
  );
}
