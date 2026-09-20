---
name: mind-architecture
description: Decisioni architetturali e registrazione in Architecture Decision Records (ADR). Attivazione: scelte di design con impatto sistemico (non banali), cambio di struttura/pattern/tecnologia di livello architetturale, "decidi come strutturare", "come organizziamo questo modulo", domande di architettura che richiedono motivazione scritta e duratura.
---

# mind-architecture — Decisioni architetturali e ADR

**Scopo:** rendere le decisioni architetturali **ESPLICITE**, **MOTIVATE** e **DURATURE** nel tempo.

**Distinzione:** mind-brainstorming progetta la feature/spec; mind-architecture registra la **DECISIONE ARCHITETTURALE** (scelta di pattern/struttura/tecnologia di impatto) e i suoi perché. Se la decisione è banale o reversibile senza costo → **NON serve ADR**, si va avanti direttamente.

## Leggi di ferro

1. OGNI DECISIONE ARCHITETTURALE RILEVANTE HA UN ADR.
2. UN ADR SENZA CONTESTO E CONSEGUENZE NON È UN ADR.
3. UN ADR NON SI RISCRIVE MAI: si supera con un ADR NUOVO (superseded).

## Quando serve ADR

| Criterio | Serve ADR | Esempio |
|---|---|---|
| Impatto su più moduli | ✅ | cambiare il formato dati condiviso |
| Irreversibilità / alto costo di inversione | ✅ | adottare un framework, dividere il monorepo |
| Vincolo su team/roadmap | ✅ | decisione che blocca o obbliga altre parti |
| Scelta tra alternative non equivalenti | ✅ | DB relazionale vs NoSQL |
| Cambio di pattern già usato | ✅ | passare da callback a event-driven |
| Scelta locale/meccanica | ❌ | nome di una variabile, formattazione |
| Dettaglio implementativo | ❌ | libreria di util interna |
| Decisione reversibile in minuti | ❌ | toggle di configurazione |

## FASI

1. **Identifica la decisione** — quale domanda stiamo decidendo.
2. **Raccogli il contesto** — vincoli reali, requisiti, cosa già esiste, memoria del progetto.
3. **Enumera le opzioni** — 2–4 alternative REALI con trade-off.
4. **Valuta** — tabella criteri × opzioni, con pesi.
5. **Decidi + motiva** — scelta esplicita e perché.
6. **Elenca le conseguenze** — positive e negative note.
7. **Registra l'ADR** — file + indice + status Accepted.

## FORMATO ADR

Titolo: **`ADR-<NNN>: <titolo breve decisione>`**

- **Status:** Proposed / Accepted / Superseded / Deprecated
- **Data:** `AAAA-MM-GG`
- **Contesto:** vincoli e situazione, NON la soluzione
- **Decisione:** scelta + perché, chiara e sintetica
- **Conseguenze:** positive; negative/trade-off
- **Opzioni considerate:** elenco + perché scartate
- **Riferimenti:** ADR correlati, doc, link

`NNN` = numero progressivo.

## Posizione

- `docs/adr/ADR-<NNN>-<slug>.md`
- Se il progetto non ha `docs/adr/`, creala.
- Indice `docs/adr/README.md` con elenco ADR e status.

## TABELLA anti-pattern

| Anti-pattern | Comportamento vietato |
|---|---|
| Giustificazione a posteriori | ADR scritto dopo l'implementazione solo per "coprirsi" |
| ADR vago | "abbiamo deciso X" senza contesto né conseguenze |
| Riscrittura | riaprire e riscrivere un ADR Accepted |
| Micro-ADR | registrare ogni micro-decisione |
| Decisione senza alternative | scegliere senza elencare alternative reali |
| Conseguenze ignorate | tacere le conseguenze negative |

## Red flags

- Decisione "ovvia" senza alternative considerate.
- Pressione a saltare la registrazione.
- ADR che descrive la soluzione ma non il contesto.
- Più ADR che si contraddicono senza supersede.

## COORDINAMENTO (obbligatorio)

mind-architecture **NON decide la rotta**: è richiamata da using-mind (orchestratore).

- **Entra:** DOPO mind-brainstorming (spec) e PRIMA di mind-planning (il piano assume la decisione registrata).
- → **mind-memory** (tool `memory add`): salva la decisione e il suo ADR id.
- → **mind-docs**: consolidamento della documentazione.
- Se impatta **API** → mind-api.
- Se impatta **sicurezza/auth** → mind-security.
- Se impatta **migrazione/upgrade** → mind-migration.
- **Gate finale:** rimane mind-verification.

## Gate

La registrazione ADR è completa **solo quando**:
- Status = **Accepted**
- Il file è scritto con **contesto + decisione + conseguenze**.