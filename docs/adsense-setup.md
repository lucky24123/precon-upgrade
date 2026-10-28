# Integrazione Google AdSense

Publisher fornito dal proprietario: `ca-pub-9440869401891473`.

## Codice

- `components/AdSense.tsx`, montato nel layout condiviso, carica una sola volta
  la libreria async con crossOrigin anonymous tramite Next Script.
- Tag account nei metadati HTML per verifica del publisher.
- `public/ads.txt`: autorizzazione diretta per il publisher.
- Pubbliche: home, crea mazzo, migliora, ban, privacy, termini e pagine guida
  `/guida/come-funziona`, `/guida/migliorare-precon`, `/guida/creare-mazzo`.
- Nessuno script sulle pagine private I miei mazzi, Amministrazione, OAuth
  e su URL non riconosciuti. Il tag account statico non esegue tracciamento.
- Il componente racchiude i contenuti: un cambio di contesto pubblico/privato
  via SPA o cronologia blocca i nuovi contenuti e ricarica il documento.
  Non basta rimuovere il nodo script per scaricare una libreria Google attiva.
- Nessun invio applicativo di email, UUID o contenuti dei mazzi a Google.

## Sequenza di attivazione

La sequenza seguente separa codice, consenso e approvazione del sito.
Il solo deployment non abilita automaticamente la pubblicazione degli annunci.

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
- Le verifiche del consenso reale restano distinte dai test con libreria stub.

### Pubblicazione del 16 ottobre 2026

- Il proprietario ha confermato pubblicazione, esclusioni private, privacy,
  messaggio europeo, Auto Ads in-page e richiesta di revisione.
- Commit `9412c86` pubblicato su main; integrazione Vercel completata con
  stato GitHub `success`, deployment `2eethaqmkxoEw1tjyZyLdJok8XUB`.
- CMP Google: messaggio `Precon Upgrade · Consenso europeo`, sito selezionato,
  nome e URL privacy corretti; italiano predefinito e inglese disponibile;
  Acconsento, Nega il consenso in tutte le regioni e Gestisci le opzioni.
  Ottimizzazione del consenso disattivata, logo opzionale disattivato.
  La tabella Google mostra `Pubblicato`.
- Auto Ads: attivi; banner in-page attivi; formati basati sull'intenzione
  disattivati (0/1), overlay disattivati (0/3), multiplex disattivati.
  Ottimizzazione automatica degli esperimenti disattivata, per mantenere
  i formati scelti. Modifiche salvate con applicazione immediata.
- Proprietà del sito verificata da Google tramite meta tag.
- Richiesta di revisione inviata: stato osservato `In fase di preparazione`,
  sezione `Revisione richiesta`. Il sito non è ancora approvato.
- Produzione: `/ads.txt` HTTP 200 e riga publisher corretta; meta corretto;
  una sola inclusione dello script sulle sei pagine pubbliche; zero su
  amministrazione, I miei mazzi e auth/done. Test browser con script stub.
- API amministratore senza autenticazione: HTTP 401.
- Privacy IT/EN online; desktop 1280 e mobile 375 controllati, nessun
  overflow orizzontale nelle pagine pubbliche testate.
- Un singolo controllo del messaggio reale con i parametri Google non ha
  ancora mostrato la CMP. Non risultano quindi verificati rifiuto,
  riapertura delle preferenze o erogazione reale degli annunci.
  Ripetere dopo propagazione e approvazione senza cliccare annunci.
- Il pannello riportava ancora ads.txt `Non trovato` prima della revisione,
  mentre il file live è già disponibile. Attendere la nuova scansione Google.

## Documentazione

- [Requisiti CMP Google](https://support.google.com/adsense/answer/13554020?hl=en).
- [Privacy e messaggi](https://support.google.com/adsense/answer/10924669).
- [Guida ads.txt](https://support.google.com/adsense/answer/12171612?hl=en).
