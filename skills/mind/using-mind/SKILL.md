---
name: using-mind
description: Entry point globale e orchestratore del sistema di skill. Attivala per QUALSIASI task: nuova feature, lavoro creativo, UI, motion/3D, prosa/copy, bug, domande su librerie, piani, init progetto, review. Non produce contenuto: decide la rotta, instrada alla skill giusta e ne coordina la comunicazione.
---

# Mind — orchestratore

Mind è l'**entry point globale**. Non è una skill di contenuto: **coordina le skill, decide la rotta, instrada e fa comunicare le skill tra loro**. Non implementa direttamente: ogni task è delegato alla skill giusta.

## Regola di avvio

Prima di rispondere o agire, identifica il tipo di task e scegli la rotta dalla tabella sotto. Se in dubbio, usa la route conservativa. Poi invoca la skill con il tool `skill` e annuncia: `Uso <skill> per <scopo>`.

## Tabella di routing (tutte le skill)

| Tipo di task | Rotta (in ordine) |
|---|---|
| Nuova feature / lavoro creativo | `mind-brainstorming` → `mind-planning` → `mind-implementation` → `mind-verification` |
| UI (costruire o modificare) | `frontend-design` (direzione) → `design-md` (crea DESIGN.md solo se manca) → `design-system` (enforce) → `motion` (solo se tocca animazioni) → `mind-verification` |
| Animazione / motion / 3D | `motion` → `frontend-design` (solo se serve direzione) → `mind-verification` |
| Prosa / testi / copy | `stop-slop` |
| Bug / comportamento inatteso | `mind-debugging` → `mind-implementation` (TDD) → `mind-verification` |
| Piano multi-step | `mind-planning` → `mind-implementation` → `mind-verification` |
| Domanda libreria / framework / API | `context7-mcp` |
| Init progetto | `ecosystem-health-check` → `mind` (routing) → `design-md`/`design-system` (solo se UI) |
| Review codice | `mind-implementation` (review + fix-loop) / `mind-verification` |
| Richiamo lavoro precedente | `memory` tool (search) via `mind-memory`, prima di rispondere |

## Precedenze

1. **`mind` ha precedenza su tutto**: è l'entry point, non le altre skill.
2. Process skill prima, skill di contenuto dopo: brainstorming/debugging impostano l'approccio, poi le skill di dominio eseguono.
3. `frontend-design` (direzione estetica) va PRIMA di `design-system` (enforce) e di `motion`.
4. `design-md` va PRIMA di `design-system` SOLO se il progetto non ha `DESIGN.md`.
5. `motion` entra SOLO se il task tocca animazioni.
6. `mind-verification` ed `execution-hygiene` sono SEMPRE il gate finale, mai prima delle skill di contenuto.
7. Le istruzioni utente (AGENTS.md, richieste dirette) prevalgono sulle skill.

## Comunicazione tra skill

Mind fa comunicare le skill passando il **risultato** di una all'input della successiva:

- **brainstorming → planning**: lo spec approvato (docs/specs/YYYY-MM-DD-<topic>-design.md) è l'input del piano
- **planning → implementation**: il piano (header + task) è l'input del dispatch subagent
- **debugging → implementation**: la root cause identificata + il test che fallisce sono l'input del fix
- **design-system → frontend-design**: `design-system` delega la direzione estetica a `frontend-design` (inverse: `frontend-design` non enforce, delega a `design-system`)
- **motion → frontend-design**: `motion` delega la direzione estetica a `frontend-design`
- **frontend-design / design-system / motion → memory**: prima di progettare, cerca nelle memorie le preferenze utente e il contesto del progetto (tool `memory` search)
- **memory → qualsiasi skill di contenuto**: se il messaggio richiama lavoro precedente, recupera il contesto PRIMA di rispondere
- **ogni rotta di implementazione → mind-verification**: nessun lavoro è completo senza evidenza di verifica

## Principi di esecuzione

- **Più subagent in parallelo**: per implementare, dispatch N subagent (uno per unità indipendente), mai un singolo subagent per tutto.
- **Snello**: niente prosa, stati concisi, checklist, output verificabili.
- **Lingua**: rispondi nella lingua dell'utente.
- **Gate**: ogni rotta che produce modifiche termina con `mind-verification` (o `execution-hygiene`).

## Subagent in parallelo

Quando un task ha più unità di lavoro indipendenti:

1. Scomponi in unità con confini chiari (file/moduli/comportamenti separati).
2. Dispatch **un subagent per unità** in parallelo (batch di tool `task`).
3. Ogni subagent: input preciso, output richiesto, criterio di done.
4. Merge dei risultati e verifica integrata (`mind-verification`).

## Casi particolari

- **Task UI+BE**: segui la rotta del dominio predominante; il gate finale copre l'intero delta.
- **Dubbio sul tipo**: route conservativa (creativo → brainstorming; bug → debugging; domanda → context7-mcp). Se la rotta si rivela sbagliata, rifalla sul tipo reale.
- **Skill in dubbio**: se due skill sembrano applicabili, scegli quella che si avvicina di più al gate (verifica) e richiama l'altra se necessario.

Vedi `routing.md` per i dettagli completi e i casi limite.