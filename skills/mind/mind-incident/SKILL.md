---
name: mind-incident
description: Risposta operativa a incidenti in produzione e postmortem. Attivazione: "incidente", "produzione giù", "errore in produzione", "tutto down", "ritorno in servizio", "postmortem", "analizza l'incidente di ieri". NON è per la prevenzione (→ mind-security) né per il debugging generico di un bug in sviluppo (→ mind-debugging).
---

# mind-incident — Risposta agli incidenti e postmortem

## Leggi di ferro

| # | Legge |
|---|-------|
| 1 | PRIMA RISTABILISCI IL SERVIZIO, POI ANALIZZI. |
| 2 | NESSUNA MODIFICA IN PRODUZIONE SENZA MITIGAZIONE AGGIORNATA O ROLLBACK DISPONIBILE. |
| 3 | IL POSTMORTEM NON CERCA COLPEVOLI: cerca CAUSE SISTEMICHE e AZIONI. |

## FASE 1 — TRIAGE (primi 5 minuti)

| Azione | Dettaglio |
|--------|-----------|
| Confermare l'incidente | Evidenza reale: log, alert, errori, riproduzione. Niente sensazioni. |
| Determinare severità | Vedi tabella sotto. |
| Identificare gli impattati | Chi: tutti? un sottoinsieme? quali funzioni/path? |
| Aprire il TIMELINE | Registro orario: chi, quando, cosa, evidenza. |

| Severità | Criterio | Risposta |
|----------|----------|----------|
| SEV1 | Servizio giù / tutti gli utenti / dati a rischio | Agire subito, escalation immediata |
| SEV2 | Degrado parziale / funzione rotta per alcuni | Intervento rapido, postmortem |
| SEV3 | Difetto senza impatto immediato | Tracciare, risolvere in seguito |

## FASE 2 — MITIGAZIONE (priorità assoluta)

Opzioni in ORDINE di preferenza:

| # | Opzione | Quando |
|---|---------|--------|
| 1 | Rollback all'ultima versione buona | Sempre disponibile come via di fuga |
| 2 | Feature flag OFF | Modifica recente attivata da flag |
| 3 | Workaround mirato | Solo se colpisce la causa nota, non la nasconde |
| 4 | Fix rapido | SOLO se noto e a basso rischio |

MAI:
- Fix a tentativi.
- Riavvii a caso.
- Modifiche multiple insieme (non si capisce cosa ha funzionato).

Documenta cosa fai e il risultato. Quando il servizio è stabile, NON fermarti: registra.

## FASE 3 — ROOT CAUSE

| Tecnica | Uso |
|---------|-----|
| Riproduzione | Confermare la catena di eventi |
| Log / telemetria | Evidenza temporale e di correlazione |
| Diff buona ↔ cattiva | Confronto versione stabile vs rotto |
| Modifiche recenti | Deploy / config / schema / feature flag |
| Correlazione temporale | Allineare eventi e impatti |

NON fermarti alla mitigazione: senza root cause l'incidente si ripete.
Se la root cause richiede debugging profondo → coordina con mind-debugging.

## FASE 4 — VERIFICA STABILITÀ

| Check | Dettaglio |
|-------|-----------|
| Monitoraggio post-ripristino | Latenza, errori, risorse |
| Conferma mitigazione | Il servizio regge nel tempo |
| Osservazione | Periodo definito e documentato |

## FASE 5 — POSTMORTEM

Per SEV1/SEV2 o comunque utile.

| Sezione | Contenuto |
|---------|-----------|
| Timeline | Chi, quando, cosa, evidenza |
| Cause | Immediata + contribuenti |
| Impatto | Durata, utenti, dati |
| Azioni | Tabella: azione / owner / scadenza / tipo (prevenzione-rilevamento-mitigazione) |
| Cosa ha funzionato | Pratiche che hanno retto |
| LEZIONI | Insegnamenti per il sistema |

Regole:
- SENZA BLAME: mai "chi ha sbagliato", sempre "quale processo/contesto ha permesso".
- File in `docs/incidents/YYYY-MM-DD-<slug>-postmortem.md`.
- A fine giro, se findings rilevanti → domanda all'utente (tool question) se generare anche il vulnerability report (mind-security) quando l'incidente ha natura di sicurezza.

## Anti-pattern

| Anti-pattern | Perché è vietato |
|--------------|------------------|
| Cercare colpevoli | Deforma l'analisi e blocca le azioni |
| Fix a tentativi | Non si capisce cosa ha funzionato |
| Non registrare il timeline | Analisi impossibile dopo |
| Mitigare e dimenticare | Senza root cause l'incidente si ripete |
| Postmortem vago ("ci sono stati problemi di rete") | Non produce azioni |
| Azioni senza owner e scadenza | Non vengono mai fatte |
| Riscrivere la storia | Postmortem che omette errori di valutazione |

## Red flags

- "Abbiamo riavviato e sembra ok" senza root cause.
- Incidente ripetuto.
- Azioni del postmortem mai tracciate.
- Pressione a chiudere in fretta.

## COORDINAMENTO (obbligatorio)

mind-incident NON decide la rotta: è richiamata da using-mind (orchestratore).

| Richiamo | Caso |
|----------|------|
| mind-debugging | Root cause profonda |
| mind-security | Incidente di sicurezza/breach (data breach → section breach + vulnerability report) |
| mind-devops | Deploy / rollback / config / infra |
| mind-docs | Postmortem e documentazione ambienti |
| mind-memory (tool memory add) | Salvare incidente, causa e lezioni |
| mind-verification | Azioni correttive che producono codice |
| mind-release | Fissare versioni buone/conoscenti (tag) |

## Gate

Incidente chiuso SOLO quando:
- Servizio stabile.
- Root cause identificata (o escalation documentata).
- Postmortem scritto per SEV1/2.
- Azioni tracciate con owner + scadenza.