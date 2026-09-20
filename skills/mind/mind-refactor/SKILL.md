---
name: mind-refactor
description: Refactoring di codice esistente senza cambio stack. Attivarsi su "rifattorizza", "pulisci", "riorganizza", "semplifica", "migliora il codice", "elimina duplicazione", "estrae funzione/classe/modulo". NON gestisce upgrade, tecnologie o cambio stack (→ mind-migration).
---

# mind-refactor

## 1. Scopo

Riorganizzare codice esistente per migliorare leggibilità, struttura e manutenibilità **senza cambiare il comportamento esterno osservabile**.

- Il refactor è RISTRUTTURAZIONE, non evoluzione.
- Se il task implica upgrade/tecnologie/cambio stack → NON procedere: richiama `mind-migration`.
- Se il task aggiunge funzionalità → NON è refactor: separa il lavoro in due passi.

### Trigger di attivazione

| Frasi utente | Risposta |
|---|---|
| "rifattorizza", "pulisci", "riorganizza", "semplifica", "migliora il codice" | Attiva questa skill |
| "elimina duplicazione", "estrae funzione/classe/modulo" | Attiva questa skill |
| "aggiorna la versione di", "cambia stack", "migra a", "upgrade" | NON questa skill → `mind-migration` |

## 2. Legge di ferro

1. **NESSUN REFACTOR SENZA TEST CHE PROTEGGONO IL COMPORTAMENTO.**
2. **IL COMPORTAMENTO OSSERVABILE NON CAMBIA MAI.**

Se una delle due è violata, lo step NON è un refactor. Stop e correggi.

## 3. Fasi

### FASE 0 — BASELINE (obbligatoria, non negoziabile)

| Azione | Evidenza richiesta |
|---|---|
| Verifica suite esistente | Test che coprono il comportamento presente PASSANO |
| Se non esistono test | Scriverli PRIMA (vedi `mind-testing`) |
| Snapshot del comportamento | API esposte, output, edge cases documentati |
| Baseline verde | Suite completa verde PRIMA di toccare codice |

> Un refactor senza rete di sicurezza NON inizia.

### FASE 1 — TECNICHE

Ogni tecnica: **prima → dopo → cosa NON cambia**.

| Tecnica | Prima | Dopo | Cosa NON cambia |
|---|---|---|---|
| Extract function | blocco inline in un metodo | funzione separata con nome | input/output, side effects |
| Extract class/module | più responsabilità in un'entità | entità separate per responsabilità | contratto pubblico, interfaccia |
| Rename | nome ambiguo | nome esplicativo | API esterna, firme chiamanti (cerca TUTTI gli usi) |
| Inline | funzione wrapper inutile | chiamata diretta | comportamento e firma |
| Introduce parameter object | parametri multipli correlati | unico oggetto aggregato | ordine/valori degli argomenti |
| Replace conditional with polymorphism | catene if/else su tipo | dispatch polimorfico | risultati per ogni branch |
| Split/merge module | modulo monolitico | moduli coesi | API esposte, import/export |
| Remove dead code | codice non raggiungibile | rimosso | comportamento (nessuno: era morto) |
| Dependency inversion | dipendenza diretta | astrazione interposta | comportamento, requisiti di runtime |

### FASE 2 — SMALL STEPS

| Regola | Dettaglio |
|---|---|
| Un solo refactor alla volta | Mai due trasformazioni nello stesso step |
| Test verdi dopo ogni step | Suite verde prima di passare al successivo |
| Commit per step | Ogni step ha il suo commit atomico |
| MAI mescolare refactor e feature | Funzionalità nuova = passo separato, con i suoi test |

### FASE 3 — VERIFICA COMPORTAMENTO

| Azione | Evidenza |
|---|---|
| Dopo ogni step | Suite completa verde |
| Al termine | Confronto con baseline: stessi output, stesse API, stessi edge cases |
| Diff finale | Mostra SOLO riorganizzazione, nessuna logica nuova |

Se il diff mostra logica nuova o cambiata → NON è refactor. Annulla e riparti dallo step.

### FASE 4 — COPERTURA FINALE

| Azione | Evidenza |
|---|---|
| Suite completa | Verde |
| Lint | Nessun errore |
| Build | Successo |
| e2e/visual se presenti | Eseguiti e verdi (vedi `mind-testing` FASE 5) |

## 4. Anti-pattern

| Anti-pattern | Perché è sbagliato | Cosa fare invece |
|---|---|---|
| Refactor + feature insieme | Un errore in uno inquina l'altro; diff illegibile | Due passi separati con test propri |
| Refactor senza test | Non puoi sapere di non aver rotto nulla | FASE 0: scrivi i test PRIMA |
| Big-bang (tutto in un commit) | Impossibile isolare la regressione | Small steps, un commit per step |
| Rinomina senza cercare usi | Chiamanti rotti silenziosamente | Grep/rename globale su TUTTO il codice |
| Cambiare comportamento "perché tanto sistemo" | Non è più refactor | Ferma: è una feature/bug, cambia rotta |
| Lasciare codice morto | Manutenzione fantasma, confusione | Rimuoverlo nel suo step dedicato |
| Refactor di codice non usato | Lavoro senza valore osservabile | Conferma l'uso reale prima di toccare |

## 5. Red flags

Se osservi una di queste, FERMATI e verifica:

- "ho spostato un po' di roba" → manca la precisione sul cosa è cambiato
- Nessun commit per step → non ripercorribile, non reveritibile
- Test che passavano ma ora non esistono più → rete di sicurezza rimossa: ripristina
- Diff con logica cambiata → comportamento alterato: annulla lo step

## 6. Comunicazione con l'orchestratore (IMPORTANTE)

- Questa skill **NON decide la rotta da sola**.
- `using-mind` (orchestratore) la richiama quando il task è refactor.
- A fine lavoro l'orchestratore:
  1. passa a `mind-verification` (gate di qualità);
  2. salva l'esito in `mind-memory` (tool `memory add`).

### Deviazioni durante il refactor

| Se scopri... | Azione |
|---|---|
| Un bug | FERMA il refactor → richiama `mind-debugging` (root cause PRIMA del fix) |
| Servono upgrade/stack change | FERMA → richiama `mind-migration` |
| Codice usato da API esposte | Coordina con `mind-api` prima di cambiare firme |

### Skill correlate (via orchestratore)

| Skill | Ruolo |
|---|---|
| `mind-testing` | Scrivere la baseline e la copertura (FASE 0 e 4) |
| `mind-verification` | Gate finale dopo il refactor |
| `mind-debugging` | Bug emerso durante il refactor |
| `mind-migration` | Upgrade/tecnologie/cambio stack (FUORI scope qui) |
| `mind-api` | Contratti API esposte toccate dal refactor |
| `mind-memory` (tool `memory add`) | Salvataggio dell'esito |
| `using-mind` | Orchestratore: decide la rotta e coordina |
| `execution-hygiene` | Esecuzione del piano e gate di qualità |
| `context7-mcp` | Documentazione di librerie/framework (per decisioni informate) |

## 7. Quick reference

| Fase | Azione | Evidenza |
|---|---|---|
| 0. Baseline | Test esistenti/da scrivere verdi, snapshot comportamento | Suite verde PRIMA di toccare codice |
| 1. Tecniche | Applica UNA tecnica per volta | Prima→dopo→cosa non cambia |
| 2. Small steps | Un refactor, test verdi, commit | Commit atomico per step |
| 3. Verifica | Confronto con baseline | Stessi output/API/edge cases; diff solo riorganizzazione |
| 4. Copertura | Suite + lint + build (+ e2e/visual) | Tutto verde al termine |