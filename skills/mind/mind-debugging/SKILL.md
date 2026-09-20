---
name: mind-debugging
description: Da usare per OGNI bug, test fallito o comportamento inatteso, PRIMA di proporre fix. Trova la root cause prima di fixare; i fix sui sintomi sono un fallimento.
---

# Debugging mind

## Legge di ferro

```
NESSUN FIX SENZA INDAGINE SULLA ROOT CAUSE
```

Se non hai completato la Fase 1, non puoi proporre fix. Violare la lettera del processo è violarne lo spirito.

## Quando usarla

Qualsiasi problema tecnico: test falliti, bug in produzione, comportamento inatteso, problemi di performance, build fallite, problemi di integrazione.

Usala SOPRATTUTTO quando: sei sotto pressione temporale, "basta un fix veloce" sembra ovvio, hai già provato più fix, un fix precedente non ha funzionato, non capisci il problema.
Non saltarla quando: il problema sembra semplice, hai fretta, qualcuno vuole il fix ORA (il sistematico è più veloce del tentativo-casuale).

## Le 4 fasi (in ordine, nessuna saltata)

### Fase 1: Investigazione root cause (PRIMA di qualsiasi fix)

1. **Leggi gli errori con attenzione** — non saltare errori o warning; spesso contengono la soluzione esatta. Leggi gli stack trace completi. Annota righe, path, codici errore
2. **Riproduci in modo consistente** — puoi triggerarlo in modo affidabile? Passi esatti? Succede sempre? Se non riproducibile → raccogli dati, non indovinare
3. **Controlla le modifiche recenti** — cosa è cambiato che potrebbe causarlo? git diff, commit recenti, nuove dipendenze, modifiche config, differenze ambientali
4. **Raccogli evidenza nei sistemi multi-componente** — SE il sistema ha più componenti (CI→build→signing, API→service→DB): PRIMA di proporre fix aggiungi strumentazione diagnostica. Per OGNI confine di componente: logga cosa entra, logga cosa esce, verifica la propagazione env/config, controlla lo stato a ogni layer. Esegui UNA volta per raccogliere evidenza su DOVE si rompe, POI analizza per identificare il componente che fallisce, POI investiga quel componente specifico
5. **Traccia il flusso dati** — se l'errore è profondo nello stack: da dove origina il valore sbagliato? Cosa lo ha chiamato con quel valore? Risali fino alla fonte. Fix alla fonte, non al sintomo

### Fase 2: Analisi del pattern

1. **Trova esempi funzionanti** — codice simile che funziona nello stesso codebase
2. **Confronta contro i riferimenti** — se implementi un pattern, leggi l'implementazione di riferimento COMPLETAMENTE, riga per riga, prima di applicarlo
3. **Identifica le differenze** — cosa differisce tra funzionante e rotto? Elenca ogni differenza, anche minima. Non assumere "quella non può importare"
4. **Comprendi le dipendenze** — di cosa ha bisogno questo componente? Impostazioni, config, ambiente? Quali assunzioni fa?

### Fase 3: Ipotesi e test (metodo scientifico)

1. **Forma UNA singola ipotesi** — "credo X sia la root cause perché Y". Scrivila. Sii specifico
2. **Test minimale** — il più piccolo cambiamento possibile per testare l'ipotesi. UNA variabile alla volta. Non fixare più cose insieme
3. **Verifica prima di continuare** — ha funzionato? Sì → Fase 4. No → NUOVA ipotesi. NON aggiungere altri fix sopra
4. **Quando non sai** — dì "non capisco X". Non fingere di sapere. Chiedi aiuto. Ricerca

### Fase 4: Implementazione

1. **Crea il test che fallisce** — riproduzione più semplice possibile; test automatizzato se possibile, script singolo se non c'è framework. DEVE esserci prima del fix. Usa `mind-implementation` (TDD) per i test
2. **Implementa UN SINGOLO fix** — sulla root cause identificata. UN cambiamento alla volta. Niente "già che ci sono", niente refactoring impacchettato
3. **Verifica il fix** — il test ora passa? Nessun altro test rotto? Il problema è davvero risolto? Usa `mind-verification` prima di dichiarare successo
4. **Se il fix non funziona** — FERMATI. Quanti fix hai provato? Se < 3: torna alla Fase 1, ri-analizza con le nuove informazioni. **Se ≥ 3: FERMATI e questiona l'architettura (passo 5).** Non tentare il fix #4 senza discussione architetturale
5. **Se 3+ fix falliti: questiona l'architettura** — pattern che indica problema architetturale: ogni fix rivela nuovo stato condiviso/coupling altrove; i fix richiedono "refactoring massivo"; ogni fix crea nuovi sintomi altrove. FERMATI e questiona i fondamenti: questo pattern è fondamentalmente solido? Stiamo continuando per inerzia? Dovremmo refactoringare l'architettura invece di continuare a fixare sintomi? Discuti con l'utente. NON è un'ipotesi fallita — è un'architettura sbagliata

## Red flags — FERMATI e segui il processo

Se ti sorprendi a pensare:
- "Fix veloce per ora, indago dopo"
- "Provo a cambiare X e vediamo se funziona"
- "Aggiungo più modifiche, eseguo i test"
- "Skip del test, verifico a mano"
- "Probabilmente è X, lo sistemo"
- "Non capisco del tutto ma potrebbe funzionare"
- "Il pattern dice X ma lo adatto diversamente"
- "Ecco i problemi principali: [elenca fix senza investigazione]"
- Proporre soluzioni prima di aver tracciato il flusso dati
- **"Un altro tentativo di fix" (già a 2+ tentati)**
- **Ogni fix rivela un nuovo problema altrove**

