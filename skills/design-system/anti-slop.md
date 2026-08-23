# Gate anti-slop — 9 check binari contro l'"AI slop"

Questo file viene letto dall'agente quando rivede o scrive una UI. Il suo compito è segnalare i pattern di default che fanno sembrare un design generato da una AI (`AI slop`) e forzare una scelta intenzionale. Solo istruzioni — nessun codice qui.

## Come funziona il gate

Ai 9 check è associata un'etichetta dedicata. Ogni check è **binario**: il pattern è o **presente**, o **assente**. Per ciascuno l'agente segnala:

- **FAIL** — il pattern è presente **e senza giustificazione dal brief**. È il caso da evitare: un default di maniera comparso perché è ciò che esce fuori spontaneamente, non perché il progetto lo richieda.
- **PASS** — il pattern è assente, **oppure** il brief del progetto lo richiede **esplicitamente** (il default AI è da evitare *a meno che* il brief non lo chieda).

La regola è netta: i default AI sono vietati per impostazione predefinita. Un check passa solo se il pattern non c'è, o se c'è una ragione esplicita nel brief. Quando segnali un FAIL, cita il punto del brief (o la sua assenza) che rende ingiustificato il pattern.

## I 9 check

### C1 — Gradient viola/blu di default come singolo elemento di branding
Presente quando la UI usa un gradient viola→blu (o un analogo arcobaleno standard) come unico segno distintivo del brand. **FAIL** se il gradient c'è ma il brief non chiede esplicitamente quel tipo di branding. **PASS** se il brief prevede una palette di brand intenzionale che include il gradient, o se il gradient è assente.

### C2 — Icone emoji generiche usate come icone di feature
Presente quando le emoji (🔥, ✨, 🚀, ecc.) vengono usate al posto di vere icone di feature. **FAIL** se le emoji compaiono senza che il brief le richieda. **PASS** se il brief le prevede volutamente per un tono specifico, o se le icone di feature sono reali (non emoji).

### C3 — SVG umani disegnati a mano (illustrazioni frizzanti senza motivo)
Presente quando compaiono illustrazioni disegnate a mano (pettinature, visi stilizzati, briciole di gioia) prive di uno scopo nel design. **FAIL** se l'illustrazione c'è ma il brief non la motiva. **PASS** se il brief richiede illustrazioni con ruolo definito, o se non ci sono illustrazioni.

### C4 — `Inter` (o le system-font di default) usata come display/heading face senza scelta intenzionale
Presente quando la typeface di display/heading è `Inter` (o un system font) perché è la scelta di default, non una decisione. **FAIL** se la display face è di default e il brief non la seleziona quasi. **PASS** se il brief sceglie esplicitamente `Inter` (o la system-font) come display/heading face, o se la display face è un'altra, scelta volontariamente.

### C5 — Metrica/falsa statistica inventata per riempire
Presente quando compaiono numeri che sembrano prova sociale o dati (es. "1M+ users") senza fonte. **FAIL** se la metrica è inventata e il brief non prevede dati reali con fonte. **PASS** se il brief chiede quella statistica e la fonte è fornita, o se la metrica è assente.

### C6 — Numerazione `01 / 02 / 03` usata dove il contenuto non è una sequenza reale
Presente quando le sezioni vengono prefissate con una numerazione decorativa che non corrisponde a un ordine o a un processo reale. **FAIL** se la numerazione è puramente estetica e il brief non la motiva come sequenza. **PASS** se il contenuto è davvero una sequenza (step, passi, fasi) e il brief la richiede, o se la numerazione è assente.

### C7 — Card con ombra morbida uniforme e bordi arrotondati identici (layout "solido default")
Presente quando l'interfaccia è fatta di card tutte uguali: stessa ombra soft, stesso radius, in una griglia indistinta. **FAIL** se il layout è così uniforme e il brief non lo richiede. **PASS** se il brief prevede un sistema di card con una gerarchia o una differenziazione voluta, o se le card non sono presenti.

### C8 — Troppe animazioni/scroll-trigger scatter compatte per effetto
Presente quando le animazioni e gli scroll-trigger sono sparsi ovunque senza una ragione comunicativa, soltanto per dare "vita" alla pagina. **FAIL** se le animazioni sono eccessive e il brief non le richiede. **PASS** se il brief prevede animazioni con scopo definito, o se l'animazione è contenuta/assente.

### C9 — CTA viola/indaco con glow e testo bianco semibold (pattern `signup` di default)
Presente quando la CTA principale è viola/indaco, con un glow e testo bianco semibold — il classico bottone "Sign up" di default. **FAIL** se c'è il pattern `signup` e il brief non lo richiede. **PASS** se il brief prevede esplicitamente una CTA con quel trattamento, o se la CTA segue i token del DESIGN.md senza glow di default.

## Uso del gate

Quando rivedi o scrivi una UI, passa in rassegna i 9 check nel contesto del DESIGN.md e del brief del progetto. Per ogni check annota **FAIL** o **PASS** con una riga di motivazione. Il gate è valido solo se i token del DESIGN.md (colori, tipografia, radius, spaziature) vengono rispettati: un FAIL su questi 9 pattern indica che la UI sta derapando verso il default AI invece che verso la direzione estetica scelta.
