---
name: mind-api
description: Skill di progettazione e consumo API (REST/GraphQL). Attivazione: creare/modificare endpoint, definire contratti, versioning, error handling API, OpenAPI/spec, integrazione client, consumo API di terze parti, aggiungere o rimuovere endpoint, errori API.
---

# mind-api — Progettazione e Consumo API (REST/GraphQL)

## Scopo
Progettare e consumare API REST/GraphQL: contratti, versioning, error handling, OpenAPI, integrazione client. Da usare quando: si creano endpoint, si consumano API di terze parti, si definiscono contratti, si aggiungono/rimuovono endpoint, si fa versioning, si gestiscono errori API.

## Legge di ferro
1. **NESSUN ENDPOINT SENZA CONTRATTO DOCUMENTATO.**
2. **L'API È UN CONTRATTO: UNA ROTTURA DEL CONTRATTO È UNA ROTTURA PER I CLIENT.**

## Fasi

### 1. DESIGN CONTRATTO (prima del codice)
Definire PRIMA di scrivere codice:
- Risorsa: nome, collezione o singolo (`/users` vs `/users/{id}`).
- Metodi: GET/POST/PUT/PATCH/DELETE, uno per uso semantico.
- Status code per ogni esito (vedi tabella sotto).
- Formato risposta coerente (envelope unico per tutta l'API).
- Idempotenza: definire quale metodo è idempotente e come.
- Paginazione: cursor/limit su liste.
- Ricerca e filtri: parametri standardizzati.
- Autenticazione: schema auth per ogni endpoint.

### 2. REST rules

| Regola | Comportamento |
|---|---|
| URL | Nomi plurali, risorse non azioni |
| Metodi | Semantici: GET=lettura, POST=creazione, PUT/PATCH=update, DELETE=delete |
| Verbi negli URL | VIETATO (`/deleteUser` ✗ → `DELETE /users/{id}` ✓) |
| Versioning | URI `/v1/...` oppure header dedicato — coerente in tutta l'API |
| Envelope | Struttura risposta coerente in ogni endpoint |
| Errori | Strutturati: `error.code`, `error.message`, `error.details` |

**Status code:**

| Codice | Esito | Uso |
|---|---|---|
| 200 | OK | Lettura/update riusciti |
| 201 | Created | Creazione risorsa (con Location) |
| 204 | No Content | Delete/update senza body |
| 400 | Bad Request | Input malformato |
| 401 | Unauthorized | Auth mancante/invalida |
| 403 | Forbidden | Auth ok, permessi insufficienti |
| 404 | Not Found | Risorsa inesistente |
| 409 | Conflict | Conflitto stato (es. unique constraint) |
| 422 | Unprocessable | Validazione semantica fallita |
| 500 | Internal Server Error | Errore non gestito — mai esporre dettagli interni |

### 3. GRAPHQL
- Schema typed: tutti i tipi dichiarati, niente `any`.
- Resolver per campo, niente logica nel type.
- N+1: risolvere con DataLoader/batching.
- Depth limit e query complexity per evitare abusi.
- Errori strutturati: `errors[]` con `code`, `message`, `path`.
- Mutation idempotenti: definire semantica di retry.
- Subscriptions solo se serve real-time reale.

### 4. OPENAPI
- Scrivere/aggiornare la spec (paths, schemas, responses, security) PRIMA o INSIEME al codice — mai dopo.
- Spec = fonte di verità del contratto.
- Generare client tipati dalla spec se il progetto lo usa.
- Mantenere spec e codice allineati (test di conformità se disponibile).

### 5. CONSUMO API TERZE PARTI
- Auth: verificare tipo (key/token/OAuth) e dove inserirla.
- Rate limit: rispettare header/limiti del provider.
- Paginazione: gestire tutte le pagine.
- Errori: gestire ogni status code documentato.
- Retry con backoff esponenziale su errori transienti (429, 5xx).
- Timeout: sempre definito, mai attesa infinita.
- Validare la risposta contro il contratto atteso (schema/shape).

### 6. TEST API
- Vedi `mind-testing` (integration).
- Verificare: status code, schema risposta, edge case, idempotenza, auth.
- Evidenza: curl o test di integrazione committati.

### 7. VERSIONING / EVOLUZIONE

| Cambiamento | Breaking? | Policy |
|---|---|---|
| Aggiungere campo | No | Safe — rilasciare direttamente |
| Rimuovere campo | Sì | Nuova versione o deprecation con periodo |
| Rinominare campo | Sì | Deprecation con alias temporaneo o nuova versione |
| Cambiare tipo campo | Sì | Nuova versione |
| Cambiare status code/errore | Sì | Nuova versione |
| Cambiare auth | Sì | Nuova versione + piano di migrazione |
| Aggiungere endpoint | No | Safe |
| Cambiare comportamento esistente | Sì | Nuova versione o deprecation |

Deprecation: header `Deprecation`, annuncio, periodo definito, poi rimozione in versione maggiore.

## Anti-pattern

| Anti-pattern | Fix |
|---|---|
| Endpoint senza status code corretti | Definire tutti gli esiti nel contratto |
| Errori generici senza dettagli | `error.code` + `error.message` + `error.details` |
| Breaking change senza versioning | Nuova versione o deprecation (vedi tabella) |
| URL con verbi | Metodo HTTP semantico + risorsa |
| Risposta senza envelope coerente | Envelope unico in tutta l'API |
| Liste grandi senza paginazione | Cursor/limit obbligatorio su liste |
| Secrets nei query param | Headers/body — mai loggare |
| CORS troppo permissivo | Whitelist origini (vedi `mind-security`) |

## Red flags
- "L'API funziona" senza aver testato i codici di errore.
- Contratti non documentati (nessuna spec, nessun esempio).
- Client che non valida la risposta ricevuta.
- Endpoint rotto per un client esistente → regressione di contratto, bloccante.

## Comunicazione con l'orchestratore
- `using-mind` richiama questa skill quando il task tocca API; a fine lavoro passa a `mind-verification` (gate).
- Auth/dati sensibili → coordinare con `mind-security` (threat model PRIMA).
- Documentazione necessaria → coordinare con `mind-docs` (OpenAPI/guide).
- Modifica di API esistente usata da un client → coordinare il cambiamento; per breaking change vedi `mind-migration`.
- Salvare le decisioni di design API in `mind-memory` (tool `memory add`).

## Skill correlate (via orchestratore)
- `mind-verification` (gate a fine lavoro)
- `mind-testing` (test API)
- `mind-security` (auth/dati sensibili)
- `mind-docs` (OpenAPI/guide)
- `mind-migration` (breaking change su API esistenti)
- `mind-memory` (tool `memory add` — decisioni di design)
- `using-mind` (orchestratore)
- `context7-mcp` (documentazione librerie client/server)
- `execution-hygiene` (flusso di esecuzione)

## Quick reference

| Fase | Azione | Evidenza |
|---|---|---|
| Design contratto | Risorse, metodi, status code, envelope, paginazione, auth | Spec/schema concordato |
| REST | URL plurali, metodi semantici, errori strutturati | Spec + esempi curl |
| GraphQL | Schema typed, DataLoader, depth limit, errori strutturati | Schema + query di esempio |
| OpenAPI | Spec aggiornata prima/insieme al codice | File spec + client generato |
| Consumo terze parti | Auth, rate limit, paginazione, retry/backoff, timeout, validazione | Test/evidenza di integrazione |
| Test | Status code, schema, edge case, idempotenza, auth | Test committati o curl |
| Versioning | Tabella change→policy applicata | Entry changelog + versione |