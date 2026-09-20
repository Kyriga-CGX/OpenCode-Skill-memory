---
name: mind-explore
description: Esplorazione e comprensione di codebase sconosciute o poco note. Attivazione: "capisci questo codice", "esplora il progetto", "come funziona X", "dimmi com'è fatta l'app", onboarding su un repo nuovo, analisi di un sistema esistente prima di toccarlo, impatto di un cambio pianificato.
---

# mind-explore — Comprensione di codebase

## Leggi di ferro

| # | Regola |
|---|--------|
| 1 | NESSUNA AFFERMAZIONE SUL CODICE SENZA EVIDENZA LETTA (mai inferire da nomi o indizi) |
| 2 | PARTI SEMPRE DA MANIFEST E CONFIG, non dal primo file che trovi |
| 3 | SE CI SONO TEST, SONO LA VERITÀ SUL COMPORTAMENTO REALE |

## Modalità

| Modalità | Obiettivo | Input chiave | Output |
|----------|-----------|--------------|--------|
| ONBOARDING | Capire un repo nuovo da zero | URL/path repo, eventuale stack dichiarato | Codebase Digest + mappa |
| FEATURE LOCATION | Trovare dove implementare/modificare X | Descrizione feature/cambio, segnali (log, errori, nome) | Posizione esatta dei file toccati |
| REVERSE ENGINEERING | Documentare un sistema esistente non documentato | Path repo, zero doc | Digest con comportamento reale verificato |
| IMPACT ANALYSIS | Valutare cosa rompe un cambio pianificato | Proposta di cambio, file/servizi target | Report punti toccati con rischio ALTO/MEDIO/BASSO |

## FASE 0 — ORIENTAMENTO (sempre)

1. Leggi la radice: README, manifest (package.json / pyproject.toml / Cargo.toml / go.mod / composer.json / *.csproj), tsconfig, .gitignore, docker-compose, Makefile
2. Lista script disponibili (npm scripts, Makefile, task runner)
3. Struttura top-level (solo primo livello + depth massima 3)
4. Produci lista: **cosa sappiamo / cosa non sappiamo**

> NON leggere tutto: usa grep/glob mirati. Ogni lettura deve avere un perché.

## FASE 0.5 — STORIA DEL REPO (se git)

- `git log --oneline -20` per i cambiamenti recenti; `git shortlog -sn` per gli autori attivi
- File più toccati di recente = zone vive (hot spots) → priorità di lettura
- Branch/estratto: cosa è in lavorazione, cosa è abbandonato
- Tag/release: capire le versioni e i momenti di svolta

> Il repo parla: i file modificati spesso sono quelli dove vive la complessità reale.

## Timebox

Esplorazione a tempo (a meno di richiesta diversa): onboarding max ~30-45 min, feature location ~10-20 min. Se il tempo scade senza risposta, riporta lo stato e le ipotesi NON verificate come "domande aperte", non continuare all'infinito.

## Domanda sul goal (se ambiguo)

Se non è chiaro cosa l'utente vuole dall'esplorazione (capire / trovare / documentare / impattare), chiedi UNA domanda (tool `question`) con le 4 modalità come opzioni prima di partire.

## FASE 1 — STACK

- Linguaggi, framework, build tool, runtime, versioni (da manifest + lockfile, non da istinto)
- Punti di ingresso: `main`, entrypoint, `server.listen`, router, worker, cron

## FASE 2 — MAPPA ARCHITETTURALE

- Moduli/layer/directory principali, confini, dipendenze tra moduli
- Pattern riconoscibili: service / repository / controller / component / provider
- **Traccia il flusso di una richiesta/azione tipica** dall'ingresso all'uscita: letture mirate lungo il percorso dati

## FASE 3 — STRATI DI DATO

- Schema reale: migration, model, ORM, DDL
- Dove si legge e dove si scrive (query e write per file/modulo)
- Chiavi e relazioni (PK/FK, indici, vincoli)

## FASE 4 — API E INTEGRAZIONI

- Endpoint/contratti (route, OpenAPI, RPC, command)
- Client esterni (HTTP, SDK, DB esterni, cloud)
- Eventi/queue (pub/sub, broker, cron)
- Auth: meccanismi, dove si valida, chi chiama cosa

## FASE 5 — TEST LANDSCAPE

| Cosa | Dove trovarlo |
|------|---------------|
| Framework test | manifest, config |
| Comando esatto di esecuzione | README, CI, script |
| Cosa è coperto / cosa no | per modulo o dominio |

- Se i test girano veloci: **eseguili**. Riferisci esito.
- Se sono rotti o assenti: red flag + segnalazione all'orchestratore

## FASE 6 — CONFIG E AMBIENTE

- File di config, env, secrets (**MAI esporre valori reali nei report**, usare placeholder)
- Ambienti: dev/staging/prod, feature flag
- Segnala secrets in repo: red flag + mind-security

## OUTPUT — CODEBASE DIGEST

File di sintesi in `docs/` (o README se assente). Usa il template `digest-template.md` in questa cartella:
- Stack e versioni
- Struttura e flussi principali
- Dove vive ogni dominio
- Punti di attenzione (debt, rischi)
- Come si testa (comando esatto)

In modalità IMPACT ANALYSIS: report dei punti toccati dal cambio con rischio per ognuno (ALTO/MEDIO/BASSO).

## Anti-pattern

| Anti-pattern | Cosa fare invece |
|--------------|------------------|
| Leggere tutti i file in ordine alfabetico | grep/glob mirati guidati dal flusso |
| Inferire senza leggere | ogni affermazione con evidenza letta |
| Ignorare i test | i test sono la verità sul comportamento |
| Fermarsi al primo layer | attraversare tutto il flusso dati |
| Esporre secrets nei report | placeholder, niente valori reali |
| Credere alla documentazione senza verifica | la doc è un'ipotesi finché non confrontata col codice |

## Red flags

- Documentazione che contraddice il codice
- Test rotti o assenti
- Monoliti non separati / accoppiamenti nascosti
- Secrets in repo
- Dipendenze obsolete o vulnerabili

## COORDINAMENTO (obbligatorio)

mind-explore NON decide la rotta: è richiamata da using-mind (orchestratore). Richiami:

| Richiamo | Quando |
|----------|--------|
| → context7-mcp | serve documentazione ufficiale di stack/framework |
| → mind-docs | il digest va scritto come documentazione |
| → mind-memory (tool memory add) | salvare mappa del progetto e scoperte chiave |
| → mind-testing | serve capire/scrivere test |
| → mind-security | durante l'esplorazione emergono vulnerabilità |
| → mind-verification | gate se l'esplorazione produce modifiche |

- Se scopri bug o debt durante l'esplorazione → **segnalalo all'orchestratore** (mind-debugging / mind-refactor) invece di fixare in autonomia.

## PROATTIVITÀ

Durante l'esplorazione, se noti opportunità/rischi (debt, mancanza test, configurazioni strane) riportali all'utente con proposte concrete, **senza agire fuori scope**.

## Gate

Se la rotta esplorativa doveva portare a modifiche, il lavoro non è completo senza mind-verification.