TUTTI significano: FERMATI. Torna alla Fase 1.
Se 3+ fix falliti: questiona l'architettura (Fase 4.5).

## Segnali dell'utente che stai sbagliando

- "Non sta succedendo?" — hai assunto senza verificare
- "Ce lo mostrerà...?" — avresti dovuto aggiungere raccolta evidenza
- "Smettila di indovinare" — proponi fix senza capire
- "Ultra-pensaci" — questiona i fondamenti, non solo i sintomi
- "Siamo bloccati?" (frustrato) — il tuo approccio non funziona

Quando li vedi: FERMATI. Torna alla Fase 1.

## Razionalizzazioni comuni

| Scusa | Realtà |
|---|---|
| "Il problema è semplice, non serve il processo" | Anche i problemi semplici hanno root cause. Il processo è veloce per i bug semplici |
| "Emergenza, non c'è tempo" | Il debug sistematico è PIÙ veloce del tentativo-casuale |
| "Provo prima questo, poi indago" | Il primo fix imposta il pattern. Fallo bene dall'inizio |
| "Scrivo il test dopo che il fix funziona" | I fix non testati non durano. Il test prima lo prova |
| "Più fix insieme risparmiano tempo" | Non isoli cosa ha funzionato. Causa nuovi bug |
| "Il riferimento è troppo lungo, adatto il pattern" | La comprensione parziale garantisce bug. Leggilo completamente |
| "Vedo il problema, lo sistemo" | Vedere i sintomi ≠ capire la root cause |
| "Un altro tentativo" (dopo 2+ falliti) | 3+ fallimenti = problema architetturale. Questiona il pattern, non fixare di nuovo |

## Riferimento rapido

| Fase | Attività chiave | Criterio di successo |
|---|---|---|
| 1. Root cause | Leggi errori, riproduci, controlla modifiche, raccogli evidenza | Capire COSA e PERCHÉ |
| 2. Pattern | Trova esempi funzionanti, confronta | Identificare le differenze |
| 3. Ipotesi | Forma teoria, test minimale | Confermata o nuova ipotesi |
| 4. Implementazione | Crea test, fix, verifica | Bug risolto, test passano |

## Quando il processo rivela "nessuna root cause"

Se l'indagine sistematica rivela che il problema è davvero ambientale, dipendente dal timing o esterno:
1. Hai completato il processo
2. Documenta cosa hai investigato
3. Implementa la gestione appropriata (retry, timeout, messaggio errore)
4. Aggiungi monitoring/logging per indagini future

Ma: il 95% dei casi "nessuna root cause" è un'indagine incompleta.

## Tecniche di supporto

- **Tracciamento root cause**: traccia il bug all'indietro attraverso lo stack per trovare il trigger originale
- **Difesa in profondità**: dopo aver trovato la root cause, aggiungi validazione a più livelli
- **Attesa basata su condizione**: sostituisci timeout arbitrari con polling su condizione

## Bug hunting proattivo (ricerca sistematica di bug)

Non serve aspettare un bug segnalato: il bug hunting trova problemi prima che l'utente li veda. Da usare su review di codice, feature nuove o codebase legacy.

### Tecniche (per rigore)

| Tecnica | Cosa cercare | Come |
|---|---|---|
| **Edge case** | Input vuoti, null, undefined, 0, negativo, massimi, unicode, stringhe enormi | Passa ogni funzione/endpoint con valori limite e atipici |
| **Boundary scanning** | Off-by-one, `<=` vs `<`, lunghezze, indici, paginazione | Verifica i confini: esattamente al limite, appena dentro, appena fuori |
| **Stato e transizioni** | Macchine a stati, flag, timing, race condition | Elenca gli stati, testa ogni transizione e le sequenze illecite |
| **Gestione errori** | Catch vuoti, errori inghiottiti, try senza finally, errori non gestiti | Forza i percorsi di errore: rete giù, file mancante, permessi, timeout, quota piena |
| **Concorrenza e async** | Promise non awaited, race, deadlock, mutazione condivisa | Esegui operazioni in parallelo, rientranze, doppi submit |
| **Dati e persistenza** | Schema mismatch, encoding, duplicati, dati orfani, rollback incompleti | Verifica crea/aggiorna/elimina in sequenza e le violazioni di vincolo |
| **Sicurezza di base** | Input non validati, injection, auth bypass, secret esposti | Vedi `mind-security` per il threat model completo |
| **Codice morto e path inaccessibili** | Rami mai eseguiti, condizioni sempre vere/false, funzioni non usate | Rileggi i branch e verifica che ogni percorso sia raggiungibile |

### Flusso

1. Scegli l'area (feature nuova, diff, modulo a rischio).
2. Applica le tecniche pertinenti (tabella sopra) scrivendo o eseguendo test mirati.
3. Ogni bug trovato: segui le **4 fasi** di questa skill (root cause PRIMA del fix), non fixare a naso.
4. Registra ogni bug trovato con: tecnica che l'ha scoperto, manifestazione, root cause, fix.
5. Se trovi 0 bug, specifica quali tecniche hai applicato e perché l'area è pulita (niente affermazioni generiche tipo "è tutto ok").

### Anti-pattern del bug hunting

| Anti-pattern | Perché è sbagliato |
|---|---|
| Fixare bug mentre li cerchi | Rompe il flusso e mischia indagine e modifica |
| Solo "guardare il codice" senza eseguire | La lettura non rivela errori a runtime |
| Testare solo il percorso felice | I bug stanno nei casi limite, non nel main path |
| Fermarsi al primo bug | Il primo bug spesso nasconde altri |
| Bug hunting senza registrazione | I risultati non sono riusabili