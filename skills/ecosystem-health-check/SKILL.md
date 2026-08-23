---
name: ecosystem-health-check
description: Verifica la salute dell'ecosistema opencode (versione plugin Superpowers, integrità skill installate, configurazione Context7 MCP, freschezza del backup) e guida gli aggiornamenti automatici. Da eseguire all'init di ogni nuovo progetto.
---

# ecosystem-health-check

Esegue il controllo dello stato dell'ecosistema e lo riporta all'utente, applicando gli aggiornamenti necessari.

## Esecuzione

1. Esegui lo script di verifica:
   `powershell -ExecutionPolicy Bypass -File F:\OpenCode Project\Container Idee\skills\ecosystem-health-check\scripts\health-check.ps1`
2. Leggi `health-report.json` (nella directory di lavoro corrente).
3. Per ogni sezione con status negativo, applica l'update automatico senza chiedere conferma (vedi sotto).
4. Riporta all'utente (in italiano): stato iniziale, azioni eseguite, stato finale.

> **Nota sulla sezione backup:** la verifica del backup è significativa quando lo script viene eseguito
> dalla root del repo `F:\OpenCode Project\Container Idee` (la directory in cui `create-backup.ps1`
> scrive gli zip `opencode-backup-*.zip`). Da un'altra directory il check riporterà `no-backup`:
> in tal caso non è un problema di configurazione ma solo di directory di esecuzione.

## Azioni di update per sezione

| Sezione | Status | Azione |
|---|---|---|
| superpowers | outdated | Aggiorna il ref del plugin in `C:\Users\Kyrig\.config\opencode\opencode.jsonc` alla versione riportata nel report (`latest`). Il plugin è installato da uno spec git: cambia SOLO il frammento del ref mantenendo la forma `superpowers@git+https://github.com/obra/superpowers.git#<ref>` (es. `...git#6.2.1`). NON sostituire mai la sorgente `git+https://...` con uno spec npm-style come `superpowers@6.2.0`: cambierebbe la sorgente di installazione e romperebbe il path di cache hardcoded `superpowers@git+https_...` usato dallo script e dal backup |
| skills | missing | Reinstalla le skill mancanti: per le 14 superpowers riesegui il plugin (bump di versione in opencode.jsonc e verifica che il plugin venga riscaricato); per `context7-mcp` e `ecosystem-health-check` copia la cartella nel path `C:\Users\Kyrig\.agents\skills\` |
| context7 | misconfigured | Correggi la sezione `mcp.context7` in `C:\Users\Kyrig\.config\opencode\opencode.jsonc` (url `https://mcp.context7.com/mcp`, `enabled: true`) |
| backup | stale / no-backup | Riesegui `create-backup.ps1` (nella root del repo `Container Idee`) per rigenerare lo zip |

## Regole

- Non chiedere conferma per gli update: eseguili e riporta il risultato.
- Non modificare mai file di progetto dell'utente durante l'update; agisci solo su configurazione globale e path delle skill.
- Se `health-report.json` non viene prodotto, segnala l'errore e fermati.
