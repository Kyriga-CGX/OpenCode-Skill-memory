# OpenCode-Skill-memory

Backup versionato del sistema opencode dell'utente: configurazione, skill custom, memoria supermemory e documentazione.

## Struttura

- `config/` — configurazione opencode (`opencode.jsonc`, `supermemory.json*`, `vibeguard.config.json`, `dcp.jsonc`, `AGENTS.md`). Le chiavi API sono sostituite con placeholder `${VAR}`; i valori reali vanno nel file `.env` locale (vedi `.env.example`).
- `skills/` — skill custom dell'agente (9): context7-mcp, design-md, design-system, ecosystem-health-check, execution-hygiene, frontend-design, motion, orchestrator, stop-slop. Le directory `.superpowers`/node_modules sono escluse.
- `supermemory/` — memoria persistente (`data/data`). I file sensibili (api-key, auth-secret, machine-key, instance-id) e i binari sono esclusi.
- `docs/` — documentazione e note decisionali.

## Ripristino

- Copia i file in `~/.config/opencode/` e `~/.agents/skills/`.
- Riapplica i valori reali delle chiavi nel file `.env` o direttamente nei config.