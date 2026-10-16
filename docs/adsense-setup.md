# Integrazione Google AdSense

Publisher fornito dal proprietario: `ca-pub-9440869401891473`.

## Codice

- `components/AdSense.tsx`, montato nel layout condiviso, carica una sola volta
  la libreria async con crossOrigin anonymous tramite Next Script.
- Tag account nei metadati HTML per verifica del publisher.
- `public/ads.txt`: autorizzazione diretta per il publisher.
- Pubbliche: home, crea mazzo, migliora, ban, privacy e termini.
- Nessuno script sulle pagine private I miei mazzi, Amministrazione, OAuth
  e su URL non riconosciuti. Il tag account statico non esegue tracciamento.
- Il componente racchiude i contenuti: un cambio di contesto pubblico/privato
  via SPA o cronologia blocca i nuovi contenuti e ricarica il documento.
  Non basta rimuovere il nodo script per scaricare una libreria Google attiva.
- Nessun invio applicativo di email, UUID o contenuti dei mazzi a Google.

## Prima della pubblicazione

L'account AdSense è in onboarding e il sito risulta ancora da collegare.
Non è stato osservato un messaggio europeo pubblicato.

1. Approvazione del proprietario per attivare codice di terze parti e privacy.
2. Configurare/pubblicare il messaggio europeo nella CMP Google:
   sito `precon-upgrade.vercel.app`, nome Precon Upgrade,
   privacy `https://precon-upgrade.vercel.app/privacy`, italiano e inglese,
   Acconsento, Nega il consenso e Gestisci le opzioni.
3. Preferire il messaggio standard bloccante; non attivare ottimizzazioni
   che mostrano annunci prima della scelta durante questa configurazione.
4. Pubblicare codice e informativa IT/EN.
5. Collegare/verificare il sito dal pannello AdSense e, con approvazione,
   richiedere la revisione. Il caricamento del codice non equivale
   all'approvazione del sito né garantisce l'apparizione degli annunci.
6. Verificare messaggio reale, scelta negativa e riapertura preferenze.
   Parametri Google: `?fc=alwaysshow&fctype=gdpr`.

Il messaggio CMP, gli annunci automatici e la revisione del sito sono
impostazioni del pannello AdSense: non vengono attivati dal solo commit.
Non inventare ID di blocchi pubblicitari e non simulare clic sugli annunci.
Nessun banner personalizzato sostituisce una CMP certificata.

## QA

- Build produzione e TypeScript.
- Script con publisher corretto e singola inclusione su pagine pubbliche.
- Script assente su pagine account, admin e callback.
- Annunci bloccati nei test browser: nessuna impressione di test o clic.
- Meta account presente; ads.txt leggibile come testo.
- Navigazione privata/pubblica a documento intero; verificare che librerie
  già caricate non restino in pagine private durante una navigazione SPA.
- Privacy IT/EN, link Google, viewport 1280 e 375.
- Test CMP e annuncio effettivo solo dopo pubblicazione e approvazione Google.

### Risultati locali del 16 ottobre 2026

- Build di produzione/TypeScript e 6 gruppi di test Node: PASS.
- Browser: una sola inclusione con publisher corretto su tutte le pagine
  pubbliche; script assente su admin, lista/dettaglio mazzi e auth/done.
- Cambio di contesto privato/pubblico: ricaricamento completo verificato.
  Anche il cambio pubblico/privato tramite cronologia non conserva lo script.
- Privacy italiano/inglese: nuova sezione verificata.
- Desktop 1280 e telefono 375: screenshot controllati, nessun overflow.
- `/ads.txt` locale: testo e identificativo corretti.
- Libreria Google sostituita da stub nei test: nessun annuncio reale richiesto.
- La build QA non ha variabili Supabase pubbliche: i pulsanti account non
  compaiono nell'anteprima locale. Non modificare le variabili Vercel esistenti.
- Pubblicazione CMP, consenso reale, Auto Ads, collegamento del sito e
  revisione AdSense ancora da eseguire, dopo conferma del proprietario.

## Documentazione

- [Requisiti CMP Google](https://support.google.com/adsense/answer/13554020?hl=en).
- [Privacy e messaggi](https://support.google.com/adsense/answer/10924669).
- [Guida ads.txt](https://support.google.com/adsense/answer/12171612?hl=en).
