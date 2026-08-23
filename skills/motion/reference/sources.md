# Fonti web di riferimento per il motion

Lo scopo di questo file è dare all'agente una **lista di fonti affidabili e aggiornate** a cui agganciarsi per studiare esempi, tecniche e tendenze del motion, invece di inventare pattern. Versione 2026.

## Come usare questo file

- Prima di coreografare, consulta `motion-catalog.md` per i pattern già raccolti (con timing e archetipo).
- Se ti serve un esempio nuovo o una tendenza aggiornata, **vai alle fonti qui sotto**.
- Per ogni fonte è indicato **cosa cercare** e la **tipologia** (esempio live, snippet di codice, doc/teoria).
- Le fonti cambiano URL nel tempo: se un link non risponde, cerca il nome su Google senza fidarti dell'URL come valore eterno.

## Fonti primarie (per codice ed esempi pronti)

### Motion.dev — examples
- **URL:** `https://motion.dev/examples`
- **Tipologia:** snippet di codice (React, JS, Vue) pronti all'uso.
- **Cosa cercare:** micro-interazioni, pannelli, route transition, gestione spring e `prefers-reduced-motion`. È la versione open del Motion AI Kit: i pezzi sono pullabili, non solo ispirativi.
- **Note:** Motion è il default React 2026 (npm `motion`, import `from 'motion/react'`). Pack ~45KB gzip.

### Motion.dev — docs
- **URL:** `https://motion.dev/docs`
- **Tipologia:** documentazione tecnica.
- **Cosa cercare:** API spring (`BOUNCY`/`SNAPPY`/`GENTLE`/`NO_BOUNCE`), tween easing, `useTransform`, layout, `whileInView`, accessibilità.
- **Note:** espone un MotionScore per auditare performance (code + runtime). Ottimo per capire i trade-off.

### GSAP — home + tutorial ScrollTrigger
- **URL:** `https://gsap.com` (tutorial/pages generati da `gsap.com/tutorials`)
- **Tipologia:** doc + demo + tutorial.
- **Cosa cercare:** timeline complesse, scroll choreography per marketing page, `ScrollTrigger`, `ScrollSmoother`.
- **Note:** **100% free commercial dal 30 aprile 2025** (Webflow ha acquisito GreenSock; i plugin Club — SplitText/MorphSVG/ScrollSmoother/DrawSVG — sono ora gratuiti). Core ~27KB gzip. Per la "choreography" di stile award.

### LottieFiles — featured
- **URL:** `https://lottiefiles.com/featured`
- **Tipologia:** animazioni vettoriali pre-renderizzate (JSON).
- **Cosa cercare:** loader, success/empty state, onboarding, illustrazioni animate. Ottimo quando serve un file `.json` riproducibile, non codice runtime.
- **Note:** Lottie è pre-renderizzato; **Rive** è l'alternativa interattiva runtime (hover/scroll/validazione). Scegli Lottie per asset fissi, Rive per reattivi.

## Fonti per ispirazione (design reali)

### Muzli — motion design
- **URL:** `https://muz.li/inspiration/motion-design`
- **Tipologia:** raccolta di ispirazione aggiornata.
- **Cosa cercare:** micro-interazioni e transizioni dalla committenza reale. Aggiornato con cadenza regolare.

### Refs — motion gallery
- **URL:** `https://refs.gallery/category/motion`
- **Tipologia:** galleria siti selezionati.
- **Cosa cercare:** siti chiave con motion d'alta qualità, con focus sulla regia (timing/staging).

### Godly
- **URL:** `https://godly.website`
- **Tipologia:** gallery di siti eccellenti.
- **Cosa cercare:** riprova d'insieme del motion in contesto full-page, non solo il singolo elemento.

### Motionographer
- **URL:** `https://motionographer.com`
- **Tipologia:** giornalismo/studio (reference professionale).
- **Cosa cercare:** staging, timing, gestione dei "fotogrammi chiave" e micro-polish. Più teoria che snippet: utile per capire il perché.

### Awwwards — collection animation
- **URL:** `https://www.awwwards.com/websites/animation/` (spesso ce ne sono versioni raccolte)
- **Tipologia:** award + ispirazione.
- **Cosa cercare:** il livello qualitativo più alto; utile per alzare l'asticella della "coreografia".

### 60fps.design
- **URL:** `https://60fps.design`
- **Tipologia:** app / reference di micro-interazioni.
- **Cosa cercare:** micro-interazioni mobile/web con dettaglio sul frame-rate e sul feel; forte sull'aspetto "fisico" del movimento.

## Fonti generali (tendenze 2026 / meglio non dimenticare)

### The Trends / blog motion 2026
- **URL:** `https://www.envato.com/blog/` (sezione motion/graphic trends), e blog come `motionkit.io`, `mantlr.com`.
- **Tipologia:** tendenze di settore, articoli.
- **Cosa cercare:** evoluzione dello stile grafico/motion nell'anno. Utile per il catalogo auto-aggiornante (`/motion-refresh`).
- **Nota di prudenza:** "well-designed motion improves comprehension; **aggressive motion still hurts**". Non seguire una tendenza solo perché è di moda.

### Style/tecnica importante (non una fonte ma un promemoria)
- **View Transitions API** — transizioni di pagina/route native, ormai ampiamente supportate.
- **`prefers-reduced-motion`** — supportato bene: puoi ship motion riducendolo senza rischi a11y, se rispetti la preferenza.
- **CSS scroll-driven animations** — `animation-timeline: scroll()`, `@starting-style`: consentono animazioni senza JS in tutti i browser.

## Come evitare "reference rot"

- Non copiare URL lunghissimi o pagine deep-branded: preferisci le home delle fonti qui sopra.
- Verifica sempre che il pattern sia ancora mantenuto: Motion/GSAP/Lottie/Rive cambiano API.
- Per il codice, preferisci i snippet da `motion.dev`/`gsap.com` (mantenuti) a screenshot vecchi.

## Aggiornamento automatico del catalogo

- La fonte di verità ragionata è **`motion-catalog.md`** (leggibile, con timing/easing/archetipo).
- Il file **`scripts/data/motion-reference.json`** è la versione strutturata generata a runtime — NON si modifica a mano e non è versionato (ignorato via `.gitignore`).
- Per rigenerarlo dopo un cambio di seed o nuove fonti, esegui:

```
cd scripts && node motion-refresh.js
```

- Lo script prova a contattare le fonti in `scripts/motion-refresh.js` (`SOURCES`, best-effort: una fonte che fallisce non blocca le altre). Se non riesce a estrarre pattern (es. rete assente o fonte che non espone JSON), ripiega su un **seed curato** — il catalogo non è mai vuoto.
- Le fonti attuali non espongono JSON strutturato, quindi il fetch live realizza oggi una lista limitata e "seed + best-effort". Per fonti con dati strutturati (es. API/JSON), aggiungi un estrattore in `parseSourceBody` e una voce in `SOURCES`.
