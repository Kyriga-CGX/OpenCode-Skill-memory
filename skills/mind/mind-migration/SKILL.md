---
name: mind-migration
description: Skill per migrazioni di codice, upgrade di versioni, refactoring estesi e cambio tecnologia/architettura. Usala quando un task sposta, sostituisce o tocca molteplici parti del codice (API, runtime, schema, dipendenze, framework). Impone migrazione incrementale con punto di rollback e verifica a ogni step.
---

# Mind Migration

## 1. Scopo

Gestire task di migrazione/upgrade/refactoring di scala. Quando usarla:

- Upgrade di versioni (runtime, framework, dipendenza, linguaggio).
- Cambio API, schema dati o architettura.
- Refactoring che tocca più file/moduli.
- Sostituzione di una tecnologia con un'altra.

Non usarla per: bug puntuali (→ mind-debugging), feature nuove (→ mind-implementation), design di soluzioni (→ mind-brainstorming / mind-planning).

## 2. Legge di ferro

> **NESSUN'OPERAZIONE DI MIGRAZIONE SENZA PUNTO DI ROLLBACK.**

> **MIGRA INCREMENTALE CON VERIFICA A OGNI STEP, NON BIG BANG.**

## 3. Fasi

### 3.1 ANALISI DEL DELTA

Cosa cambia, cosa resta uguale, cosa ne dipende.

| Componente | Cambiamento | Rischio | Test impattato |
|---|---|---|---|
| es. `auth.ts` | nuova API `verify()` | Alto | auth.test.ts |
| | | | |

- Elenca API/runtime/linguaggio/schema/architettura che cambiano.
- Elenca ciò che NON cambia (deve rimanere identico dopo la migrazione).
- Traccia le dipendenze affette e i test che ne dipendono.
- Output: tabella DELTA completa prima di scrivere una riga di codice.

### 3.2 BASELINE

- Build e test passano PRIMA di toccare nulla.
- Snapshot del comportamento: output, API, dati, esempi di runtime.
- Salva la baseline come riferimento per la VERIFICA finale.
- Output: stato verde + snapshot salvato.

### 3.3 STRATEGIA

- Preferita: **incrementale** (strangler / multi-fase). Vietato il big-bang salvo casi impossibili (giustificare).
- Piano a fasi, ognuna con checkpoint: **build + test verdi obbligatori**.
- Ogni fase deve essere piccola, verificabile e rollback-abile.
- Output: piano a fasi (→ mind-planning) con checkpoint espliciti.

### 3.4 ESECUZIONE

- Una fase alla volta.
- Ordine per dipendenza: prima le fondazioni, poi chi le usa.
- Nella stessa fase aggiorna sia il codice nuovo sia ciò che dipende da esso.
- Nessuna fase successiva parte senza checkpoint verde sulla precedente.
- Non lasciare codice morto o "in mezzo" alla fine di una fase.

### 3.5 ROLLBACK

- Definisci il punto di rollback PRIMA di iniziare: commit / branch / tag / backup.
- Definisci la condizione che lo attiva: fase non verde, regressione critica, mismatch rispetto alla baseline.
- Il rollback ripristina l'ultimo punto stabile conosciuto, non "il codice che sembra funzionare".

### 3.6 VERIFICA

- A ogni fase: test + build + diff del comportamento.
- Al termine: confronto con la baseline — stesso output, stessi dati, stesse API.
- Compila l'elenco del codice deprecato rimasto (dead code, shim, compat layer).
- Output: diff baseline vs risultato + lista deprecati.

## 4. Anti-pattern

| Anti-pattern | Perché è letale | Alternativa |
|---|---|---|
| Big-bang | Errore = tutto rotto, rollback enorme | Incrementale / strangler |
| Migrare senza baseline | Non sai se il risultato è giusto | Snapshot prima di toccare |
| Aggiornare la dipendenza senza chi la usa | Codice rotto non verificato | Migra consumatore e dipendenza nella stessa fase |
| Lasciare codice morto in mezzo | Ambiguo, aumenta la superficie di bug | Pulisci a fine fase |
| Rollback non definito | Quando serve non esiste | Definisci punto + condizione PRIMA |
| "Lo sistemo dopo" | Dopo non arriva mai | Include il fix nella fase o crea task dedicato |

## 5. Red flags

- "Dovrebbe essere compatibile" senza verifica concreta.
- Nessun test impattato individuato nel DELTA.
- Più di una fase consecutiva senza checkpoint verde.
- Big-bang pianificato senza giustificazione.
- Rollback non definito o non testato.

## 6. Quick reference

| Fase | Azione | Evidenza |
|---|---|---|
| DELTA | Tabella componenti/rischi/test | DELTA completo |
| BASELINE | Snapshot comportamento | Build+test verdi, snapshot salvato |
| STRATEGIA | Piano a fasi + checkpoint | Piano con checkpoint |
| ESECUZIONE | Una fase, ordine per dipendenza | Checkpoint verde a ogni fase |
| ROLLBACK | Punto + condizione definiti | Referenza salvata |
| VERIFICA | Confronto baseline + pulizia | Diff = baseline, deprecati elencati |

## 7. Regola finale

- Chiudi con **mind-verification**: suite completa + confronto con la baseline (output, API, dati).
- Salva le lezioni della migrazione in **mind-memory** (tool memory): cosa è andato storto, cosa ha funzionato, decisioni di rollback.

## 8. Collaborazione

- Apri con: **mind-brainstorming** (opzioni), **mind-planning** (piano a fasi).
- Esegui con: **mind-implementation** (ogni fase).
- Verifica con: **mind-verification**.
- In caso di regressione durante la migrazione: **mind-debugging**.
- Per documentazione di librerie/framework: **context7-mcp**.
- Al termine: **mind-memory** (tool memory) per le lezioni apprese.