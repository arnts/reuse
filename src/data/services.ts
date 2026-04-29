export interface Service {
  id: string;
  title: string;
  audienceId: 'pedagoger' | 'familier' | 'bedrifter' | 'fellesskap';
  summary: string;
  description: string;
  forWhom: string;
  format: string;
  takeaway: string;
  /** Vises som "mest etterspurt" på forsiden */
  featured?: boolean;
  image: string;
  imageAlt: string;
}

export const services: Service[] = [
  // PEDAGOGER OG INSTITUSJONER
  {
    id: 'kurs',
    title: 'Kurs i skapende gjenbruk',
    audienceId: 'pedagoger',
    summary: 'Praksisnære kurs på kveldstid og i helger for barnehager og skoler.',
    description:
      'Vi deler verktøy og metoder fra Reggio Emilia-tradisjonen og vår egen praksis. Deltakerne får erfaring med hvordan gjenbruksmaterialer kan brukes som demokratisk materiale i pedagogisk arbeid — ikke som dekorasjon, men som inngang til kritisk og kreativ tenkning.',
    forWhom: 'Pedagoger, lærere, fagledere',
    format: 'Kveld eller helg · 3–6 timer · gruppe',
    takeaway:
      'Konkrete metoder og praktisk erfaring som kan tas rett tilbake til arbeidshverdagen.',
    featured: true,
    image: '/images/services/kurs.svg',
    imageAlt: 'Pedagoger i workshop rundt et bord med materialer.',
  },
  {
    id: 'pedagogveiledning',
    title: 'Veiledning av pedagoger',
    audienceId: 'pedagoger',
    summary: 'Faglig veiledning for personalet hos dere — eller hos oss.',
    description:
      'Vi kommer til dere, eller dere kommer til atelieret. Sammen reflekterer vi rundt praksis, prosjekter og hvordan estetiske prosesser kan løftes i hverdagen. Skreddersys etter avdelingens eller skolens behov.',
    forWhom: 'Personalgrupper, ledere, prosjektgrupper',
    format: 'Skreddersys · 2–4 timer eller serie',
    takeaway:
      'Felles språk for å snakke om estetiske prosesser, og konkrete neste steg.',
    image: '/images/services/veiledning.svg',
    imageAlt: 'Samtale rundt arbeidsmappe og dokumentasjon.',
  },
  {
    id: 'studiebesok',
    title: 'Studiebesøk',
    audienceId: 'pedagoger',
    summary: 'Besøk atelieret og se filosofien i praksis.',
    description:
      'Få omvisning, dialog og en aktiv prosess i atelieret. Studiebesøket gir innsikt i hvordan rom, materialer og pedagogikk kan henge sammen. Egnet for fagdag, etterutdanning eller studieturer.',
    forWhom: 'Barnehager, skoler, fagmiljø, utdanningsinstitusjoner',
    format: 'Halvdag eller heldag · gruppe',
    takeaway: 'Erfaring av et atelier som læringsrom — ikke bare en idé.',
    image: '/images/services/studiebesok.svg',
    imageAlt: 'Atelierrom med materialer i hyller og arbeidsbord.',
  },
  {
    id: 'foredrag',
    title: 'Skreddersydde foredrag',
    audienceId: 'pedagoger',
    summary: 'Foredrag om estetiske prosesser, gjenbruk og demokratiske materialer.',
    description:
      'Vi holder foredrag tilpasset deres kontekst — fra korte innlegg på personalmøter til lengre keynotes på fagdager og konferanser. Vi snakker fra erfaring i barnehagefeltet og fra Atelierista-utdanningen i Stockholm.',
    forWhom: 'Konferanser, fagdager, personalmøter',
    format: '30 min – 2 timer · skreddersys',
    takeaway: 'Inspirasjon med faglig substans, og noe å ta med tilbake.',
    image: '/images/services/foredrag.svg',
    imageAlt: 'Foredragsholder foran lyttende publikum.',
  },

  // BARN OG FAMILIER
  {
    id: 'bursdager',
    title: 'Kreative bursdager',
    audienceId: 'familier',
    summary: 'Bursdagsfeiring som er like minneverdig som meningsfull.',
    description:
      'Vi tilrettelegger en bursdagsopplevelse hvor barna utforsker, leker og skaper med gjenbruksmaterialer. Ulike pakker tilpasset alder og tema — alltid med rom for at hver enkelt finner sin vei inn i materialene.',
    forWhom: 'Barn fra ca. 4 år · 6–15 deltakere',
    format: '2 timer · etter avtale',
    takeaway:
      'En bursdag barna husker, og en pause fra skjermer for foreldre og venner.',
    featured: true,
    image: '/images/services/bursdag.svg',
    imageAlt: 'Bursdagsbord med kreative materialer og barnehender.',
  },
  {
    id: 'workshops',
    title: 'Workshops for barn og unge',
    audienceId: 'familier',
    summary: 'Skapende verksted hvor materialene leder veien.',
    description:
      'Tematiske workshops på kveldstid og i helger. Barn og unge eksperimenterer fritt med gjenbruksmaterialer — uten regler for «riktig» bruk. Vi rammer inn, men prosessen er deres.',
    forWhom: 'Barn og unge i ulike aldersgrupper',
    format: '1,5–3 timer · enkeltdager eller serier',
    takeaway: 'Mestring, lek og opplevelsen av å være sin egen skaper.',
    image: '/images/services/workshop.svg',
    imageAlt: 'Barn arbeider konsentrert med ulike materialer.',
  },
  {
    id: 'lek-og-utforskning',
    title: 'Lek og utforskning',
    audienceId: 'familier',
    summary: 'Åpen lek i et rikt og inspirerende rom.',
    description:
      'Drop-in-tider hvor barn og foreldre kan komme for å utforske materialer sammen, uten et fastlagt program. Et frirom fra hverdagens rytme.',
    forWhom: 'Barn med foreldre eller besteforeldre',
    format: 'Drop-in · planlagte tider',
    takeaway: 'Ro, nærvær og felles opplevelser.',
    image: '/images/services/lek.svg',
    imageAlt: 'Barn og voksen utforsker naturmaterialer.',
  },

  // BEDRIFTER OG TEAM
  {
    id: 'teambuilding',
    title: 'Teambuilding for bedrifter',
    audienceId: 'bedrifter',
    summary: 'Samarbeid og kreativitet — uten klisjeer.',
    description:
      'En meningsfull pause fra møterommet. Teamet jobber sammen rundt en skapende oppgave med gjenbruksmaterialer. Det blir både morsomt og overraskende — og åpner samtaler dere ikke får i et vanlig seminar.',
    forWhom: 'Team og avdelinger · 6–25 deltakere',
    format: '2–4 timer · skreddersys',
    takeaway:
      'Ny innsikt i hverandre, samtaler som tar med seg verdier som mot, lytting og samspill.',
    featured: true,
    image: '/images/services/teambuilding.svg',
    imageAlt: 'Kollegaer arbeider sammen rundt en kreativ oppgave.',
  },
  {
    id: 'baerekraftsworkshops',
    title: 'Bærekraftsworkshops',
    audienceId: 'bedrifter',
    summary: 'Bærekraftsdialog satt i hendene.',
    description:
      'Når dere skal jobbe med bærekraft, sirkulær økonomi eller verdier — la samtalen begynne i en konkret skapende oppgave. Vi kobler innhold til kreativ praksis slik at refleksjonen sitter i kroppen, ikke bare i en PowerPoint.',
    forWhom: 'Organisasjoner, prosjektgrupper, ledergrupper',
    format: 'Halvdag · skreddersys',
    takeaway: 'Verdiarbeid med erfaring og minne.',
    image: '/images/services/baerekraft.svg',
    imageAlt: 'Hender sorterer og arbeider med gjenbruksmaterialer.',
  },

  // FELLESSKAP OG MØTEPLASS
  {
    id: 'apne-arrangementer',
    title: 'Åpne arrangementer',
    audienceId: 'fellesskap',
    summary: 'Drop-in og åpne kvelder for alle.',
    description:
      'Et lavterskel møtested for de som ønsker å være kreative i fellesskap. Ingen forkunnskaper, ingen prestasjon — bare materialer, mennesker og tid. Følg med på Instagram for kommende arrangementer.',
    forWhom: 'Voksne, ungdom, alle aldre',
    format: 'Kvelder · pågår 2–3 timer',
    takeaway: 'Tilhørighet, nye bekjentskap og ro fra det digitale.',
    image: '/images/services/apne.svg',
    imageAlt: 'Mennesker i ulike aldre samlet rundt et felles arbeidsbord.',
  },
  {
    id: 'kveldskurs',
    title: 'Kveldskurs som tilhørighet',
    audienceId: 'fellesskap',
    summary: 'Faste kveldskurs som rytme i hverdagen.',
    description:
      'Korte kursserier hvor du kommer tilbake og kjenner igjen folk fra forrige gang. For deg som ønsker både skaperglede og en jevnlig møteplass.',
    forWhom: 'Voksne · serier på 4–6 kvelder',
    format: 'En kveld i uken · gruppe',
    takeaway: 'Skaperglede og et nytt fellesskap.',
    image: '/images/services/kveldskurs.svg',
    imageAlt: 'Kveldsstemning rundt et arbeidsbord med lykter.',
  },
];

export const featuredServices = services.filter((s) => s.featured);

export const servicesByAudience = (audienceId: Service['audienceId']) =>
  services.filter((s) => s.audienceId === audienceId);

export const serviceById = (id: string) => services.find((s) => s.id === id);
