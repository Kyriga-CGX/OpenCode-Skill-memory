# Routing mind

La tabella di routing è la **fonte unica** per instradare un task alla sequenza di skill corretta. Quando sei in dubbio sul tipo di task, usa la route conservativa (vedi Casi limite).

## Tabella di routing completa

| Tipo di task | Rotta (in ordine) |
|---|---|
| Nuova feature / lavoro creativo | `mind-brainstorming` → `mind-planning` → `mind-implementation` → `mind-verification` |
| Feature semplice ben definita | `mind-planning` → `mind-implementation` → `mind-verification` |
| UI (costruire o modificare) | `frontend-design` (direzione) → `design-md` (crea DESIGN.md solo se manca) → `design-system` (enforce) → `motion` (solo se tocca animazioni) → `mind-verification` |
| UI (solo ritocco stile esistente) | `design-system` (enforce) → `mind-verification` |
| Animazione / motion / 3D | `motion` → `frontend-design` (solo se serve direzione) → `mind-verification` |
| Prosa / testi / copy | `stop-slop` |
| Bug / comportamento inatteso | `mind-debugging` → `mind-implementation` (TDD) → `mind-verification` |
| Piano multi-step / spec pronto | `mind-planning` → `mind-implementation` → `mind-verification` |
| Domanda libreria / framework / API | `context7-mcp` |
| Init progetto | `ecosystem-health-check` → `mind` (routing) → `design-md`/`design-system` (solo se UI) |
| Review codice / PR | `mind-implementation` (review + fix-loop) / `mind-verification` |
| Richiamo lavoro precedente | `memory` tool (search) via `mind-memory`, prima di rispondere |
| Salvataggio preferenza/contesto | `memory` tool (add) via `mind-memory` |

## Precedenze

1. `mind` è l'entry point: ha precedenza su tutte le altre skill.
2. Process skill prima, skill di contenuto dopo: `mind-brainstorming`/`mind-debugging` impostano l'approccio, poi le skill di dominio eseguono.
3. `frontend-design` (direzione estetica) va PRIMA di `design-system` (enforce) e di `motion`.
4. `design-md` va PRIMA di `design-system` SOLO se il progetto non ha `DESIGN.md`.
5. `motion` entra nella rotta SOLO se il task tocca animazioni.
6. `mind-verification` ed `execution-hygiene` sono SEMPRE il gate finale, mai prima delle skill di contenuto.
7. Le istruzioni utente (AGENTS.md, richieste dirette) prevalgono sulle skill.

## Casi limite

- **Task UI+BE**: segui la rotta del dominio predominante; il gate finale copre l'intero delta.
- **Dubbio sul tipo di task**: route conservativa (creativo → `mind-brainstorming`; bug → `mind-debugging`; domanda → `context7-mcp`). Se la rotta si rivela sbagliata, rifalla sul tipo reale.
- **Task misto UI + copy**: prima la rotta UI, poi `stop-slop` sui testi; gate unico finale.
- **Fix rapido di un bug già investigato**: la root cause è nota e c'è un test che fallisce → salta `mind-debugging`, vai direttamente a `mind-implementation` (TDD). Se il fix fallisce, torna a `mind-debugging`.
- **Clarificazione prima della rotta**: non fare domande di chiarimento prima di aver scelto la rotta; la skill scelta guida l'esplorazione (es. `mind-brainstorming` fa domande una alla volta).
- **Gate finale**: il gate `mind-verification` (evidenza fresca di verifica, nessuna affermazione senza prova) si applica a ogni rotta di implementazione. `execution-hygiene` fornisce le regole operative (checkpoint, registro, qualità) lungo la rotta.

## Output attesi (catena)

- `mind-brainstorming` → spec approvato in `docs/specs/YYYY-MM-DD-<topic>-design.md`
- `mind-planning` → piano in `docs/plans/YYYY-MM-DD-<topic>.md` con header e task
- `mind-implementation` → codice + test che passano + ledger
- `mind-verification` → evidenza eseguita (output test/lint/build) e conferma