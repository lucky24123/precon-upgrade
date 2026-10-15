"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AuthButton from "../../components/AuthButton";
import InstagramLink from "../../components/InstagramLink";
import { LangSwitch, useLang } from "../../lib/i18n";
import { createSupabaseBrowserClient } from "../../lib/supabase-client";

type SiteUser = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  providers: string[];
};
type Directory = { users: SiteUser[]; total: number; matched: number; recent: number; page: number; pageSize: number };
type View = "loading" | "ready" | "signin" | "forbidden" | "error";

export default function Administration() {
  const { lang } = useLang();
  const en = lang === "en";
  const [view, setView] = useState<View>("loading");
  const [data, setData] = useState<Directory | null>(null);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    const reload = () => setRefresh(n => n + 1);
    window.addEventListener("focus", reload);
    const subscription = client?.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        requestId.current++;
        setData(null); setView("signin");
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") reload();
    });
    return () => { window.removeEventListener("focus", reload); subscription?.data.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const id = ++requestId.current;
    setView("loading"); setData(null);
    fetch(`/api/admin/users?${new URLSearchParams({ q: query, page: String(page) })}`,
      { cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (id !== requestId.current) return;
        if (response.status === 401) { setView("signin"); return; }
        if (response.status === 403) { setView("forbidden"); return; }
        if (!response.ok) throw new Error("unavailable");
        const result: Directory = await response.json();
        if (id !== requestId.current) return;
        setData(result); setView("ready");
      }).catch(error => {
        if (error.name !== "AbortError" && id === requestId.current) setView("error");
      });
    return () => controller.abort();
  }, [query, page, refresh]);

  const dates = new Intl.DateTimeFormat(en ? "en-GB" : "it-IT", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Rome",
  });
  const date = (value: string | null) => value ? dates.format(new Date(value)) : (en ? "Never" : "Mai");
  const pages = data ? Math.max(1, Math.ceil(data.matched / data.pageSize)) : 1;

  return (
    <main className="shell admin-shell">
      <header>
        <Link href="/" className="brand" data-testid="link-admin-home">PRECON UPGRADE <span>NO AI</span></Link>
        <div className="headright"><InstagramLink /><LangSwitch /><AuthButton /></div>
      </header>
      <section className="admin-intro">
        <p className="admin-kicker">{en ? "PRIVATE AREA" : "AREA RISERVATA"}</p>
        <h1>{en ? "Administration" : "Amministrazione"}</h1>
        <p>{en ? "Registered accounts, in one place. Read-only access." : "Gli account registrati, in un unico posto. Accesso di sola lettura."}</p>
        <Link href="/i-miei-mazzi" className="admin-back" data-testid="link-admin-decks">{en ? "Back to My decks" : "Torna a I miei mazzi"}</Link>
      </section>

      {view === "loading" && <section className="panel" role="status" data-testid="status-admin-loading">
        <p>{en ? "Checking access and loading accounts…" : "Verifica accesso e caricamento iscritti…"}</p>
      </section>}
      {view === "signin" && <section className="panel" data-testid="status-admin-signin">
        <h2>{en ? "Sign-in required" : "Accesso richiesto"}</h2>
        <p>{en ? "Sign in with the site owner's account to continue." : "Accedi con l’account del proprietario del sito per continuare."}</p>
        <AuthButton variant="inline" />
      </section>}
      {view === "forbidden" && <section className="panel" role="alert" data-testid="status-admin-forbidden">
        <h2>{en ? "Restricted access" : "Accesso riservato"}</h2>
        <p>{en ? "This account cannot view registered users." : "Questo account non è autorizzato a visualizzare gli iscritti."}</p>
      </section>}
      {view === "error" && <section className="panel" role="alert" data-testid="status-admin-error">
        <h2>{en ? "Accounts unavailable" : "Iscritti non disponibili"}</h2>
        <p>{en ? "Unable to verify access or load the list. No data is shown." : "Non riesco a verificare l’accesso o caricare l’elenco. Nessun dato viene mostrato."}</p>
        <button className="authbtn" onClick={() => setRefresh(n => n + 1)} data-testid="button-admin-retry">{en ? "Try again" : "Riprova"}</button>
      </section>}
      {view === "ready" && data && <>
        <section className="admin-stats" aria-label={en ? "Account statistics" : "Statistiche account"}>
          <div><span>{en ? "Registered accounts" : "Account registrati"}</span><strong data-testid="text-admin-total">{data.total}</strong></div>
          <div><span>{en ? "New in the last 7 days" : "Nuovi negli ultimi 7 giorni"}</span><strong data-testid="text-admin-recent">{data.recent}</strong></div>
        </section>
        <section className="panel admin-directory" aria-labelledby="directory-title">
          <div className="admin-toolbar">
            <div><h2 id="directory-title">{en ? "Registered users" : "Iscritti"}</h2>
              <p className="fine">{en ? "Most recent first. Times in Europe/Rome." : "Prima i più recenti. Orari Europe/Rome."}</p></div>
            <button className="authbtn ghostbtn" onClick={() => setRefresh(n => n + 1)} data-testid="button-admin-refresh">{en ? "Refresh" : "Aggiorna"}</button>
          </div>
          <form className="admin-search" onSubmit={e => { e.preventDefault(); setPage(1); setQuery(draft.trim()); }}>
            <div><label htmlFor="admin-search">{en ? "Search by email" : "Cerca per email"}</label>
              <input id="admin-search" type="search" maxLength={200} value={draft} onChange={e => setDraft(e.target.value)}
                placeholder={en ? "Email or part of it" : "Email o parte dell’indirizzo"} data-testid="input-admin-search" /></div>
            <button className="authbtn" type="submit" data-testid="button-admin-search">{en ? "Search" : "Cerca"}</button>
            {query && <button className="authbtn ghostbtn" type="button" data-testid="button-admin-reset"
              onClick={() => { setDraft(""); setQuery(""); setPage(1); }}>{en ? "Clear" : "Azzera"}</button>}
          </form>
          <p className="fine" role="status" data-testid="text-admin-matched">{data.matched} {en ? "accounts found" : "account trovati"}</p>
          {data.users.length === 0
            ? <p className="admin-empty" data-testid="text-admin-empty">{en ? "No accounts match this search." : "Nessun account corrisponde alla ricerca."}</p>
            : <ul className="admin-users" aria-label={en ? "Registered accounts" : "Account registrati"}>
              {data.users.map(user => <li key={user.id} className="admin-user" data-testid={`user-${user.id}`}>
                <div className="admin-user-email">{user.email || (en ? "Email unavailable" : "Email non disponibile")}</div>
                <div className="admin-providers">{user.providers.map(provider =>
                  <span key={provider}>{provider === "github" ? "GitHub" : provider === "google" ? "Google" : provider}</span>)}</div>
                <dl>
                  <div><dt>{en ? "Registered" : "Registrazione"}</dt><dd><time dateTime={user.created_at}>{date(user.created_at)}</time></dd></div>
                  <div><dt>{en ? "Last sign-in" : "Ultimo accesso"}</dt><dd>{user.last_sign_in_at ? <time dateTime={user.last_sign_in_at}>{date(user.last_sign_in_at)}</time> : date(null)}</dd></div>
                </dl>
              </li>)}
            </ul>}
          <nav className="admin-pagination" aria-label={en ? "Accounts pagination" : "Pagine degli iscritti"}>
            <button className="authbtn ghostbtn" disabled={page <= 1} onClick={() => setPage(n => n - 1)} data-testid="button-admin-previous">{en ? "Previous" : "Indietro"}</button>
            <span data-testid="text-admin-page">{en ? "Page" : "Pagina"} {page} / {pages}</span>
            <button className="authbtn ghostbtn" disabled={page >= pages} onClick={() => setPage(n => n + 1)} data-testid="button-admin-next">{en ? "Next" : "Avanti"}</button>
          </nav>
        </section>
        <p className="fine">{en ? "Only signed-up accounts appear here, not anonymous visitors. Linked Google and GitHub identities belong to the same account." :
          "Qui trovi gli account registrati, non i visitatori anonimi. Google e GitHub collegati allo stesso account non vengono contati due volte."}</p>
      </>}
    </main>
  );
}
