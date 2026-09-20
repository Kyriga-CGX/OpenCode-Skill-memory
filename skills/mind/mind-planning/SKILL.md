---
name: mind-planning
description: Da usare quando hai spec o requisiti per un task multi-step, PRIMA di toccare il codice. Converte lo spec approvato in un piano di implementazione eseguibile con task granularli, senza placeholder.
---

# Pianificazione mind

Converte lo spec in un piano eseguibile. Il piano è il contratto che `mind-implementation` eseguirà.

## Annuncio

Prima di qualsiasi lavoro: "Uso mind-planning per scrivere il piano di implementazione."

## Scope check

- Lo spec copre più sottosistemi indipendenti? → piani separati (uno per sottosistema)
- Un piano per singolo task di lavoro; se il lavoro è grande, spezza in più piani

## Struttura del piano

1. **File structure PRIMA dei task**: elenca i file che creerai/modificherai. Questo rivela conflitti e dipendenze prima che diventino problemi
2. **Task right-sizing**: ogni task = un'unità con il proprio ciclo di test (test fallisce → run → implementa → test passa). Fai fold di setup/config/doc nel task che ne ha bisogno. Splitta solo dove un reviewer potrebbe rifiutare (task troppo grandi) o dove i file si separano naturalmente
3. **Granularità bite-sized**: ogni step 2-5 minuti: failing test → run fail → implementa → run pass → commit

## Header del piano (obbligatorio)

```markdown
# Piano: <nome>

Goal:
Architecture:
Tech Stack:
Global Constraints:

For agentic workers: use mind-implementation (multi-subagent parallelo)
```

## Struttura task

```markdown
## Task N: <nome>

### Files
- Create: <path esatto>
- Modify: <path esatto>
- Test: <path esatto>

### Interfaces
- Consumes: <firma esatta>
- Produces: <firma esatta>

### Steps
- [ ] Scrivi test che fallisce: <comando/codice>
- [ ] Esegui e verifica il fallimento: <comando>
- [ ] Implementa: <codice>
- [ ] Esegui e verifica il passaggio: <comando>
- [ ] Commit
```

## Regole: NO placeholder

Vietato:
- `TBD`, `TODO`, sezioni vuote
- "add validation" / "write tests" senza codice o dettagli concreti
- "similar to task N" senza ripetere l'informazione necessaria
- Tipi o firme non definiti

Ogni task deve essere eseguibile da un subagent senza chiedere chiarimenti.

## Self-review del piano (a occhi freschi)

1. **Spec coverage**: ogni requisito dello spec è coperto da almeno un task?
2. **Placeholder scan**: cerca TBD/TODO/istruzioni vaghe → fix inline
3. **Type consistency**: le firme (interfaces Consumes/Produces) sono coerenti tra i task?
4. **Task order**: le dipendenze tra task sono corrette? Ogni task può passare solo con i suoi prerequisiti?

## Handoff

Dopo la self-review, presenta il piano all'utente e offri l'esecuzione con `mind-implementation` (multi-subagent in parallelo).