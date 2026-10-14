"use client";
import { useEffect, useState } from "react";
import { useLang } from "../../../lib/i18n";
import { createSupabaseBrowserClient } from "../../../lib/supabase-client";
export default function Done() {
  const { lang } = useLang();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    client.auth.getUser().then(({ data }) => {
      if (data.user) { setOk(true); window.close(); }
    });
  }, []);
  return <main className="shell"><section className="panel">
    <h1>{lang === "en" ? "Sign in" : "Accesso"}</h1>
    <p>{ok ? (lang === "en" ? "Signed in. You can close this window and return to your deck." :
      "Accesso riuscito. Puoi chiudere questa finestra e tornare al tuo mazzo.") :
      (lang === "en" ? "Sign-in was not completed. Return to the site and try again." :
      "Accesso non completato. Torna al sito e riprova.")}</p>
  </section></main>;
}
