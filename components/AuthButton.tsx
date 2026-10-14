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

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    client.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn(provider: "google" | "github") {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    setBusy(true);
    // La pagina corrente torna al login: la bozza resta nel browser e non si perde.
    const current = window.location.pathname + window.location.search;
    try {
      sessionStorage.setItem("precon-login-next", current);
    } catch {}
    await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(current)}`,
      },
    });
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
          {compact ? "👤" : "👤 "}{name}
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
    <div className="auth" style={{ display: "flex", gap: 8 }}>
      <button type="button" className="authbtn" onClick={() => signIn("google")} disabled={busy} title="Google">
        {t.signIn} · Google
      </button>
      <button type="button" className="authbtn" onClick={() => signIn("github")} disabled={busy} title="GitHub">
        GitHub
      </button>
    </div>
  );
}
