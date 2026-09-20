---
name: mind-release
description: >
  Gestisce il rilascio di una versione: semantic versioning, changelog, tag annotato, note di release
  e pubblicazione. Si attiva su richieste tipo "fai una release", "versione 1.2.0", "aggiorna il
  changelog", "tag", "pubblica la nuova versione", o alla fine di un ciclo feature→deploy quando
  serve chiudere una versione. Applica le leggi di ferro: nessun tag/release senza changelog
  aggiornato; il numero di versione rispecchia la natura del cambiamento.
---

# mind-release — Release / Versioning / Changelog

## Scopo

Chiusura di una versione: analisi dei cambiamenti, bump semantico, changelog verificato sul diff,
tag annotato, release notes e (se previsto) pubblicazione. Da usare alla fine di un ciclo
feature→deploy o quando l'utente chiede una release.

## Leggi di ferro

| # | Regola |
|---|--------|
| 1 | NESSUN TAG/RELEASE SENZA CHANGELOG AGGIORNATO |
| 2 | IL NUMERO DI VERSIONE RISPECCHIA LA NATURA DEL CAMBIAMENTO |

Nessuna eccezione. Se una regola non è soddisfatta, la release non si fa.

## Fasi

### 1. ANALISI DEI CAMBIAMENTI

- Raccogli tutto ciò che è entrato dall'ultima release: `git log <ultimo_tag>..HEAD`, PR mergeati.
- Classifica ogni cambiamento e costruisci la tabella:

| Commit/PR | Tipo | Impatto |
|-----------|------|---------|
| <hash/soggetto> | BREAKING / FEATURE / FIX / REFACTOR / CHORE | Descrizione breve per l'utente |

- Tipo mancante → assegnalo dalla natura del cambiamento (mai "altro").

### 2. SEMANTIC VERSIONING

| Incremento | Quando |
|------------|--------|
| MAJOR | Breaking change: API incompatibile, comportamento rimosso, output incompatibile |
| MINOR | Feature retro-compatibile |
| PATCH | Fix retro-compatibile |

- Pre-release: `-alpha`, `-beta`, `-rc` (es. `v1.3.0-beta.1`).
- Progetto senza versioni precedenti: parte da `0.1.0` (instabile/in sviluppo) o `1.0.0` (stabile).
- MAJOR altrimenti implicita se breaking change presente; altrimenti la maggiore vince sulla minore.

### 3. CHANGELOG

- Aggiungi sezione `## [x.y.z] - <data>` **in cima** al file changelog.
- Formato Keep a Changelog se il progetto lo usa: sezioni `Added`, `Changed`, `Fixed`, `Removed`, `Security`.
- Ogni voce referenzia issue/PR quando possibile (`#123`).
- Voci in linguaggio per l'utente finale, non note per sviluppatori.
- Niente placeholder, niente voci a vuoto: ogni riga deve mappare un cambiamento reale.

### 4. VERIFICA

- Confronta le voci del changelog col diff reale: **niente voci inventate, niente cambiamenti omessi**.
- Ogni voce deve essere verificabile in un commit/PR del periodo analizzato.
- Un cambiamento nel diff senza voce → aggiungilo. Una voce senza corrispondenza → rimuovila.

### 5. TAG / RELEASE

- Tag git annotato: `git tag -a vX.Y.Z -m "<sintesi>"`
- Verifica che il tag punti al commit giusto: HEAD della release, non un commit precedente o successivo.
- Push del tag: `git push origin vX.Y.Z` (o `--tags` se configurato).
- Se il repo ha release su GitHub: crea la release con le note derivate dal changelog.

### 6. PUBBLICAZIONE (se il progetto pubblica)

- `npm publish` o equivalente di progetto.
- Prima: versione nel manifest **coerente col tag** (es. `package.json` == `vX.Y.Z`).
- Prima: build pulita e test verdi (gate, vedi Skill correlate).

## Anti-pattern

| Anti-pattern | Conseguenza | Correzione |
|--------------|-------------|------------|
| Versione a caso (es. bump per numero progressivo) | Semver violato, utenti confusi | Parti dall'analisi dei cambiamenti |
| Changelog mancante o inventato | Violazione legge di ferro #1 | Scrivi le voci e verificale sul diff |
| Breaking change in PATCH | Downgrade/break su update automatici | Deve essere MAJOR |
| Tag sul commit sbagliato | Release con contenuto errato | Verifica HEAD prima del tag |
| Release senza verificare il build | Pubblica codice rotto | Gate build+test prima del publish |
| "Ho dimenticato una voce" | Changelog incompleto | La verifica fase 4 è obbligatoria |

## Red flags

- Versione non coerente tra manifest, changelog e tag.
- Voci del changelog non verificabili nel diff.
- Tag o release senza changelog aggiornato.
- Alcuna delle due leggi di ferro violata.

## Comunicazione con l'orchestratore

- L'orchestratore (using-mind) richiama questa skill alla fine di un ciclo feature quando serve una release.
- Coordina con:
  - `mind-devops`: pipeline di build/publish.
  - `mind-verification`: gate obbligatorio (build + test) prima della release.
- Il changelog è scritto da **questa** skill, non da mind-docs.
- Al termine, salva la release in `mind-memory` (tool `memory add`): versione, data, link.

## Quick reference

| Fase | Azione | Evidenza |
|------|--------|----------|
| Analisi | Commit/PR dall'ultimo tag, classifica | Tabella tipi |
| Versioning | Bump semantico (MAJOR/MINOR/PATCH, pre-release) | Numero versione |
| Changelog | Sezione `[x.y.z] - data` in cima | Diff del file |
| Verifica | Voci ↔ diff | Nessuna voce inventata/omessa |
| Tag | `git tag -a vX.Y.Z -m "..."` su HEAD | Tag annotato |
| Release | Note su GitHub (se configurato) | Release URL |
| Publish | Manifest coerente + build pulita, poi publish | Versione pubblicata |

## Skill correlate (via orchestratore)

- `mind-verification` — gate build+test prima della release.
- `mind-devops` — pipeline di build/publish.
- `mind-docs` — documentazione (il changelog resta a questa skill).
- `mind-memory` — salvataggio release (tool `memory add`).
- `using-mind` — orchestratore che richiama questa skill.
- `execution-hygiene` — flusso di esecuzione e gate qualità.
- `context7-mcp` — documentazione aggiornata su tooling (es. semver, npm publish).