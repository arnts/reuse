# REuse Atelier

Nettbutikk og nettside for et kreativt gjenbruksatelier i Oslo, bygget som et
**Shopify Online Store 2.0**-tema. Siden presenterer atelieret og selger
fysiske kurs gjennom Shopifys native handlekurv og kasse.

Dokumentasjonen er delt i to arbeidsflyter:

1. **[Drift og innhold](#1-drift-og-innhold-butikkadministrator)** – for butikkadministratorer
2. **[Videreutvikling](#2-videreutvikling-utvikler)** – for utviklere

**Kort sagt:**

- **Innhold, kurs, produkter, samlinger, navigasjon, priser og publisering** styres i **Shopify Admin**.
- **Kodeendringer** (seksjoner, stil, oppførsel) gjøres i **GitHub** med lokal **Shopify CLI**.

---

## 1. Drift og innhold (butikkadministrator)

Alt daglig innhold redigeres i **Shopify Admin** – ingen kode nødvendig.

### Legge til eller endre et kurs (produkt)

Ett **produkt = én kursdato** (ikke bruk varianter for datoer).

1. **Produkter → Legg til produkt.**
2. Sett **tittel** (kursnavn), **beskrivelse**, **bilde** og **pris**.
3. **Lager = antall plasser.** Slå **på** lagersporing og **av**
   «Fortsett å selge når utsolgt», slik at lager 0 gir **«Utsolgt»** og stenger kjøp.
4. Velg temamal **`product.course`** (høyre kolonne → Tema-mal).
5. Fyll ut kursfeltene under **Metafelt**. Bare `course.date` er påkrevd; tomme
   felt skjules automatisk.

| Metafelt | Type | Bruk |
|---|---|---|
| `course.date` | Dato | Kursdato (påkrevd) |
| `course.start_time` | Én linje tekst | Starttid, f.eks. «17:00» |
| `course.end_time` | Én linje tekst | Sluttid |
| `course.location` | Én linje tekst | Sted |
| `course.audience` | Én linje tekst | Målgruppe |
| `course.practical_info` | Flerlinjes tekst | Praktisk info |
| `course.instructors` | Rik tekst | Kursholder(e) |
| `course.cancellation_policy` | Flerlinjes tekst | Avbestillingsvilkår |

> Metafelt-definisjonene opprettes én gang under
> **Innstillinger → Egendefinerte data → Produkter** (namespace/nøkkel `course.<key>`).

### Legge kurset i «Kommende kurs»-samlingen

Forsiden og kurssiden viser produkter fra samlingen **Kommende kurs**.

1. **Produkter → Samlinger → Kommende kurs.**
2. **Legg produktet til** når det er klart for salg.
3. **Sorter manuelt** etter kursdato.
4. **Fjern produktet** etter at kurset er gjennomført.

### Oppdatere navigasjonen

Toppmenyen redigeres i Theme Editor (**Nettbutikk → Temaer → Tilpass** → topptekst).

- Ankerlenker til forsiden (f.eks. `#tilbud`) har en **«Vis lenken»**-avkrysning.
- Skjuler eller fjerner du en forsideseksjon, **slå av eller oppdater** den
  tilsvarende lenken, slik at menyen aldri peker til noe som ikke finnes.

### Redigere forsideinnhold

I **Theme Editor** kan du endre all tekst, bilder, lenker og CTA-etiketter per
seksjon, og skru seksjoner av/på. Header og footer redigeres via seksjonsgrupper.

### Forhåndsvise endringer

I Theme Editor: bruk **Forhåndsvis** før du lagrer/publiserer. Du kan også dele en
forhåndsvisningslenke fra temaoversikten uten å publisere.

### Publisere et tema

**Nettbutikk → Temaer**, finn temaet og velg **Handlinger → Publiser**. Det
publiserte temaet blir det kundene ser.

> ⚠️ **Viktig:** Innholdsendringer i **Shopify Admin** er *ikke* det samme som
> kodeendringer i **GitHub**. Admin styrer innhold og konfigurasjon; GitHub styrer
> koden. Se **[Viktig arbeidsregel](#viktig-arbeidsregel)**.

---

## 2. Videreutvikling (utvikler)

Kodeendringer gjøres lokalt med Shopify CLI og sendes via GitHub.

### Engangsoppsett

```bash
# Klon repoet
git clone https://github.com/arnts/reuse.git
cd reuse

# Installer Shopify CLI (om nødvendig) – lokalt i repoet
npm install --no-save @shopify/cli @shopify/theme

# Logg inn i Shopify
shopify auth login
```

> Kjør CLI-en som `./node_modules/.bin/shopify …` (eller `npx shopify …`) hvis
> den ikke er global.

### Vanlig arbeidsflyt

```bash
# 1. Lag en feature-branch
git switch -c <branch-name>

# 2. Start lokal utviklingsserver med live reload
shopify theme dev

# 3. Gjør kodeendringer (gjerne med GitHub Copilot)

# 4. Valider
shopify theme check

# 5. Test på desktop og mobil i forhåndsvisningen

# 6. Commit og push
git status
git add .
git commit -m "<message>"
git push -u origin <branch-name>
```

Åpne deretter en **pull request** på GitHub, få den gjennomgått og **merge** til `main`.

### Publisere temaet for forhåndsvisning

Etter merge: send koden til det permanente, upubliserte temaet og forhåndsvis før
eventuell publisering.

```bash
# Send temaet til det permanente, upubliserte temaet
shopify theme push --theme 189736386633
```

Forhåndsvis dette temaet fra temaoversikten **før** du publiserer.

### Pull av Theme Editor-endringer

Har noen redigert innhold/konfigurasjon i Theme Editor, må du **hente ned**
endringene (bl.a. `config/settings_data.json`) før du committer, så du ikke
overskriver dem:

```bash
shopify theme pull --theme 189733732425
```

### Temaroller

- **Horizon** – gjeldende **live-tema** (det kundene ser).
- **Development theme** – midlertidig tema som `shopify theme dev` bruker under lokal utvikling.
- **REuse Atelier custom theme** – permanent **upublisert** tema for forhåndsvisning og testing.

---

## Viktig arbeidsregel

- **Innholdsendringer** hører hjemme i **Shopify Admin**.
- **Kodeendringer** hører hjemme i **GitHub**.
- **Theme Editor-konfigurasjon** kan trenge en `shopify theme pull` før du committer.
- **Forhåndsvis alltid før du publiserer.**
