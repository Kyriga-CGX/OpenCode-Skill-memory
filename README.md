# mind-system

Sistema mind: skill + orchestrazione + memoria.

Sistema di skill completo per opencode: orchestrazione a 360° (routing intelligente delle skill), plugin `mind` (orchestratore) e plugin `mind-memory` (memoria locale-first con cloud opzionale), fork personale dei plugin originali che rallentavano l'avvio.

## Struttura

- `config/` — configurazione opencode (`opencode.jsonc`, `mind-memory.json`, `vibeguard.config.json`, `dcp.jsonc`, `AGENTS.md`). Le chiavi API sono sostituite con placeholder `${VAR}`; i valori reali vanno nel file `.env` locale (vedi `.env.example`).
- `plugins/` — plugin locali fork personali: `mind` (orchestratore, inietta il bootstrap e registra le skill) e `mind-memory` (memoria locale-first). Vanno copiati in `~/.config/opencode/plugins/` e referenziati con `file:` nel config.
- `skills/` — skill custom dell'agente: il fork `mind/` con l'orchestratore `using-mind` e 23 skill di dominio, più le skill storiche (context7-mcp, design-md, design-system, ecosystem-health-check, execution-hygiene, frontend-design, motion, orchestrator, stop-slop). Le directory node_modules sono escluse.
- `docs/` — documentazione e note decisionali, incluso `system-diagram.md` (diagrammi Mermaid del flusso completo: attivazione, routing, agenti FMA, memoria, gate).

> La memoria supermemory non è più usata: sostituita dal plugin locale `mind-memory` (storage in `~/.local/share/opencode/mind-memory/memories.json`, cloud opzionale disattivato se non configurato).

## Skill mind

L'orchestratore `using-mind` decide la rotta per ogni task e coordina la comunicazione tra skill (vedi `skills/mind/using-mind/routing.md`). Skill di dominio: brainstorming, planning, implementation (multi-subagent in parallelo con agenti FMA), verification, debugging, security, research, performance, data, testing, docs, migration, devops, refactor, api, release, explore, architecture, copy, incident, i18n, eval.

## Ripristino

- Copia i file in `~/.config/opencode/` e `~/.agents/skills/`.
- Riapplica i valori reali delle chiavi nel file `.env` o direttamente nei config.
- Riavvia opencode (la config non è hot-reload).