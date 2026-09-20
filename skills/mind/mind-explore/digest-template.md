# Codebase Digest — <nome progetto>

Generato: <data> · Modalità: <onboarding|feature-location|reverse-engineering|impact-analysis>

## 1. Stack

| Strato | Tecnologia | Versione | Dove (file) |
|---|---|---|---|
| Linguaggio | | | |
| Framework | | | |
| Build tool | | | |
| Runtime | | | |
| Database | | | |

## 2. Struttura

```
<albero top-level annotato con il ruolo di ogni dir/file chiave>
```

## 3. Punti di ingresso

- <main/entrypoint/server/router/worker/cron> → <file:riga>

## 4. Flusso principale

1. <passo> → <file:riga>
2. <passo> → <file:riga>
3. ...

(una richiesta/azione tipica, dall'ingresso all'uscita)

## 5. Dove vive ogni dominio

| Dominio | Moduli/file | Note |
|---|---|---|
| | | |

## 6. Strati di dato

- Schema: <migration/model file>
- Letture principali: <file>
- Scritture principali: <file>

## 7. API e integrazioni

- Endpoint/contratti: <route/OpenAPI>
- Client esterni: <servizi chiamati>
- Eventi/queue/cron: <topics/cron>

## 8. Test

- Framework: <x>
- Comando: `<comando esatto>`
- Coperto: <domini coperti>
- Non coperto: <domini scoperti>
- Esito run (se eseguito): <pass/parziale/fail>

## 9. Punti di attenzione (debt / rischi)

| Rischio/debt | Gravità | Dove | Suggerimento |
|---|---|---|---|
| | ALTO/MEDIO/BASSO | | |

## 10. Impatto (solo IMPACT ANALYSIS)

| File/servizio toccato | Rischio | Motivo |
|---|---|---|
| | ALTO/MEDIO/BASSO | |

## 11. Domande aperte

- <cose non ancora verificate con evidenza>