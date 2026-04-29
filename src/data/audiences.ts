export interface Audience {
  id: 'pedagoger' | 'familier' | 'bedrifter' | 'fellesskap';
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  serviceIds: string[];
  /** Forhåndsutfyller "Type henvendelse" i kontaktskjemaet */
  contactType: 'pedagog' | 'privat' | 'virksomhet' | 'annet';
}

export const audiences: Audience[] = [
  {
    id: 'pedagoger',
    title: 'Pedagoger og institusjoner',
    shortTitle: 'Pedagoger',
    tagline: 'Faglig påfyll forankret i Reggio Emilia.',
    description:
      'Kurs, veiledning og foredrag for barnehager, skoler og fagmiljø som ønsker å utvikle praksisen med estetiske prosesser og gjenbruksmaterialer.',
    image: '/images/audiences/pedagoger.svg',
    imageAlt: 'Voksen og barn utforsker materialer ved et arbeidsbord.',
    serviceIds: ['kurs', 'pedagogveiledning', 'studiebesok', 'foredrag'],
    contactType: 'pedagog',
  },
  {
    id: 'familier',
    title: 'Barn og familier',
    shortTitle: 'Familier',
    tagline: 'Skapende opplevelser uten skjerm.',
    description:
      'Bursdager, workshops og åpen utforskning for barn og unge — meningsfulle stunder hvor hender, tanker og kropp jobber sammen.',
    image: '/images/audiences/familier.svg',
    imageAlt: 'Barn samler og bygger med naturmaterialer.',
    serviceIds: ['bursdager', 'workshops', 'lek-og-utforskning'],
    contactType: 'privat',
  },
  {
    id: 'bedrifter',
    title: 'Bedrifter og organisasjoner',
    shortTitle: 'Bedrifter',
    tagline: 'Teambuilding med substans og bærekraft.',
    description:
      'Skreddersydde workshops som kobler kreativitet, samarbeid og gjenbruk — alternativ til standard teambuilding.',
    image: '/images/audiences/bedrifter.svg',
    imageAlt: 'Voksne i samspill rundt skapende oppgave.',
    serviceIds: ['teambuilding', 'baerekraftsworkshops'],
    contactType: 'virksomhet',
  },
  {
    id: 'fellesskap',
    title: 'Fellesskap og møteplass',
    shortTitle: 'Fellesskap',
    tagline: 'Et åpent rom for tilhørighet.',
    description:
      'Drop-in og åpne arrangementer for alle som ønsker et frirom fra det digitale, knytte nye bekjentskap eller bare skape sammen.',
    image: '/images/audiences/fellesskap.svg',
    imageAlt: 'Hender som arbeider sammen rundt et bord.',
    serviceIds: ['apne-arrangementer', 'kveldskurs'],
    contactType: 'annet',
  },
];

export const audienceById = (id: Audience['id']) => audiences.find((a) => a.id === id);
