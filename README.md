# REuse Atelier

Konverteringsdrevet nettside for et kreativt gjenbruksatelier i Oslo.

> **Migrering pågår:** Nettsiden migreres fra en statisk Astro-side (GitHub Pages)
> til et **Shopify Online Store 2.0**-tema. Begge kildene ligger foreløpig side om
> side i dette repoet. Astro-kilden (`src/`, `public/`) er original; Shopify-temaet
> (`layout/`, `sections/`, `templates/`, `snippets/`, `assets/`, `config/`, `locales/`)
> er migreringsmålet. Se **[Shopify-tema](#shopify-tema-online-store-20)** nedenfor.

## Utvikling (Astro – opprinnelig side)

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # ./dist
npm run preview
```

## Deploy

Sider deployes automatisk til GitHub Pages via `.github/workflows/deploy.yml` ved push til `main`.

### Oppsett før første deploy

1. Gå til repo-innstillinger på GitHub → **Pages** → **Source**: velg **GitHub Actions**.
2. Sett `Settings → Secrets and variables → Actions → Variables`:
   - `SITE_URL` — full URL siden vil ligge på (f.eks. `https://brukernavn.github.io` eller eget domene)
   - `BASE_PATH` — base-path (f.eks. `/reuse-atelier` for GitHub Pages uten eget domene, `/` for eget domene)

### Når eget domene er kjøpt

1. Legg en `CNAME`-fil i `public/` med domenenavnet (f.eks. `reuse-atelier.no`).
2. Oppdater `SITE_URL`-variabelen til domenet og sett `BASE_PATH` til `/`.
3. Konfigurer DNS hos domeneleverandør i tråd med [GitHub Pages-dokumentasjon](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Skjema (Formspree)

Kontaktskjemaet bruker Formspree. Før første deploy:

1. Opprett konto på [formspree.io](https://formspree.io) og lag et nytt skjema.
2. Sett miljøvariabelen `PUBLIC_FORMSPREE_ENDPOINT` (eller GitHub Actions-variabel) til endpoint-URL-en (f.eks. `https://formspree.io/f/xyzabcde`).
3. Lokalt: legg den i `.env`-filen.

## Innholdsoppdatering

- **Tjenester:** `src/data/services.ts`
- **Målgrupper:** `src/data/audiences.ts`
- **Bilder:** `public/images/` (plassholdere ligger der nå — bytt med ekte bilder)

## Struktur

```
src/
├── layouts/BaseLayout.astro       # SEO/meta/JSON-LD
├── components/
│   ├── layout/                    # Header, Footer
│   ├── primitives/                # Button, Section, Eyebrow
│   ├── conversion/                # CTABanner, ContactForm, *Card
│   ├── trust/                     # TeamCard, CredentialsStrip, Quote
│   ├── hero/                      # HeroHome, HeroPage
│   └── media/                     # Gallery, Lightbox
├── pages/                         # index, tilbud, om, kontakt
├── data/                          # services, audiences
└── styles/global.css              # designtokens
```

---

## Shopify-tema (Online Store 2.0)

Fase 1 av migreringen: samme side, ny plattform. Forsiden er gjenskapt som
modulære Liquid-seksjoner med redigerbart innhold, uten redesign og uenda
uten handelsfunksjonalitet (kurs/betaling kommer i fase 2).

### Forutsetninger

- **Node.js** 18+ (testet på v22). Bruk gjerne `nvm`.
- **Shopify CLI** – installert lokalt i repoet (ingen global installasjon nødvendig):

  ```bash
  npm install --no-save @shopify/cli @shopify/theme
  ```

  Alle kommandoer under kjøres som `./node_modules/.bin/shopify …`
  (eller `npx shopify …`).

- En **Shopify-butikk** (utvikler- eller Partner-butikk) for `theme dev`/preview.

### Lokal utvikling og forhåndsvisning

```bash
# Start lokal utviklingsserver med live reload (krever innlogging i en butikk)
./node_modules/.bin/shopify theme dev --store <din-butikk>.myshopify.com

# Kjør Theme Check (statisk validering)
./node_modules/.bin/shopify theme check

# Last opp temaet som et ulagret/utviklingstema
./node_modules/.bin/shopify theme push --unpublished
```

Første gang `theme dev` kjøres åpnes en nettleser for innlogging og valg av
butikk. Serveren gir en lokal URL (typisk `http://127.0.0.1:9292`) og en
delbar preview-URL.

### Validering

Fase 1 er ferdig når:

- `./node_modules/.bin/shopify theme check` gir **ingen blokkerende feil**
  (kun ikke-blokkerende `RemoteAsset`-advarsler for Google Fonts, se under).
- `shopify theme dev` starter uten feil og uten konsollfeil i nettleseren.
- Forsiden matcher Astro-siden på desktop og mobil.
- Kontaktskjemaet fungerer **uten JavaScript**.

### Struktur (Shopify)

```
layout/theme.liquid            # <head>, meta/OG, fonter, seksjonsgrupper, JSON-LD
templates/
├── index.json                 # Forsidens seksjonsrekkefølge + standardinnhold
├── product.course.json        # Plassholder (fase 2)
└── collection.courses.json    # Plassholder (fase 2)
sections/
├── header-group.json          # Global header (seksjonsgruppe)
├── footer-group.json          # Global footer (seksjonsgruppe)
├── reuse-header / -footer     # Header/footer-seksjoner
├── reuse-hero                 # Hero
├── reuse-introduction         # «Hva er REuse Atelier»
├── reuse-audiences            # «Hvem skaper vi for»
├── reuse-offerings            # «Mest etterspurte tilbud»
├── reuse-approach             # «Hvorfor skapende gjenbruk virker»
├── reuse-founders             # «Menneskene bak»
├── reuse-gallery              # «Atmosfære» + lightbox
├── reuse-credentials          # «Faglig troverdighet»
├── reuse-contact              # Native Shopify-kontaktskjema
├── featured-courses           # Plassholder-slot for kurs (fase 2, av som standard)
├── main-course-product        # Plassholder (fase 2)
└── main-course-collection     # Plassholder (fase 2)
snippets/
├── editorial-image.liquid     # Responsiv bilderendering (image_url/image_tag)
├── lightbox.liquid            # Delt lightbox-markup
└── course-card.liquid         # Plassholder (fase 2)
assets/
├── reuse.css                  # Alle designtokens + komponentstiler
├── reuse.js                   # Idempotent JS (fade-in, header, lightbox, skjema-prefill)
└── *.jpg / *.svg              # Migrerte reservebilder
config/
├── settings_schema.json       # Temainnstillinger
└── settings_data.json         # Genereres av butikken (se under)
locales/
├── en.default.json            # Standard storefront-strenger
└── nb.json                    # Norsk (bokmål)
```

### Redigere innhold

Alt meningsfylt innhold (tekst, bilder, lenker, CTA-etiketter) er redigerbart via
**Shopify Theme Editor** (Nettbutikk → Temaer → Tilpass). Hver seksjon eksponerer
innstillinger og blokker; header/footer redigeres via seksjonsgrupper. Bilder kan
byttes med `image_picker` – de medfølgende `assets/`-bildene er kun
migrerings­reserver.

### Navigasjon i toppteksten (ankerlenker til forsiden)

Ankerlenkene i toppteksten (f.eks. `#tilbud`, `#team`) styres **uavhengig** av
forsidens seksjoner. Shopify Liquid kan ikke inspisere om en seksjon i en annen
mal (`templates/index.json`) er aktivert, så toppteksten kan ikke oppdage dette
automatisk. Hver navigasjonslenke har derfor en **«Vis lenken»**-avkrysning i
Theme Editor (standard på).

Når en forside­seksjon skjules, fjernes eller får nytt anker: **slå av eller
oppdater den tilsvarende navigasjonsblokken** i toppteksten, slik at menyen
aldri peker til en seksjon som ikke finnes.

### Kontaktskjema (native, fungerer uten JavaScript)

Skjemaet i `reuse-contact.liquid` bruker Shopifys native `{% form 'contact' %}`.
Shopifys egen innsending, validering, suksess- og feilhåndtering er kilden til
sannhet (`form.posted_successfully?` og `form.errors`), gjengitt server-side.
JavaScript brukes kun til progressiv forbedring (forhåndsutfylling fra URL-parametre)
og avbryter aldri innsendingen. Skjemaet fungerer fullt ut med JavaScript deaktivert.
Skjemainnsendinger havner i butikkens varsler (Innstillinger → Varsler → Kundekontakt).

### Fonter og personvern

Temaet laster **Fraunces** og **Inter** fra **Google Fonts** via `<link>` i
`theme.liquid` (kun vektene som faktisk brukes). Google Fonts innebærer en
tredjeparts­forespørsel som eksponerer besøkerens IP-adresse for Google. Theme Check
flagger dette som en ikke-blokkerende `RemoteAsset`-advarsel. For bedre ytelse og
personvern kan fontene på sikt **selv-hostes** i `assets/` og lastes via `@font-face`
(`font_url`). Dette er dokumentert som et fremtidig tiltak, ikke en del av fase 1.

### `settings_data.json` og GitHub-synk

`config/settings_data.json` **genereres og skrives om av butikken**. Behandle den som
konfigurasjon, ikke håndredigert kilde: hver endring i Theme Editor skriver den om, og
Shopifys **GitHub-integrasjon toveis-synkroniserer** filen. Unngå å redigere den
manuelt i git samtidig som butikken redigerer den – det gir synk-konflikter. Ved
tilkobling av repoet til en butikk (Nettbutikk → Temaer → Legg til fra GitHub) blir
temaets innhold og `settings_data.json` holdt i synk automatisk.

### Bilder / responsiv rendering

Redaksjonelle bilder rendres med Shopify-native hjelpere (`image_url` + `image_tag`)
med responsive bredder/`srcset`, eksplisitte `width`/`height` og bevart sideforhold.
Hero-bildet lastes ivrig (`loading: eager`, `fetchpriority: high`); bilder under
brettet lastes lat (`loading: lazy`).

### Fase 2 (ikke implementert)

Handelsfilene (`featured-courses`, `main-course-product`, `main-course-collection`,
`course-card`, `product.course.json`, `collection.courses.json`) er **kun gyldig
stillas** uten handelsatferd. Fase 2 legger til kurs som produkter med
handlekurv/kasse, varianter, beholdning/plasser og betaling.
