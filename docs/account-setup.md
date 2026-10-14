# Account e salvataggio

## Stato

Codice Google/GitHub predisposto; attivazione richiede le applicazioni OAuth.
Il database Supabase include la funzione transazionale `public.save_deck(jsonb)`.
Non si usa una chiave service_role per salvare dati.

## Variabili Vercel

- `NEXT_PUBLIC_SUPABASE_URL`: URL del progetto Supabase.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: chiave pubblica del progetto.

Le variabili NEXT_PUBLIC vengono incluse nel build: dopo una modifica occorre un nuovo deployment.
Non mettere Client Secret OAuth o password del database nel repository.

## URL OAuth

Nelle console Google e GitHub il callback è:

`https://ekqljaoqteutrxlffqmy.supabase.co/auth/v1/callback`

Non usare il callback del sito come callback del provider.

Su Supabase, Authentication → URL Configuration:

- Site URL: `https://precon-upgrade.vercel.app`
- Redirect URLs: `https://precon-upgrade.vercel.app/auth/callback`
- Per test locali, aggiungere esplicitamente il callback localhost appropriato.

Su Supabase, Authentication → Providers, inserire Client ID e Secret direttamente
nei campi del provider corrispondente. Le credenziali non vanno nel codice del sito.

Documentazione ufficiale:
[Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
e [GitHub](https://supabase.com/docs/guides/auth/social-login/auth-github).

## Flusso

Il login apre una finestra separata: la pagina con il risultato rimane aperta.
Il callback scrive i cookie sulla risposta HTTP e permette solo destinazioni relative.
Se il browser blocca i popup, viene mostrato un messaggio.

- Crea un mazzo salva lista generata, budget, colori e risultato.
- Migliora il mazzo salva lista originale, budget, numero di cambi e suggerimenti.
  I suggerimenti non sono applicati automaticamente.
- I miei mazzi permette apertura e cancellazione.

## Test eseguiti

- Compilazione Next.js senza configurazione Supabase.
- Salvataggio atomico di lista e carte su Supabase.
- Persistenza della fotografia di un confronto.
- Isolamento fra due utenti tramite RLS.
- Impossibilità di associare carte/confronti al mazzo altrui.
- Una carta non valida non lascia un mazzo parziale.
- Il ruolo anonimo non può invocare la funzione di salvataggio.
- Dati temporanei di test annullati con ROLLBACK.

Login Google/GitHub end-to-end non ancora verificato: provider ancora disattivati.
Prima di aprire registrazioni pubbliche definire informativa privacy e percorso di
cancellazione account; una pagina generica non sostituisce questi requisiti.
