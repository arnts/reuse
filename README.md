# REuse Atelier

Konverteringsdrevet nettside for et kreativt gjenbruksatelier i Oslo. Bygget med Astro, deployes statisk til GitHub Pages.

## Utvikling

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
