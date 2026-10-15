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

Da completare dopo approvazione: applicazione migrazione, assegnazione
unico proprietario, `tests/admin-database.sql`, security advisor,
push/deployment e controllo dell'API anonima in produzione.
Il test visuale autenticato sul sito reale richiede la sessione del
proprietario; i test UI con mock non sostituiscono tale prova.
