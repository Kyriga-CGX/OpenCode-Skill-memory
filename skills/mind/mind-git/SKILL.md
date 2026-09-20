---
name: mind-git
description: Workflow git professionale: branching, commit atomici, conventional commits, worktree per isolare i subagent paralleli, PR/merge, risoluzione conflitti, storia pulita. Attivarla quando un task tocca git (commit, branch, merge, rebase, revert, worktree, preparazione PR) o quando mind-implementation dispaccia subagent in parallelo che scrivono su branch separati. NON usarla per decidere COSA implementare: solo COME gestire il versionamento.
---

# mind-git — Workflow git

Gestisce il versionamento in modo disciplinato, coerente con il principio "più subagent in parallelo" di mind: ogni unità indipendente lavora su un **worktree/branch isolato**, e l'integrazione avviene solo dopo verifica.

## Leggi di ferro

| # | Regola |
|---|--------|
| 1 | **Commit atomici**: un commit = un cambiamento logico coerente; mai mescolare feature diverse nello stesso commit. |
| 2 | **MAI force-push su branch condivisi** (main/develop). `--force-with-lease` solo su branch personali/feature. |
| 3 | **Nessun commit di segreti**: prima del commit controlla che non ci siano chiavi/token/password (coordina con mind-security). |
| 4 | **Messaggio chiari**: conventional commits, il "perché" nel body quando serve. |
| 5 | **Worktree per parallelismo**: subagent indipendenti su worktree separati, mai sullo stesso checkout. |

## Convenzione commit (Conventional Commits)

```
<tipo>(<scope opzionale>): <descrizione imperativa, max ~72 char>

<body opzionale: il perché, non il cosa>
```

| Tipo | Uso |
|------|-----|
| `feat` | nuova funzionalità |
| `fix` | correzione bug |
| `refactor` | ristrutturazione senza cambio comportamento |
| `test` | aggiunta/modifica test |
| `docs` | documentazione |
| `chore` | manutenzione, dipendenze, build |
| `perf` | ottimizzazione performance |
| `style` | formattazione (senza cambio logica) |
| `ci` | configurazione CI/CD |
| `revert` | annullamento |

## FASE 1 — Stato e punto di partenza

- `git status --porcelain` e `git branch --show-current` PRIMA di toccare qualunque cosa.
- Registra `BASE = git rev-parse HEAD` prima di un lavoro multi-commit (punto di rollback).
- Non lavorare con modifiche non committate preesistenti: chiedi all'utente o mettile in stash.

## FASE 2 — Branching

| Scenario | Branch |
|----------|--------|
| Nuova feature | `feature/<slug>` |
| Bugfix | `fix/<slug>` |
| Hotfix su prod | `hotfix/<slug>` |
| Refactoring | `refactor/<slug>` |

- Branch corti e focalizzati (una unità di lavoro per branch).
- Slice il lavoro in commit piccoli e frequenti (checkpoint): ogni step verde = commit.

## FASE 3 — Worktree per subagent paralleli (integrazione con mind-implementation)

Quando mind-implementation dispaccia N subagent su unità indipendenti:

```bash
git worktree add ../<repo>-<unit> -b <branch-per-unit>
```

- **Un worktree per unità**: i subagent non si pestano i file a vicenda.
- Ogni subagent committa sul proprio branch; l'integrazione (merge) avviene **dopo** la verifica di ciascuna unità.
- A fine lavoro: `git worktree remove` e pulizia dei branch morti.

> Se le unità NON sono indipendenti (stesso file), NON usare worktree paralleli: serializza. Vedi regola "conflitti file pre-dispatch" di mind-implementation.

## FASE 4 — Integrazione

1. Prima del merge: `git fetch`, rebase/merge dal branch base.
2. Risolvi conflitti **chiedendo conferma** quando il cambio non è ovvio.
3. Preferisci **rebase** per storia lineare su branch feature personali; **merge** per branch condivisi.
4. Verifica (build+test) sul risultato dell'integrazione, non solo sul branch.

## FASE 5 — Igiene finale

- `git status` pulito alla fine.
- Branch feature merged/eliminati (`git branch -d`, `git worktree prune`).
- Nessun file temporaneo o artefatto committato (`.gitignore` aggiornato).

## Anti-pattern

| Anti-pattern | Cosa fare invece |
|--------------|------------------|
| Un mega-commit con tutto | commit atomici per step logico |
| Force-push su branch condiviso | mai; rebase solo su branch personali |
| Committare segreti o `.env` | controlla diff prima di `git add`; coordina mind-security |
| Tutti i subagent sullo stesso checkout | worktree separati per unità indipendenti |
| Messaggi vaghi ("fix", "update") | conventional commits descrittivi |

## Red flags

- Modifiche non committate preesistenti → fermati e chiedi.
- Conflitti complessi → non risolvere a tentativi, chiedi conferma sul cambio non ovvio.
- `.env`/chiavi nel diff → blocca e segnala (mind-security).

## COORDINAMENTO (obbligatorio)

mind-git è richiamata da using-mind e da mind-implementation (per il parallelismo):

| Richiamo | Quando |
|----------|--------|
| → mind-implementation | i worktree/branch servono a isolare i subagent paralleli |
| → mind-security | segreti nel diff o repo esposto |
| → mind-release | la release usa tag/changelog (mind-release), mind-git gestisce i commit |
| → mind-verification | gate: build+test sul risultato dell'integrazione |

## Gate

Commit atomici con messaggio chiaro, nessun segreto committato, branch/worktree ripuliti, integrazione verificata.
