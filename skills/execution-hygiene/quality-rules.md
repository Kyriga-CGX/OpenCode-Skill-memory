# Regole di qualità — il gate

## Scopo

Questo documento definisce le **6 regole** che l'agente applica al codice scritto prima di dichiarare un task completo. Non è codice: è un elenco di criteri, con per ciascuno cosa controllare e un esempio di come applicarlo, pensato per essere usato come check list mentale durante l'attivazione **FINE** del flusso.

Il principio è uno solo: **un task è completo solo quando ciò che è stato scritto è pulito, verificabile e verificato.** Le regole qui sotto non aggiungono una coda di revisione separata: sono il modo in cui il lavoro svolto viene riconosciuto come fatto bene.

## Le 6 regole

### 1. Naming chiaro

**Cosa controllare.** I nomi di variabili, funzioni, componenti e campi devono essere coerenti con il dominio e leggibili a prima vista. Un nome deve dire cosa rappresenta, non come è fatto.

Da evitare: `x`, `temp`, `data`, `item`, `result` usati senza contesto, o nomi che non riflettono il significato nel dominio del progetto.

**Come applicarla.** Quando un nome non spiega il suo scopo nel contesto, il lettore deve ricostruirlo. Rinomina finché il nome non è autoesplicativo. Se il nome richiede un commento per farsi capire, il nome non va bene.

Esempio: invece di `data`, usare `products` se la variabile contiene il carrello dei prodotti; invece di `check`, usare `validateCheckout` se la funzione verifica il checkout. Un nome buono rende superfluo l'indovinello.

### 2. Separazione delle responsabilità

**Cosa controllare.** Ogni funzione, componente o modulo deve avere un compito solo. Se un blocco di codice fa più cose diverse, va spezzato in più unità più piccole, ciascuna con una responsabilità unica.

Da evitare: funzioni lunghe che mescolano parsing, validazione, persistenza e presentazione nello stesso punto.

**Come applicarla.** Se una funzione o componente svolge più di un compito, estrai ogni compito in una unità separata e dai un nome che descriva quel singolo compito. Una funzione che «fa tutto» è difficile da riusare e da testare.

Esempio: una funzione che carica i dati, li filtra e li disegna va spezzata in step separati: caricamento, filtro, rendering. Ogni step deve poter essere appellato e testato da solo.

### 3. DRY

**Cosa controllare.** Niente logica duplicata. Se un pattern di codice compare due volte in punti diversi, va estratto in un'unica definizione riusabile.

Da evitare: lo stesso blocco di logica copiato-incollato in più punti, che a ogni modifica va aggiornato in tutti i posti.

**Come applicarla.** Se vedi la stessa logica due volte, estraila in una funzione o costante condivisa e usa quella nei punti in cui compariva. Se è comparso solo una volta, lascialo; la regola interviene dal secondo uso.

Esempio: se il calcolo del totale del carrello compare in due punti diversi, estrailo in una funzione `computeCartTotal` e richiamala dove serve, invece di copiare lo stesso calcolo.

### 4. Gestione errori

**Cosa controllare.** I fallimenti non devono essere muti. Quando qualcosa va storto, va segnalato in superficie: con un log, un `throw`, o un messaggio user-facing, a seconda del contesto.

Da evitare: `catch` vuoti, errori inghiottiti, fallimenti che scompaiono senza lasciare traccia e fanno sembrare il flusso riuscito.

**Come applicarla.** Ogni punto in cui un'operazione può fallire deve gestire l'esito e renderlo visibile. Se il contesto è interno, logga; se è una funzione di libreria, propaga l'errore; se è user-facing, mostra il messaggio all'utente. Mai lasciare un fallimento silenzioso con un gestore vuoto.

Esempio: quando una chiamata di rete fallisce, non limitarti a un `catch` vuoto: segnala l'esito, logga l'errore e comunica al chiamante che l'operazione non è riuscita, invece di proseguire come se nulla fosse.

### 5. Niente hardcoded

**Cosa controllare.** Valori e magic number non vanno lasciati sparsi nel codice: vanno estratti in costanti con un nome che ne spieghi il significato. Se il progetto usa i token del sistema di design (`design-system`) o del motion (`motion`), usa quelli.

Da evitare: numeri o stringhe magiche inline senza nome, timeout arbitrari, colori o spazialità ripetute, valori che cambiano a ogni occorrenza.

**Come applicarla.** Ogni valore che compare come costante di dominio va estratto in una costante nominata. Se nel progetto sono disponibili token, usali al posto dei valori raw, così il valore è definito in un solo punto e coerente in tutta l'app.

Esempio: invece di `300` sparso nel codice, definire `STROMA_MODAL_DURATION = 300` o, se il progetto usa i token del motion, usare il token corrispondente. Invece di `#333` ripetuto, usare il colore token del design-system.

### 6. Testability

**Cosa controllare.** Il codice deve essere testabile: niente accoppiamento rigido con infrastruttura che rende i test fragili; la logica pura va separata dall'I/O.

Da evitare: valori di input incastrati dentro il codice, dipendenze dirette dal sistema operativo o dalla rete dentro la logica che vuoi testare, codice che non può essere invocato isolatamente.

**Come applicarla.** Tieni la logica di business separata dalle operazioni di I/O (file, rete, database). La parte che fa calcoli e ragionamenti deve poter essere chiamata con input semplici e prevedibili, senza bisogno di mockare l'intero mondo.

Esempio: la funzione che calcola lo sconto non deve andare a leggere da file o fare richieste di rete; deve ricevere i dati come parametro e restituire il risultato, così i test la invocano direttamente.

## La sequenza del gate qualità

All'attivazione **FINE**, quando ritieni il task completo, applica questo ordine:

1. **Applica le 6 regole** al codice che hai scritto, una alla volta, e correggi ciò che non rispetta un criterio.
2. **Esegui lint, typecheck e test** se disponibili nel progetto e **registra l'esito** della run (cosa è passato, cosa no, e quali tool non erano disponibili).
3. **Rileggi il delta** a occhi freschi, cercando regressioni che l'esecuzione meccanica potrebbe non vedere: cambiamenti collaterali, casi limite, comportamenti inattesi.
4. **Dichiara solo ciò che hai verificato.** Non asserire che un test passa, che il tipo è corretto o che una funzionalità funziona se non hai eseguito la verifica che lo dimostra. Se un tool non era disponibile, dillo, anziché fingere che il passaggio sia avvenuto.

Solo dopo che il gate è superato il task si considera completo e verificato.
