# Inventario QA account

- Pulsanti Google/GitHub: apertura popup e gestione provider non configurato.
- Callback senza codice: redirect interno, nessun errore 500.
- Callback con codice invalido: errore di accesso, nessuna sessione creata.
- Callback con destinazione esterna: rifiuto destinazione.
- Creazione mazzo: generazione 100 carte, identificatori Scryfall per il salvataggio.
- Upgrade: identificatori della lista riconosciuta e fotografia delle impostazioni.
- Salva: nome richiesto, conferma successo solo dopo risposta del database.
- Anonimo: messaggio accesso richiesto; nessun dato salvato.
- Database: due utenti isolati, ownership carte/confronti, rollback atomico.
- IT/EN: pulsanti di salvataggio e avvisi tradotti.
- Schermi 1280px e 375px: assenza di overflow e controlli leggibili.
- Pagine private: escluse da indicizzazione.

Limiti QA: nessun login OAuth reale eseguito senza applicazioni Google/GitHub;
nessun deployment con le nuove variabili Vercel senza team autorizzato.

## Risultati della sessione

- PASS generazione reale e presenza del pulsante Salva mazzo.
- PASS confronto reale e presenza del pulsante Salva confronto.
- PASS richiesta di salvataggio anonima rifiutata con invito all'accesso.
- PASS risultati mantenuti nella pagina durante l'invito all'accesso.
- PASS IT/EN e viewport 1280px/375px, nessun overflow orizzontale.
- PASS callback con destinazione esterna: destinazione ignorata.
- PASS test SQL con due utenti temporanei: isolamento e rollback atomico.
- PASS Supabase security advisors: nessun avviso dopo la migrazione.
- Google/GitHub risultano disattivati nelle impostazioni pubbliche Supabase.
