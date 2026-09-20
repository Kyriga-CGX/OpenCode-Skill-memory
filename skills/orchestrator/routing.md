# Routing

La tabella di routing è la **fonte unica** per instradare un task alla sequenza di skill corretta. Quando sei in dubbio sul tipo di task, usa la route conservativa (vedi Casi particolari).

> **Nota**: la fonte di verità aggiornata è la skill `using-mind` (fork personale). Questa tabella è allineata e mantiene il riferimento storico.

## Tabella di routing

| Tipo di task | Rotta |
|---|---|
| Nuova feature / lavoro creativo | mind-brainstorming → mind-planning → mind-implementation → mind-verification |
| Costruire o modificare UI | frontend-design (direzione, consulta design-references) → design-md (solo se manca DESIGN.md) → design-system (enforce) → motion (solo se tocca animazioni) → gate |
| Animazione / motion / 3D | motion → frontend-design (solo se serve direzione) → gate |
| Prosa / testi / copy | stop-slop |
| Bug | mind-debugging → mind-implementation → gate |
| Bug hunting proattivo / review difensiva | mind-debugging (bug hunting) → mind-testing → gate |
| Sicurezza / breach / threat model / hardening | mind-security → mind-implementation → gate |
| Ricerca tecnica / scelta libreria | mind-research (→ context7-mcp per docs) |
| Performance / ottimizzazione | mind-performance (misura PRIMA) → mind-implementation → gate |
| Dati / database / ETL / analisi | mind-data → (mind-implementation se codice) → gate |
| Test strategy / scrittura test | mind-testing → gate |
| Documentazione | mind-docs → gate |
| Migrazione / upgrade / refactoring esteso | mind-migration → mind-implementation → gate |
| Deploy / CI-CD / container / infrastruttura | mind-devops → gate |
| Domanda libreria / framework | context7-mcp |
| Esecuzione piano | mind-planning → mind-implementation + execution-hygiene |
| Init progetto | ecosystem-health-check → orchestrator → design-md/DESIGN.md (solo se UI) |
| Review codice | mind-implementation (review/fix-loop) / mind-verification |

## Precedenze

1. `orchestrator` / `using-mind` hanno precedenza sulle skill di cluster: sono l'entry point.
2. Dentro la rotta UI, `frontend-design` (direzione) va PRIMA di `design-system` (enforce).
3. `design-md` va PRIMA di `design-system` SOLO se manca `DESIGN.md`.
4. `motion` entra nella rotta SOLO se il task tocca animazioni.
5. `mind-verification` / `execution-hygiene` sono SEMPRE il gate finale, mai prima delle skill di contenuto.
6. `mind-security` va PRIMA di qualsiasi implementazione che tocca dati sensibili, auth, pagamenti o rete.
7. `mind-migration`/`mind-performance`/`mind-data` entrano SOLO se il task tocca quel dominio specifico.

## Regole di orchestrazione (gate e sequenza)

1. Review intermedia obbligatoria tra `mind-planning` → `mind-implementation` (piano vs spec prima del dispatch).
2. Regression check nel gate: modifiche a codice esistente → verificare che il comportamento precedente continui a funzionare.
3. Auto-scrittura in memoria: a fine rotta, salvare pattern/decisioni in `mind-memory` (tool memory add).
4. Controllo conflitti file pre-dispatch: mappare i file toccati dai subagent paralleli; separare le unità che scrivono lo stesso file.
5. Delivery in fasi per feature grandi (fase 1 funzionante → fasi successive).
6. Design debt check post-build (rotta UI): CSS non cancella selettori, DESIGN.md aggiornato.

## Casi particolari

- **Task UI+BE**: segui la rotta sequenziale per il dominio predominante; il gate `execution-hygiene`/`mind-verification` copre l'intero delta.
- **Dubbio sul tipo di task**: usa la route conservativa (creativo → brainstorming; bug → debugging; domanda → context7-mcp); se la rotta si rivela sbagliata, rifalla sul tipo reale.
- **Gate finale**: il gate `mind-verification` si applica a ogni rotta di implementazione — evidenza fresca, nessuna affermazione falsa; `execution-hygiene` fornisce le regole operative lungo la rotta.
- **Task misto sicurezza + feature**: threat model (`mind-security`) PRIMA di brainstorming/planning, poi rotta standard.
- **Performance segnalata come "lento"**: mai ottimizzare a naso; `mind-performance` misura prima (baseline), poi implementa.