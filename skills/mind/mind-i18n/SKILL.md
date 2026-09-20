---
name: mind-i18n
description: Internazionalizzazione e localizzazione di applicazioni (i18n/l10n). Attivazione: "localizza l'app", "aggiungi una lingua", "traduci", "supporto multilingua", "i18n", "RTL", "formato date/valute per paese". Si applica sia quando si crea l'infrastruttura i18n sia quando si aggiunge una lingua a un progetto esistente.
---

# mind-i18n — Internazionalizzazione e localizzazione

## Leggi di ferro

| # | Regola |
|---|--------|
| 1 | MAI concatenare stringhe o mettere testo traducibile dentro il codice (nessun `"errore: " + msg` in linea). |
| 2 | OGNI stringa visibile all'utente passa dal layer i18n. |
| 3 | Plurali, date, valute e ordine delle parole NON si traducono mai a mano: si usano le funzioni del framework. |

## FASE 0 — ASSESSMENT

Checklist di raccolta prima di toccare codice:

- [ ] Inventario stringhe visibili: UI, messaggi di errore, email, notifiche, tooltip, placeholder, attributi `alt`/`aria-label`.
- [ ] Date, numeri, valute presenti (es. prezzi, scadenze, timestamp).
- [ ] Framework usato: React / Next / Vue / Angular / nativo / altro.
- [ ] Lingua di default (source) e lingua/i target.
- [ ] Requisiti RTL (linguaggio scritto da destra a sinistra presente?).
- [ ] Verifica se i18n è già parzialmente presente (nuove lingue su progetto esistente).

## FASE 1 — STRUTTURA

### Scelta del sistema (per stack)

| Stack | Sistema consigliato |
|-------|--------------------|
| React | react-i18next |
| Next.js | next-intl (App Router) |
| Vue | vue-i18n |
| Angular | @angular/localize |
| Flutter | flutter intl / gen-l10n |
| Mobile nativo (iOS/Android) | String catalogs / Android resources |
| Backend/altro | i18next, gettext, ICU MessageFormat |

> Dubbio su API, setup o versioni → **context7-mcp** per la documentazione ufficiale del framework.

### Convenzioni

| Aspetto | Regola |
|---------|--------|
| Nomi chiavi | Scoping per dominio: `auth.login.title`, `checkout.summary.total`, `errors.network`. |
| File per lingua | Gerarchia file: `locale/it.json`, `locale/en.json`. |
| File di default | Lingua source sempre presente (es. `en`). |
| Fallback | Fallback automatico a lingua source; in dev la chiave mancante è visibile (es. chiave a video o warning in console). |

## FASE 2 — ESTRAZIONE

- [ ] Porta TUTTE le stringhe nei file di locale; nessun letterale residuo nel codice.
- [ ] Parametri/interpolazione: `"Ciao, {name}"`, non concatenazione.
- [ ] Variabili PLURALE con le forme corrette del framework (es. `one`/`other`, `few`/`many` per il polacco, ecc.).
- [ ] Contesto grammaticale dove serve (maschile/femminile, accordo del verbo).
- [ ] Niente HTML/tag dentro le stringhe se evitabile; se inevitabile → documentarlo.
- [ ] Chiavi con contesto nel nome, non la frase inglese letterale.

## FASE 3 — FORMATTATTURA LOCALE

| Area | Regola |
|------|--------|
| Date/ora/valuta/numeri | API locale del framework: `Intl.*`, `format`/`number` del sistema scelto. |
| Fusi orari | Convertire in locale; mai formattare "manualmente". |
| RTL | Layout mirroring, testi e iconografia speculari, direzione da attributo `lang`/`dir`. |

## FASE 4 — TRADUZIONE

- [ ] Traduzioni per significato e contesto, NON parola per parola.
- [ ] Tono coerente con le preferenze utente (vedi **mind-memory**).
- [ ] MAI tradurre marchi e nomi propri.
- [ ] Stringhe che cambiano ordine in altre lingue → frase intera con placeholder, MAI spezzare in pezzi concatenati.
- [ ] Traduzioni non verificate da un madrelingua → **segnalarlo**, non spacciarle per perfette.

## FASE 5 — VERIFICA i18n

- [ ] Test per OGNI lingua: almeno render delle viste chiave.
- [ ] Scan per stringhe hardcoded: zero letterali visibili nella UI.
- [ ] Verifica fallback attivo (chiave mancante → source).
- [ ] Verifica RTL se previsto.
- [ ] A11y con lingue lunghe: overflow, wrapping, taglio del testo.

## Tabella anti-pattern

| Anti-pattern | Perché è sbagliato |
|--------------|--------------------|
| Chiavi che rispecchiano la stringa inglese letterale senza contesto | Inutilizzabili per lingue con grammatica diversa |
| Tradurre a mano plurali e date | Errori sistematici, impossibile gestire tutte le forme |
| Dimenticare il fallback | UI rotta a metà lingua, chiavi a video |
| Chiavi duplicate per lo stesso concetto | Traduzioni incoerenti nello stesso prodotto |
| Tradurre separatamente stringhe che vanno insieme | Frasi spezzate, ordine di parole sbagliato |
| Nessun test sulle lingue | Regressioni silenziose a ogni release |

## Red flags

- Nuove stringhe aggiunte direttamente nel codice dopo l'implementazione i18n.
- Lingue parziali (mancano chiavi, fallback a video).
- RTL rotto (layout non speculare, direzione errata).
- Date nel formato sbagliato rispetto alla locale.

## COORDINAMENTO (obbligatorio)

mind-i18n NON decide la rotta: è richiamata da **using-mind** (orchestratore).

| Richiamo | Quando |
|----------|--------|
| → mind-implementation | per scrivere il codice i18n |
| → mind-testing | per i test multilingua e RTL |
| → mind-verification | come gate finale |
| → mind-memory (memory add) | per salvare decisioni i18n: lingue, convenzioni |
| → frontend-design | se l'aggiunta di lingue impatta layout/design |
| → context7-mcp | per la documentazione del framework i18n |

Prima di tradurre: **memory search** per preferenze e tono utente.

## Gate

Multilingua completo SOLO se:

- [ ] Zero stringhe hardcoded.
- [ ] Fallback attivo e verificato.
- [ ] Tutte le lingue renderizzate e testate.
- [ ] RTL verificato se presente.