---
name: mind-testing
description: Strategia e scrittura di test (unit, integration, e2e), copertura e TDD quando richiesto. Da usare per ogni task che produce o modifica codice e richiede test.
---

# mind-testing — Test Strategy & Test Writing

## 1. Scopo

Definire cosa, a che livello e come testare il codice prodotto o modificato. Gestisce strategia, test design, TDD, isolamento e verifica. Integrata con mind-verification (gate di esecuzione suite) e mind-memory (pattern riutilizzabili).

**Quando usarla:** ogni task che produce o modifica codice e richiede test (feature, fix, refactor). NON usarla per task di pura configurazione o documentazione.

## 2. Leggi di ferro

1. **"UN TEST CHE NON FALLISCE MAI E NON PUÒ FALLIRE NON È UN TEST."** Se non puoi vederlo fallire, è codice morto.
2. **"PRIMA IL TEST ROSSO, POI IL CODICE."** Il test verde senza essere mai stato rosso non prova nulla.

## 3. Fasi

### FASE 1 — STRATEGIA

Cosa testare:
- Core logic (calcoli, trasformazioni, regole di dominio)
- Edge cases (vuoto, null, limite, errore, duplicati, concorrenza)
- Regressioni note (bug già fixati: aggiungi test di regressione)
- Contratti (interfacce, API, formati I/O)

A che livello:

| Livello | Cosa testare | Costo | Quando |
|---|---|---|---|
| Unit | Logica pura, funzioni, classi, regole di dominio | Basso | Sempre per la core logic |
| Integration | Confini: DB, API, filesystem, servizi esterni | Medio | A ogni confine con side-effect |
| E2E | Flussi critici utente end-to-end | Alto | Solo flussi business critici |

Cosa NON testare:
- Dettagli di implementazione (refactor-safe: testa comportamento, non internals)
- Librerie esterne (testa la tua integrazione, non la libreria)
- UI puramente decorativa senza logica

### FASE 2 — TEST DESIGN

- **Nome test = comportamento, non implementazione.** Formato: `should <comportamento> when <condizione>` (es. `should_reject_duplicate_email_when_user_exists`).
- **Una asserzione concettuale per test** (una cosa sola verificata).
- **Arrangiamento chiaro:** `Arrange` → `Act` → `Assert` nettamente separati, anche con commenti se serve.
- **Casi edge obbligatori da considerare:** vuoto, null/undefined, limite (min/max), errore/eccezione, duplicati, concorrenza/ordine.

### FASE 3 — TDD (SOLO se richiesto dal task)

| Step | Azione | Verifica |
|---|---|---|
| 1 | Scrivi il test ROSSO per il comportamento richiesto | Il test fallisce |
| 2 | Verifica che fallisca PER IL MOTIVO GIUSTO (non per errore di setup) | Il messaggio di errore descrive il comportamento mancante |
| 3 | Implementa il MINIMO per far passare il test | — |
| 4 | Test VERDE | Il test passa |
| 5 | Refactor mantenendo verde | Suite intera ancora verde |

Ogni step è verificato prima di procedere al successivo. Se il test fallisce per un motivo sbagliato → correggi il test, non il codice.

### FASE 4 — ISOLAMENTO

- Usa **mock/stub/fake SOLO ai confini**: I/O, rete, tempo, random, DB, servizi esterni.
- **MAI mockare ciò che stai testando** (il subject under test deve essere reale).
- **Preferisci iniettare dipendenze reali e leggere** (fake in-memory, dipendenze astratte) a mock pesanti.
- Mock necessari solo quando la dipendenza è lenta, non deterministica o non disponibile.

### FASE 5 — VERIFICA

- Esegui **TUTTA la suite**, non solo il test nuovo.
- Verifica che un test modificato continui a testare la **stessa cosa** di prima.
- Verifica la **copertura delle branch critiche** (if/else, switch, early return).
- Evidenza: output test, exit code, coverage.

## 4. Anti-pattern (da evitare)

| Anti-pattern | Segnale | Fix |
|---|---|---|
| Test che non asseriscono | Nessun `assert`/`expect` reale | Asserzione concettuale esplicita |
| Test dipendenti dall'ordine | Passano solo se eseguiti in sequenza | Setup/teardown indipendenti per test |
| Test fragili | Falliscono per timing, locale, rete, ora | Inietta tempo, fissa locale, stub I/O |
| Test duplicati | Stesso comportamento coperto altrove | Rimuovi il ridondante, mantieni il più esplicito |
| Snapshot giganti | Diff immensi e illeggibili | Riduci o sostituisci con asserzioni puntuali |
| Mock eccessivi | Ogni dipendenza è un mock, anche quella reale | Inietta dipendenze reali/leggere |

## 5. Red flags

- **"I test passano quindi funziona"** senza aver mai visto fallire quel test.
- **Copertura dichiarata senza misura** (nessun report/strumento a supporto).
- **Test che ignorano il comportamento utente** (coprono internals, non ciò che l'utente osserva).

## 6. Quick reference

| Fase | Azione | Evidenza |
|---|---|---|
| Strategia | Definire cosa/come/quanto testare | Lista livelli e casi |
| Design | Scrivere test con nome comportamentale | Test scritti |
| TDD | Test rosso → minimo → verde → refactor | Output rosso e verde |
| Isolamento | Confini mocked, core reale | Setup test |
| Verifica | Suite intera + coverage | Exit code 0, report coverage |

## 7. Regola finale

- **Integrarsi con mind-verification:** il gate esegue la suite completa; la verifica di passaggio include exit code e copertura.
- **Salvare i pattern di testing** (esempi di isolamento, soluzioni a test fragili) in **mind-memory** (tool `memory`).
- Se un test risulta impossibile da scrivere o fragile in modo sistematico, segnalare il problema a mind-debugging prima di procedere.

## 8. Riferimenti skill

- mind-implementation — produzione del codice da testare
- mind-verification — gate che esegue la suite
- mind-debugging — fallimenti di test non ovvi
- mind-memory (tool `memory`) — salvataggio dei pattern di testing