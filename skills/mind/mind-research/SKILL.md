---
name: mind-research
description: Ricerca tecnica approfondita per decisioni di scelta (librerie, framework, architettura, best practice). Usa quando una domanda richiede più di una risposta immediata, ci sono opzioni con trade-off, o serve una comparazione con evidenza verificata. Proibisce raccomandazioni senza fonti.
---

# mind-research

Ricerca approfondita per decisioni tecniche basate su evidenza verificata.

## Scopo

Prendere decisioni tecniche fondate (scelta libreria/framework, architettura, best practice) confrontando opzioni con evidenza verificata. Ogni raccomandazione deve essere tracciabile a fonti controllate.

## Leggi di ferro

| # | Legge |
|---|-------|
| 1 | NESSUNA RACCOMANDAZIONE SENZA FONTI VERIFICATE |
| 2 | CONCLUSIONI CON EVIDENZA, NON CON AUTOREVOLEZZA |

## Quando usarla

- Domanda che richiede più di una risposta immediata.
- Scelte con trade-off espliciti.
- Comparazione tra opzioni concorrenti.
- Decisione che avrà costo di migrazione/manutenzione.

## Fasi

### 1. DEFINISCI LA DOMANDA

- Criterio di decisione esplicito (es. "che database per X con vincoli Y").
- Vincoli: costi, competenze del team, scalabilità, manutenzione, licenze.
- Criterio di done della ricerca: cosa deve essere vero perché la ricerca sia conclusa.

Output: domanda formulata + vincoli + criterio di done.

### 2. RACCOGLI FONTI

Fonti ammesse, in ordine di priorità:

1. Documentazione ufficiale (per librerie/framework: **context7-mcp**).
2. Repository e release notes.
3. Benchmark riproducibili con contesto.
4. Esperienze di campo verificate (issue, thread con prove).

Per ogni fonte registrare: URL, data di consultazione, rilevanza, affidabilità.

**Tabella fonti:**

| # | Fonte | URL | Data | Rilevanza | Affidabilità | Note |
|---|-------|-----|------|-----------|--------------|------|
| 1 |      |     |      |           |              |      |

Output: tabella fonti completa, ogni fonte datata e verificabile.

### 3. CONFRONTA

**Tabella di confronto per criterio** (opzione → punteggio/nota per ciascun criterio):

| Opzione | Criterio A | Criterio B | Criterio C | Costi nascosti |
|---------|-----------|-----------|-----------|----------------|
| Opt 1   |           |           |           |                |
| Opt 2   |           |           |           |                |

Costi nascosti da includere sempre:
- Manutenzione.
- Curva di apprendimento.
- Ecosistema.
- Licenze.
- Supporto (garantito/comunitario).

Output: matrice di confronto con costi nascosti espliciti.

### 4. VALUTA CONTRO IL CONTESTO

- Cosa esiste già nel progetto.
- Chi mantiene l'opzione scelta (team, community, azienda).
- Costi di migrazione.

Output: analisi fit col contesto esistente.

### 5. FORMULA RACCOMANDAZIONE

- Scelta consigliata.
- Alternative.
- Condizioni in cui l'alternativa vince.
- Rischio residuo.

Output: raccomandazione non assoluta, con alternative e rischio.

### 6. SALVA

- Registrare decisione e motivazione in **mind-memory** (tool `memory` add) per riusarla.

Output: voce in mind-memory con decisione, motivazione e fonti.

## Anti-pattern di ricerca

| Anti-pattern | Rischio | Contromisura |
|--------------|---------|--------------|
| Fidarsi di un solo blog | Base informativa non verificabile | Minimo 2 fonti indipendenti + 1 ufficiale |
| Fonti non datate | Info obsolete | Ogni fonte deve avere data |
| Benchmark senza contesto | Risultati fuorvianti | Verificare HW, versione, dataset, setup |
| "Tutti usano X quindi X" | Effetto gregge, zero evidenza | Richiedere benchmark/confronto concreto |
| Consiglio senza vincoli | Scelta non applicabile | Riferire sempre ai vincoli del passo 1 |

## Red flags (arresta la ricerca)

- Risposta istintiva senza fonti.
- Fonte non verificabile (URL assente, rotto, non controllabile).
- Comparazione senza criteri espliciti.
- Raccomandazione assoluta (senza alternative o condizioni).

## Quick reference

| Fase | Azione | Output |
|------|--------|--------|
| 1. Definisci la domanda | Scrivi criterio, vincoli, done | Domanda + vincoli + done |
| 2. Raccogli fonti | Documentazione ufficiale, context7-mcp, repo, benchmark | Tabella fonti datate |
| 3. Confronta | Matrice per criterio + costi nascosti | Matrice di confronto |
| 4. Valuta il contesto | Fit con progetto, manutentori, migrazione | Analisi contesto |
| 5. Formula raccomandazione | Scelta + alternative + condizioni + rischio | Raccomandazione |
| 6. Salva | `memory` add in mind-memory | Voce persistita |

## Flusso di chiusura

- Se la ricerca porta a implementare: passa a **mind-planning** / **mind-implementation**.
- Se c'è codice coinvolto: chiudi con **mind-verification**.
- Ideazione alternativa: **mind-brainstorming**.

## Fonte documentazione

Per librerie e framework usare sempre **context7-mcp** (resolve-library-id + query-docs) prima di ogni altra fonte.