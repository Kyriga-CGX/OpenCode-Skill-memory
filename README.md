# OpenCode-Skill-memory

Backup versionato del sistema opencode dell'utente: configurazione, skill custom, memoria supermemory e documentazione.

## Struttura

- `config/` — configurazione opencode (`opencode.jsonc`, `mind-memory.json`, `vibeguard.config.json`, `dcp.jsonc`, `AGENTS.md`). Le chiavi API sono sostituite con placeholder `${VAR}`; i valori reali vanno nel file `.env` locale (vedi `.env.example`).
- `plugins/` — plugin locali fork personali: `mind` (orchestratore) e `mind-memory` (memoria locale-first). Vanno copiati in `~/.config/opencode/plugins/` e referenziati con `file:` nel config.
- `skills/` — skill custom dell'agente: le 9 storiche (context7-mcp, design-md, design-system, ecosystem-health-check, execution-hygiene, frontend-design, motion, orchestrator, stop-slop) più il fork `mind/` (using-mind orchestratore + mind-brainstorming, mind-debugging, mind-implementation, mind-planning, mind-verification, mind-security, mind-research, mind-performance, mind-data, mind-testing, mind-docs, mind-migration, mind-devops). Le directory node_modules sono escluse.
- `docs/` — documentazione e note decisionali.

> `supermemory/` non è più usato: sostituito dal plugin locale `mind-memory` (storage in `~/.local/share/opencode/mind-memory/memories.json`, cloud opzionale disattivato se non configurato).

## Ripristino

- Copia i file in `~/.config/opencode/` e `~/.agents/skills/`.
- Riapplica i valori reali delle chiavi nel file `.env` o direttamente nei config.