"use client";

// Tasti account: "Accedi", "Registrati" ed "Esci".
// - variant "header" (predefinito): nell'intestazione di ogni pagina.
//   Da disconnessi mostra Accedi e Registrati, che aprono un pannello con Google e GitHub.
//   Da connessi mostra il collegamento a "I miei mazzi" e il tasto Esci.
// - variant "inline": i provider subito visibili (per "Accedi per salvare" e "I miei mazzi").
// Con Google e GitHub la registrazione coincide con il primo accesso: Supabase crea l'account.
// Se Supabase non è configurato il componente non compare: niente segreti nel browser.

import { useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient, SUPABASE_CONFIGURED } from "../lib/supabase-client";
import { useLang } from "../lib/i18n";

type SupabaseUser = { id: string; email?: string | null; user_metadata?: Record<string, unknown> };
type Provider = "google" | "github";

export default function AuthButton({ variant = "header" }: { variant?: "header" | "inline" | "landing"; compact?: boolean }) {
  const { t, lang } = useLang();
  const en = lang === "en";
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [ready, setReady] = useState(false);
  const [panel, setPanel] = useState<null | "login" | "signup">(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState({ google: false, github: false });
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } })
      .then(r => r.ok ? r.json() : null)
      .then(settings => setProviders({ google: settings?.external?.google === true, github: settings?.external?.github === true }))
      .catch(() => {});
    client.auth.getUser().then(({ data }) => { setUser(data.user); setReady(true); });
    const refresh = () => client.auth.getUser().then(({ data }) => { setUser(data.user); setBusy(false); });
    window.addEventListener("focus", refresh);
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setPanel(null);
    });
    return () => { sub.subscription.unsubscribe(); window.removeEventListener("focus", refresh); };
  }, []);

  // Chiude il pannello cliccando fuori o con Esc.
  useEffect(() => {
    if (!panel) return;
    const onClick = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setPanel(null); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPanel(null); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, [panel]);

  async function signIn(provider: Provider) {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    setBusy(true); setError("");
    // Login in una finestra separata: la lista generata resta nella pagina originale.
    const popup = window.open("about:blank", "precon-login", "width=520,height=720");
    if (!popup) {
      setBusy(false);
      setError(en ? "Allow pop-ups to sign in without losing your list." :
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
      setError(en ? "This login provider is not configured yet." : "Questo metodo di accesso non è ancora configurato.");
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
    setBusy(false);
    // Le pagine dell'account non hanno senso da disconnessi.
    if (window.location.pathname.startsWith("/i-miei-mazzi")) window.location.href = "/";
  }

  if (!SUPABASE_CONFIGURED) return null;

  const providerButtons = (
    <div className="auth-providers">
      <button type="button" className="authbtn provider" onClick={() => signIn("google")} disabled={busy || !providers.google}>
        {en ? "Continue with Google" : "Continua con Google"}
        {!providers.google && <small>{en ? " · coming soon" : " · in arrivo"}</small>}
      </button>
      <button type="button" className="authbtn provider" onClick={() => signIn("github")} disabled={busy || !providers.github}>
        {en ? "Continue with GitHub" : "Continua con GitHub"}
        {!providers.github && <small>{en ? " · coming soon" : " · in arrivo"}</small>}
      </button>
      {error && <p role="alert" className="notice">{error}</p>}
    </div>
  );

  if (user) {
    const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.user_name as string) || (user.email || "").split("@")[0];
    if (variant === "inline") return null;
    if (variant === "landing") {
      return (
        <div className="land-account">
          <h2>{en ? `Welcome back, ${name}` : `Bentornato, ${name}`}</h2>
          <p>{en ? "Your saved decks are always available in My decks." : "I mazzi che salvi sono sempre disponibili in I miei mazzi."}</p>
          <a className="cta primary" href="/i-miei-mazzi">{t.myDecks} →</a>
        </div>
      );
    }
    return (
      <div className="auth auth-in">
        <a className="auth-user" href="/i-miei-mazzi" title={t.myDecks}>
          <span className="auth-name">{name}</span>
          <span className="auth-sub">{t.myDecks}</span>
        </a>
        <button type="button" className="authbtn ghostbtn" onClick={signOut} disabled={busy}>{t.signOut}</button>
      </div>
    );
  }

  if (variant === "landing") {
    return (
      <div className="land-account">
        <h2>{en ? "Sign up or sign in to save your decks" : "Registrati o fai login per salvare i mazzi"}</h2>
        <p>{en ? "It's free: the first time you continue with Google or GitHub your account is created, and you'll find your upgrades and decks in My decks."
          : "È gratis: la prima volta che continui con Google o GitHub l'account viene creato, e ritrovi upgrade e mazzi in I miei mazzi."}</p>
        {providerButtons}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="auth auth-inline">
        <p className="fine">{en ? "Sign in or create a free account:" : "Accedi o crea un account gratuito:"}</p>
        {providerButtons}
      </div>
    );
  }

  return (
    <div className="auth auth-out" ref={box}>
      <button type="button" className="authbtn" aria-expanded={panel === "login"} disabled={!ready}
        onClick={() => setPanel(p => p === "login" ? null : "login")}>{t.signIn}</button>
      <button type="button" className="authbtn ghostbtn" aria-expanded={panel === "signup"} disabled={!ready}
        onClick={() => setPanel(p => p === "signup" ? null : "signup")}>{en ? "Sign up" : "Registrati"}</button>
      {panel && (
        <div className="authpanel" role="dialog" aria-label={panel === "login" ? t.signIn : (en ? "Sign up" : "Registrati")}>
          <p className="authpanel-title">
            {panel === "login" ? (en ? "Sign in to your account" : "Accedi al tuo account") : (en ? "Create your account" : "Crea il tuo account")}
          </p>
          {providerButtons}
          <p className="fine">
            {panel === "login"
              ? (en ? "No account yet? The first sign-in creates it automatically." : "Non hai un account? Il primo accesso lo crea in automatico.")
              : (en ? "Free. Your account is created the first time you continue with Google or GitHub, so you can save your decks."
                : "È gratis. L'account viene creato la prima volta che continui con Google o GitHub e ti permette di salvare i mazzi.")}
          </p>
          <button type="button" className="authpanel-switch" onClick={() => setPanel(panel === "login" ? "signup" : "login")}>
            {panel === "login" ? (en ? "Sign up" : "Registrati") : (en ? "Already have an account? Sign in" : "Hai già un account? Accedi")}
          </button>
        </div>
      )}
    </div>
  );
}
