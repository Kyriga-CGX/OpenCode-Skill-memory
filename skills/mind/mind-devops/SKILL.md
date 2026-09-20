---
name: mind-devops
description: >
  Skill DevOps per build, test automatici, deploy, CI/CD, container, infrastruttura,
  environment e monitoraggio. Da attivare quando un task tocca pipeline, Docker,
  cloud, server, env o config di deploy. Lege di ferro: nessun deploy senza
  pipeline riproducibile e verifica post-deploy; mai toccare produzione senza
  rollback pronto.
---

# mind-devops

## Scopo

Gestire operazioni DevOps: build, test automatici, deploy, CI/CD, container,
infrastruttura, environment, monitoraggio.

### Quando usarla

Task che toccano una o più di queste aree:
- Pipeline CI/CD (config, script, makefile, workflow)
- Build e artifact (immagini, bundle, release)
- Container / orchestrazione (Docker, K8s, compose)
- Cloud / server / provisioning
- Environment (dev, staging, prod) e config di deploy
- Segreti e gestione credenziali
- Monitoring, log, healthcheck, rollback

## Legge di ferro

1. **NESSUN DEPLOY SENZA PIPELINE RIPRODUCIBILE E VERIFICA POST-DEPLOY.**
2. **MAI TOCCARE PRODUZIONE SENZA ROLLBACK PRONTO.**

Nessuna eccezione. Un deploy fatto a mano, senza verifica o senza rollback è un
incidente programmato.

## Fasi

### 1. SCOPRI L'ESISTENTE

Prima di cambiare qualsiasi cosa, documenta lo stato attuale.

| Area | Cosa verificare |
|------|-----------------|
| Pipeline | CI config, script, makefile, workflow esistenti |
| Ambienti | dev / staging / prod: come sono definiti, chi può deployare |
| Build | come si fa oggi un build, cosa produce, dove finisce |
| Deploy | processo attuale, manuale o automatizzato, chi lo esegue |
| Segreti | dove sono conservati, come vengono iniettati |
| Monitoraggio | log, metriche, alert esistenti, healthcheck |

Output: tabella ambiente → tecnologia → comando build → comando deploy → verifica.

### 2. BUILD

- Riproducibile: lockfiles (package-lock, requirements.lock, go.sum), versioni
  pinnate, immagini immutabili.
- Artifact univoci: tag con hash del commit (es. `release-1.4.0-abc1234`).
- Niente build da ambiente locale: l'ambiente di build è il CI, non la macchina.
- Deterministico: stesso commit → stesso artifact.

### 3. CI

- Su ogni push/PR: lint + test + build + (se applicabile) analysis.
- La pipeline verde è condizione per merge e per deploy.
- Fail fast: interrompi alla prima fase rossa.
- Nessun test saltato con `only`, `skip` o `xfail` per far passare la pipeline.
- **Includi i test E2E/visual/a11y in CI** (da `mind-testing`): la suite Playwright gira in un job dedicato con i browser installati; i test E2E che l'utente ha deciso di tenere sono parte del gate di merge.

**Template base (GitHub Actions)** — adatta al progetto (package manager, framework, comandi reali verificati):

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --ci --coverage
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

- Adatta: nome branch, package manager (npm/yarn/pnpm/bun), runtime (node/python/go), comandi effettivi del progetto.
- Verifica che gli script esistano in package.json prima di citarli nel workflow.
- Il job e2e dipende dal job test: build/test passano prima dei flussi end-to-end.

### 4. DEPLOY

- Strategia scelta in base al rischio:

| Strategia | Uso tipico | Rischio | Rollback |
|-----------|-----------|---------|----------|
| re-create | low risk, ambiente non critico | stop → start | riavvio vecchia release |
| rolling | servizi stateless, multi-replica | ridotto | ripristino versioni precedenti |
| blue-green | ambiente critico, downtime zero | molto basso | switch verde/blu |
| canary | rilascio progressivo con metriche | basso | stop canary, torna al 100% vecchio |

- Healthcheck post-deploy: obbligatorio per ogni strategia.
- Monitoraggio dopo il deploy: log, metriche, errori — per un periodo definito.
- Rollback automatico se l'healthcheck fallisce; verifica che il rollback sia
  stato provato (non solo scritto).

### 5. CONFIG / SEGRETI

- Secret MAI in repo: variabili d'ambiente, secret manager, `.env` in `.gitignore`.
- MAI loggare segreti o token.
- Config per ambiente: dev ≠ staging ≠ prod; ogni differenza deve essere
  esplicita e documentata.
- Niente credenziali hardcoded in codice, immagini o config commitate.

### 6. INFRA

- Container: Dockerfile lean, multi-stage build, immagini minime, utente non root.
- Orchestrazione se presente: risorse, limiti, probe (liveness/readiness).
- Disaster recovery: procedure scritte e provate.
- Backup: verifica che il RESTORE funzioni, non solo che il backup esista.

## Anti-pattern

| Anti-pattern | Perché è pericoloso | Fix |
|--------------|---------------------|-----|
| Deploy manuale a memoria | non riproducibile, dipende dalle persone | pipeline automatizzata |
| Build solo in locale | "funziona sulla mia macchina", artifact non affidabili | build solo in CI |
| Secret nel repo o nel log | fuga di credenziali, incidenti di sicurezza | secret manager + env vars |
| "Funziona sulla mia macchina" | differenza di ambiente non controllata | immagine/build identici in CI |
| Rollback non testato | falso senso di sicurezza, rollback fallisce quando serve | esercitazioni periodiche |
| Backup mai restaurato | il backup potrebbe essere corrotto | restore testato su schedule |

## Red flags

- "Ho deployato e sembra ok" senza healthcheck né metriche.
- Pipeline mai eseguita dal CI (build/deploy solo locali).
- Differenze dev/prod non documentate.
- Rollback/backup citati ma mai provati.
- Segreti visibili in log, config o repo.
- Nessun monitoraggio o alert dopo il deploy.

## Quick reference

| Fase | Azione | Evidenza |
|------|--------|----------|
| Build | build riproducibile in CI | log build, exit code 0, artifact con hash |
| CI | lint + test + build su ogni push | pipeline verde, exit code 0 |
| Deploy | deploy via pipeline con strategia definita | log deploy, commit/tag deployato |
| Post-deploy | healthcheck + monitoraggio | exit code healthcheck, metriche, log errori |
| Rollback | procedura provata e pronta | drill di rollback, exit code restore |
| Backup | restore verificato | log di restore riuscito |

## Conclusione obbligatoria

1. Chiudere con **mind-verification**: verifica che la pipeline sia verde, il
   deploy verificato, il rollback pronto, i segreti non esposti.
2. Salvare procedure e lezioni in **mind-memory** (tool memory).

## Skill correlate

mind-brainstorming, mind-planning, mind-implementation, mind-verification,
mind-debugging, mind-memory, context7-mcp, execution-hygiene.