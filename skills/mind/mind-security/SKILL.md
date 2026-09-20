---
name: mind-security
description: Usala per analisi di sicurezza, threat modeling, risposta a breach/vulnerabilità e hardening, in particolare quando il task tocca auth, dati sensibili, pagamenti, rete, input utente o terze parti.
---

# mind-security

## 1. Scopo

Analisi di sicurezza, threat modeling, risposta a incidenti (breach/vulnerabilità), hardening.

**Quando usarla** (almeno uno dei seguenti):

| Trigger | Esempio |
|---|---|
| Auth | login, sessioni, token, OAuth, password, MFA |
| Dati sensibili | PII, credenziali, dati bancari, health data |
| Pagamenti | checkout, card, gateway, refund |
| Rete | API pubbliche, servizi esposti, CORS, TLS |
| Input utente | form, upload, query, header, parametri |
| Terze parti | dipendenze, SDK, webhook, integrazioni |

## 2. Legge di ferro

1. **NESSUN CODICE DI SICUREZZA SCRITTO SENZA THREAT MODEL PRIMA.**
2. **NESSUNA AFFERMAZIONE DI "SICURO" SENZA VERIFICA.**

Violazione di una delle due = il task è INCOMPLETO.

## 3. Fasi

### 3.1 THREAT MODEL (prima di scrivere codice)

Identifica: asset, fiducia, trust boundaries, vettori di attacco.

| # | Elemento | Domanda |
|---|---|---|
| 1 | Asset | Cosa protegge questo sistema? |
| 2 | Fiducia | Cosa è già considerato sicuro? |
| 3 | Trust boundary | Dove passa l'input dall'esterno? |
| 4 | Vettori | Come si raggiunge l'asset dall'esterno? |

Tabella threat (STRIDE):

| Minaccia | Componente | Impatto | Rischio (H/M/L) | Mitigazione proposta |
|---|---|---|---|---|
| Spoofing | login | Account takeover | H | MFA, rate limit, verifica email |
| Tampering | input form | XSS | H | encoding output, CSP |
| Repudiation | log | mancanza audit | M | log append-only, audit trail |
| Information disclosure | API | leak dati | H | RBAC, min-least privilege |
| DoS | endpoint pubblico | indisponibilità | M | rate limiting, quota |
| Elevation of privilege | admin role | accesso non autorizzato | H | RBAC + verifiche lato server |

### 3.2 ANALISI INPUT

Checklist obbligatoria su ogni punto di ingresso:

- [ ] Validazione lato server (MAI solo client-side)
- [ ] Injection: SQL/NoSQL → query parametrizzate/prepared statements
- [ ] Command injection → MAI concatenare input in shell; usa array argv / API dedicate
- [ ] XSS → encode output in base al contesto (HTML, attr, JS, URL); header CSP
- [ ] SSRF → whitelist URL, blocca IP privati/metadata (169.254.169.254)
- [ ] Path traversal → normalizza path, verifica che il risultato resti nel root
- [ ] File upload → whitelist estensioni, size limit, scan, store fuori docroot
- [ ] Encoding/decoding coerente; mai fidarsi di parametri "sanitizzati" dal client

### 3.3 AUTH / AUTHZ

| Area | Regola |
|---|---|
| Password | hash salato: scrypt/bcrypt/argon2. MAI MD5/SHA1, MAI in chiaro |
| JWT | verificare `exp`, `iss`, `aud`, `alg`. MAI accettare `alg=none`. Validare la firma con la chiave pubblica |
| Sessioni | id random non predicibile, HttpOnly, Secure, SameSite, rotate su privilege change |
| MFA | richiedere per admin e operazioni sensibili |
| RBAC/ABAC | autorizzazione verificata lato server su ogni endpoint |
| CORS | origini esplicite, MAI `*` con credenziali |
| CSRF | token anti-CSRF su mutazioni di stato |
| Rate limiting | su login, reset password, API pubbliche |
| Secret management | MAI hardcoded, MAI committati. Variabili d'ambiente / vault / secret manager |

