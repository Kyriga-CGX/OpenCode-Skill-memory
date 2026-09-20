# Design References — fonti per grafica senza "AI slop"

File di riferimento per l'agente: quando serve DIREZIONE ESTETICA, ispirazione, palette, tipografia o pattern UI di qualità, consulta queste fonti invece di inventare o ricadere nei default templated. Usale come riferimento, non come copia pedissequa.

## Gallerie di siti premiati (direzione e layout)

- **https://www.awwwards.com** — giuria professionale, sezioni websites/collections. Filtra per: responsive, UX, interaction. Guarda il "site of the day" per capire cosa eleva un design.
- **https://refs.gallery** — galleria di siti selezionati con focus su regia, timing, art direction.
- **https://godly.website** — gallery di siti eccellenti, organizzata per tratto (typography, layout, color, motion).
- **https://www.land-book.com** — collection di landing page, ottima per struttura hero/sezioni.
- **https://www.siteinspire.com** — gallery filtrata per stile (clean, playful, dark, bold, minimal) e settore.

## Tipografia (scelta font, scale, pairing)

- **https://fontsinuse.com** — font usati in contesti reali (campagne, siti, prodotti) con dettaglio di pairing e scale. Migliore anti-default.
- **https://www.typewolf.com** — font pairing di qualità con esempi live.
- **https://practicaltypography.com** — le regole di composizione tipografica (Butterick). Legge fondamentale contro i template.
- **https://fonts.google.com** — seleziona font con criterio: peso, x-height, spazi. Evita i default sovra-usati.
- https://fontpair.co — pairing rapidi (usa con giudizio).

## Colore (palette deliberate, non gradienti decorativi)

- **https://huemint.com** — generatore di palette con intelligenza (brand, gradient, website), produce combinazioni non banali.
- **https://coolors.co** — generatore/explorer palette (usa con criterio: parti dal subject matter, non dal random).
- **https://color.adobe.com/explore** — palette da comunità, utile per trovare combinazioni armoniche.
- **https://m3.material.io/styles/color** — sistema colore Material 3 (tonal palette, contrasto accessibile). Base solida.
- https://colors.eva.design — palette accessibili generate da un colore primario.

## Design system e principi

- **https://m3.material.io** — Material Design 3 (Google): componenti, spacing, elevation, dark theme.
- **https://developer.apple.com/design/human-interface-guidelines/** — Apple HIG: pattern e accessibilità.
- **https://refactoringui.com** — "Refactoring UI" (libro): regole pratiche anti-slop per layout, colore, tipografia, gerarchia.
- **https://www.designsystems.com** — case study di design system reali.
- **https://www.nngroup.com** — Nielsen Norman Group: usabilità e pattern UX basati su ricerca.

## Motion (rimando alla skill motion)

- La skill `motion` ha il suo catalogo: `motion/reference/sources.md` (motion.dev, gsap.com, lottiefiles.com, awwwards.com/websites/animation/, refs.gallery, godly.website, motionographer.com, 60fps.design) e `motion/reference/motion-catalog.md` con pattern per livello. Consultala per ogni animazione.

## Anti-default (cosa NON fare)

I default AI da evitare (per calibration, vedi anche frontend-design SKILL.md):
- fondo crema caldo (#F4F1EA) + serif display + accento terracotta (#D97757)
- fondo quasi nero + un singolo accento acido (#00FF00) o vermiglio
- layout "broadsheet": regole sottili, raggio 0 ovunque, colonne fitte
- card SaaS identiche: stesso radius ovunque, ombra grigia soft (rgba(0,0,0,.1)) sotto ogni card, gradient wash decorativi
- eyebrow label ALL-CAPS ovunque, meta con "A · B · C", etichette "PAROLA — frammento", #0B0B0B per il nero, mono per le label, "→" su ogni link

## Regole d'uso

- Non copiare interi design: prendi un principio (struttura, palette, trattamento tipografico) e adattalo al brief.
- Se un link non risponde, cerca il nome su Google: gli URL cambiano, le fonti no.
- Prima di usare una fonte, cerca nelle memorie (`mind-memory`) le preferenze utente: se l'utente ha già espresso un gusto, quello vince sulle fonti.