# Routing

La tabella di routing è la **fonte unica** per instradare un task alla sequenza di skill corretta. Quando sei in dubbio sul tipo di task, usa la route conservativa (vedi Casi particolari).

> **Nota**: la fonte di verità aggiornata è la skill `using-mind` (fork personale). Questa tabella è allineata e mantiene il riferimento storico.

## Tabella di routing

| Tipo di task | Rotta |
|---|---|
| Nuova feature / lavoro creativo | mind-brainstorming → mind-planning → mind-implementation → mind-verification |
| Costruire o modificare UI | frontend-design (direzione) → design-md (solo se manca DESIGN.md) → design-system (enforce) → motion (solo se tocca animazioni) → gate |
| Animazione / motion / 3D | motion → frontend-design (solo se serve direzione) → gate |
| Prosa / testi / copy | stop-slop |
| Bug | mind-debugging → mind-implementation → gate |
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

## Casi particolari

- **Task UI+BE**: segui la rotta sequenziale per il dominio predominante; il gate `execution-hygiene`/`mind-verification` copre l'intero delta.
- **Dubbio sul tipo di task**: usa la route conservativa (creativo → brainstorming; bug → debugging; domanda → context7-mcp); se la rotta si rivela sbagliata, rifalla sul tipo reale.
- **Gate finale**: il gate `mind-verification` si applica a ogni rotta di implementazione — evidenza fresca, nessuna affermazione falsa; `execution-hygiene` fornisce le regole operative lungo la rotta.