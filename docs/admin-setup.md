# Amministrazione iscritti

## Accesso e dati

La pagina `/amministrazione` elenca solo email, data di registrazione,
ultimo login e provider collegati. Ricerca per email, ordinamento dai più
recenti e pagine da 25 account. Orari Europe/Rome, interfaccia IT/EN.
Nessuna modifica, cancellazione o esportazione dei dati degli iscritti.

## Autorizzazione

- Applicare `supabase/migrations/20261015_admin_users.sql`.
- Verificare nel pannello Supabase l'account del proprietario.
- Assegnare esclusivamente il suo UUID in `site_private.site_admins`,
  tramite il SQL editor amministrativo, mai dal browser del sito.
- La migrazione non assegna privilegi a un'email o a un UUID hardcoded.
- Nessun altro utente può leggere o scrivere la tabella amministratori.
- `is_site_admin()` legge il chiamante da `auth.uid()`.
- `list_site_users()` ricontrolla il ruolo ad ogni chiamata e restituisce
  solo i campi necessari; non restituisce token, password o metadati.
- Le funzioni SECURITY DEFINER usano search_path vuoto e riferimenti qualificati.
- Le route verificano `getUser()` e il ruolo prima di leggere l'elenco.
- Nessuna chiave `service_role` è necessaria.
- Risposte e pagina: no-store, noindex e no-referrer.
- Il link Amministrazione compare solo dopo la verifica del ruolo.
- La disconnessione cancella immediatamente l'elenco dal componente.

Per revocare il ruolo, eliminare solo la riga dell'UUID interessato dalla
tabella privata tramite un accesso amministrativo al database.

## Inventario QA

- Build TypeScript e produzione.
- Anonimo: API 401 e invito ad accedere, senza elenco.
- Utente normale: API 403; RPC diretta negata, nessun elenco.
- Amministratore: lettura dei soli campi consentiti.
- Anon e authenticated non possono leggere o modificare gli amministratori.
- Metadati e filtri non possono promuovere il chiamante.
- Ricerca, azzera, pagine avanti/indietro, aggiornamento.
- Filtri troppo lunghi e pagine non valide rifiutati.
- Stato senza risultati, errore con riprova, login richiesto.
- Disconnessione e richieste concorrenti non ripristinano dati obsoleti.
- IT/EN, desktop 1280 e telefono 375, focus e assenza di overflow.
- Mock UI con dati sintetici distinto dalle verifiche SQL reali.
- Test SQL temporanei in transazione con ROLLBACK, nessun utente persistente.

## Verifiche locali completate

- Build Next.js di produzione e TypeScript: PASS.
- `node --test tests/admin-routes.test.mjs`: 4 gruppi PASS,
  inclusi accesso negato, filtri, cache e revoca dopo il controllo iniziale.
- API reale locale senza cookie: 401, nessun elenco, no-store.
- UI con dati sintetici: ricerca senza risultati e con un risultato,
  azzera, avanti/indietro, aggiorna, errore/riprova, accesso negato, IT/EN: PASS.
- Screenshot 1280×900 e 375×812: controllati, nessun overflow orizzontale.
- Nessun dato reale degli iscritti usato nei test UI o nell'anteprima.

## Attivazione e controlli del 15 ottobre 2026

- Migrazione applicata dopo approvazione del proprietario.
- Assegnato un unico amministratore; verificata corrispondenza all'UUID approvato.
- `tests/admin-database.sql`: completato senza errori, ROLLBACK finale.
  Lettura amministratore, campi minimi, limite pagina, filtri e ricerca
  verificati. Utente senza ruolo e anonimo rifiutati; lettura/scrittura
  della tabella ruoli e auto-promozione tramite metadati rifiutate.
- RPC diretta anonima: HTTP 401.
- Codice pubblicato su GitHub; deployment Vercel di `5f19ac0` completato.
- `/amministrazione` in produzione: HTTP 200; API senza sessione: HTTP 401.
  Verificati Cache-Control private/no-store, X-Robots-Tag e robots.txt.

### Avvisi del security advisor

- RLS senza policy su `site_private.site_admins`: intenzionale deny-all;
  schema e tabella privati senza privilegi per anon/authenticated.
- Esecuzione SECURITY DEFINER da authenticated sulle due RPC: intenzionale.
  Necessaria per leggere il minimo indispensabile da auth.users; autorizzazione
  verificata tramite auth.uid() e tabella privata, search_path vuoto,
  parametri limitati e nessun SQL dinamico. Non sostituire con una query
  auth.users accessibile indiscriminatamente agli utenti.
- Protezione password compromesse disabilitata: impostazione generale
  segnalata dall'advisor, non modificata nell'ambito di questa funzionalità.

Documentazione dei controlli: [funzioni database](https://supabase.com/docs/guides/database/functions),
[avviso funzioni privilegiate](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable),
[RLS senza policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)
e [protezione password](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

Il test visuale autenticato sul sito reale richiede la sessione del proprietario,
non disponibile durante questa pubblicazione; la lettura autorizzata è stata
verificata sul database e i test UI con dati sintetici sono separati.