### 3.4 DATI SENSIBILI

- [ ] Encrypt at rest (disco, DB, backup)
- [ ] Encrypt in transit (TLS 1.2+, HSTS)
- [ ] Minimizzazione: raccogliere solo il necessario
- [ ] Retention: scadenza/purge dei dati non più necessari
- [ ] GDPR/regulatory: consenso, diritto all'oblio, data protection impact, log degli accessi ai dati personali

### 3.5 DIPENDENZE (supply chain)

- [ ] `npm audit` / equivalenti prima di ogni merge
- [ ] Versioni pinnate + lockfile committato
- [ ] SBOM aggiornato; segnalare update disponibili
- [ ] Review del nuovo package prima di aggiungerlo (reputazione, manutenzione, licenses)

### 3.6 RISPOSTA A BREACH / INCIDENT

| Fase | Azioni concrete |
|---|---|
| Containment | isolare il sistema, revocare secret esposti, disable account, cutoff rete |
| Eradicazione | rimuovere backdoor/persistenza (cron, startup, account fantasma), rotate chiavi |
| Recovery | restore da backup pulito, verificare che la compromissione sia rimossa |
| Post-mortem | root cause, impatto, lesson learned; salvare tutto in mind-memory (tool memory add) |

### 3.7 VERIFICA

- [ ] Lint security (es. eslint security, bandit, spotbugs)
- [ ] `npm audit` / `pip-audit` / equivalenti, severità >= high = blocca
- [ ] SAST/DAST quando disponibili nel progetto
- [ ] Test manuali dei vettori principali: injection, XSS, auth bypass, path traversal
- [ ] Conferma scritta di ogni mitigazione della tabella threat (sezione 3.1)

## 4. Red flags / razionalizzazioni

| Razionalizzazione | Risposta operativa |
|---|---|
| "È solo un prototipo" | Il rischio non scala con l'intenzione; applica comunque il minimo |
| "L'utente non può saperlo" | Threat model sull'input, non sulla volontà |
| "Nessuno attaccherà questo" | Nessuna affermazione di sicurezza senza verifica; tratta l'asset come pubblicamente raggiungibile |
| "Lo fixo dopo" | TODO di sicurezza = minaccia aperta; aprire issue tracciata o non completare |
| "L'input è già sanitizzato dal client" | Client = fuori dal trust boundary. Rivalida tutto lato server |
| "Usiamo HTTPS quindi è sicuro" | TLS non copre injection, authz, SSRF |
| "Funziona in locale" | Verifica l'hardening nel deployment reale |

## 5. Quick reference

| Fase | Azione | Evidenza |
|---|---|---|
| Threat model | tabella STRIDE compilata | asset + mitigazioni per ogni rischio H/M |
| Analisi input | checklist validazione | query parametrizzate, encode, CORS/CSP configurati |
| Auth/Authz | hash salato, JWT validato, RBAC server-side | test di bypass falliti |
| Dati sensibili | encryption at rest/in transit | configurazione TLS + cifratura verificata |
| Dipendenze | audit puliti | `npm audit` senza high/critical |
| Breach | containment→post-mortem | incident report + lezioni salvate in mind-memory |
| Verifica | scan + test manuali | output dello scan + checklist firmata |

## 6. Chiusura

1. Chiudere SEMPRE con **mind-verification**.
2. Salvare pattern, decisioni e lezioni apprese in **mind-memory** (tool `memory add`).
3. Per piani complessi coordinare prima con **mind-brainstorming** e **mind-planning**; per l'esecuzione usare **mind-implementation** e **execution-hygiene**.

## 7. Norma

Ogni affermazione di completamento richiede evidenza (scan, test, configurazione verificata). Senza evidenza: task NON completo.