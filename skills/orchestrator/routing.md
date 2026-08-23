# Routing

La tabella di routing è la **fonte unica** per instradare un task alla sequenza di skill corretta. Quando sei in dubbio sul tipo di task, usa la route conservativa (vedi Casi particolari).

## Tabella di routing

| Tipo di task | Rotta |
|---|---|
| Nuova feature / lavoro creativo | brainstorming → spec → writing-plans → subagent-driven-development/executing-plans |
| Costruire o modificare UI | frontend-design (direzione) → design-md (solo se manca DESIGN.md) → design-system (enforce) → motion (solo se tocca animazioni) → gate |
| Animazione / motion / 3D | motion → frontend-design (solo se serve direzione) → gate |
| Prosa / testi / copy | stop-slop |
| Bug | systematic-debugging → test-driven-development → gate |
| Domanda libreria / framework | context7-mcp |
| Esecuzione piano | executing-plans / subagent-driven-development + execution-hygiene |
| Init progetto | ecosystem-health-check → orchestrator → design-md/DESIGN.md (solo se UI) |
| Review codice | requesting-code-review / receiving-code-review |

## Precedenze

1. `orchestrator` ha precedenza su `using-superpowers` e sulle skill di cluster: è l'entry point.
2. Dentro la rotta UI, `frontend-design` (direzione) va PRIMA di `design-system` (enforce).
3. `design-md` va PRIMA di `design-system` SOLO se manca `DESIGN.md`.
4. `motion` entra nella rotta SOLO se il task tocca animazioni.
5. `execution-hygiene` è SEMPRE il gate finale, mai prima delle skill di contenuto.

## Casi particolari

- **Task UI+BE**: segui la rotta sequenziale per il dominio predominante; il gate `execution-hygiene` copre l'intero delta.
- **Dubbio sul tipo di task**: usa la route conservativa (creativo → brainstorming; bug → systematic-debugging; domanda → context7-mcp); se la rotta si rivela sbagliata, rifalla sul tipo reale.
- **Gate finale**: il gate `execution-hygiene` si applica a ogni rotta di implementazione — 6 regole + lint/typecheck/test se disponibili + delta a occhi freschi + nessuna affermazione falsa.