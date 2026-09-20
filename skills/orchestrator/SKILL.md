---
name: orchestrator
description: Entry point globale del sistema di skill; precede using-mind e le skill di cluster. Attivala per QUALSIASI task: nuova feature o lavoro creativo, costruire o modificare UI, animazione/motion/3D, prosa/testi/copy, bug/fix, domanda su libreria o framework, esecuzione di un piano, init di un progetto, review di codice. Non produce contenuto: coordina le skill, decide la rotta e delega a catena.
---

# Orchestrator per OpenCode

## Scopo

Questa skill è l'**entry point globale** del sistema di skill. Non è una skill di contenuto: **coordina le skill, non le sostituisce e non produce contenuto.**

Il suo unico compito è decidere **quale rotta seguire** — cioè la sequenza di skill da attivare per il task in arrivo — e **delegare a catena**: ogni skill della rotta opera sul risultato della precedente.

Non implementare mai direttamente con l'orchestrator: se il task richiede una skill di cluster, è quella skill a lavorare, non questa.

## Come leggere la rotta

La rotta è una **sequenza di skill in ordine**:

1. Esegui la **prima** skill della rotta.
2. Applica la **successiva** sul risultato ottenuto.
3. Prosegui finché la rotta non è completata.

Il gate finale `mind-verification` / `execution-hygiene` **chiude ogni rotta di implementazione**: nessuna rotta che produca modifiche è completa finché non passa il suo gate di qualità.

## Integrazione con `mind`

Questa skill è il wrapper storico dell'orchestrazione. La fonte di verità del routing è la skill **`using-mind`** (fork personale delle superpowers): consulta il suo `routing.md` per la tabella completa e i casi limite. Le due skill hanno ruoli complementari e non sovrapposti:

- **`orchestrator` / `using-mind`** decide QUALE skill attivare: è il livello di routing, sopra le skill.
- **`execution-hygiene`** governa COME si esegue il lavoro: PRIMA (ricerca), DURANTE (checkpoint), FINE (gate qualità) — dentro ogni rotta.

Regole:

- `mind-verification` ed `execution-hygiene` sono **sempre il gate finale** di ogni rotta di implementazione.
- Non vanno mai eseguiti **prima** delle skill di contenuto: prima il contenuto, poi il gate a chiudere.

## Rinvio

Vedi `routing.md` per la tabella di routing completa, le precedenze e i casi particolari.