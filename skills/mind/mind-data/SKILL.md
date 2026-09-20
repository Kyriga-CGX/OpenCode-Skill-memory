---
name: mind-data
description: Skill per il lavoro con dati e database — query, schema, migrazioni dati, analisi, ETL, backup/restore, data quality. Usala quando un task tocca DB, dataset, report, trasformazioni o import/export. Obbliga a backup prima delle modifiche, a partire dallo schema reale e a documentare ogni analisi con query e data.
---

# mind-data

## 1. Scopo

Skill per task che toccano **dati e database**: query, schema, migrazioni dati, analisi, ETL, backup/restore, data quality.
Attiva quando il task riguarda: DB, dataset, report, trasformazioni, import/export, popolamento, deduplicazione, audit.

## 2. Legge di ferro

| Legge | Conseguenza operativa |
|---|---|
| **MAI MODIFICARE DATI SENZA BACKUP O TRANSACTION** | Nessun UPDATE/DELETE/INSERT senza dump o `BEGIN; ... COMMIT;` con rollback pronto. |
| **NESSUN'ANALISI SENZA CONOSCERE LO SCHEMA E I VINCOLI** | Prima di ogni query: leggi schema, tipi, vincoli, FK, indici. Mai assumere. |

## 3. Fasi

### ESPLORA
- Ricava lo schema reale: tabelle, colonne, tipi, vincoli (PK/FK/UNIQUE/NOT NULL/CHECK), indici.
- Volumi: row count, dimensione, growth. Sorgenti dati: file, API, DB upstream, owner.
- Documenta con tabelle in output.

| Prodotto | Contenuto |
|---|---|
| Tabella schema | nome, colonna, tipo, nullable, default, vincolo |
| Tabella volumi | tabella, row count, size, nota |

### QUERY / ANALISI
- Parti dallo schema reale, non da congetture. Verifica i tipi prima di comparare/castare.
- Usa `EXPLAIN` per le query pesanti; segnala full scan e mancanza di indici.
- Controlla `NULL` e duplicati prima di aggregare.
- **Distingui fatto da interpretazione**: il numero è un fatto, la lettura è un'interpretazione.
- Se l'analisi produce numeri: riporta **query usata** e **data di esecuzione**.

### MODIFICA DATI
1. **Backup**: dump completo o salvataggio dello stato (o almeno `BEGIN` con rollback pronto).
2. **Operazione in transaction**: `BEGIN; ... ; COMMIT;` mai autocommit su dati reali.
3. **Verifica**: row count prima/dopo, campione di righe letto a conferma.

Migrazioni grandi:
- **Batch**: lotti limitati (es. 10k righe), mai tutto in un colpo.
- **Idempotenza**: rieseguibile senza doppi effetti.
- **Rollback pianificato**: scritto prima, non dopo.

### SCHEMA CHANGE
- **Migration versionata**: file SQL/migration numerati, non DDL ad-hoc.
- **Down/rollback**: ogni migration ha il suo reverse.
- **Indici**: aggiungi gli indici richiesti dalle nuove query.
- **Downtime**: valuta lock e finestra di manutenzione; annunciare l'impatto.

### ETL / TRASFORMAZIONI
- **Pipeline riproducibile**: stessi input → stessi output; seed/fonte fissi.
- **Validazione input**: schema atteso, range, encoding prima di trasformare.
- **Gestione errori per riga**: riga fallita ≠ pipeline ferma; log dello scarto.
- **Output con metadati**: file/DB corredato da data, conteggi, sorgente, version della trasformazione.

### QUALITÀ
Check di data quality sistematici:

| Check | Domanda | Azione su fail |
|---|---|---|
| NULL non attesi | Colonne NOT NULL/logicamente obbligatorie vuote? | Segnala, quantifica |
| Duplicati | Chiavi ripetute inattese? | Quantifica, causa, deduplica in transaction |
| Range | Valori fuori dominio (date, prezzi, etc.)? | Segnala con esempi |
| Integrità referenziale | FK orfane? | Quantifica, isola |

## 4. Anti-pattern

| Anti-pattern | Perché | Rimedio |
|---|---|---|
| Query senza EXPLAIN | Comportamento ignoto, full scan nascosto | EXPLAIN su ogni query pesante |
| UPDATE/DELETE senza WHERE completo | Rischio distruzione di massa | WHERE su PK/indice, verifica count selettività prima |
| Modifiche senza backup | Irreversibilità | Dump o transaction sempre |
| Credenziali DB hardcoded | Leak, rottura, sprawl | env/secret manager, mai nel codice |
| Ignorare timezone/encoding | Dati corrotti, comparazioni sbagliate | UTC esplicito, verificare collation/charset |
| Cartelle "finale_finale_v2" | Niente versioning, ambiguità | Nomi versionati, metadati nel file |

## 5. Red flags

- Numeri **senza query** allegata.
- "I dati dicono..." **senza fonte/query/data**.
- `DELETE`/`UPDATE` su produzione **senza transaction**.
- Analisi che inizia **senza aver letto lo schema**.
- Backup assente o non verificato prima di una modifica.

## 6. Quick reference

| Fase | Azione | Evidenza da produrre |
|---|---|---|
| ESPLORA | Leggi schema, vincoli, volumi | Tabelle schema e volumi |
| QUERY/ANALISI | EXPLAIN, check NULL/dup, fatti vs interpretazione | Query + data di esecuzione + numeri |
| MODIFICA DATI | Backup → transaction → verifica | Count prima/dopo, campione righe |
| SCHEMA CHANGE | Migration versionata + down | File SQL + piano rollback |
| ETL | Pipeline riproducibile, errori per riga | Metadati output: data, conteggi, sorgente |
| QUALITÀ | Check NULL/dup/range/FK | Tabella problemi → check → esito |

## 7. Regola finale

- Se l'output contiene **codice**: chiudi con **mind-verification** (check funzionante, testato, sicuro).
- Salva **schema, decisioni e assunzioni dati** in **mind-memory** (tool memory) per i task successivi.
- Task complessi: coordina con **mind-brainstorming** (esplorazione/requisiti), **mind-planning** (piano di migrazione/ETL), **mind-implementation** (scrittura codice/pipeline).
- Se mancano dettagli su librerie/driver/SQL: usa **context7-mcp** per la documentazione corrente.