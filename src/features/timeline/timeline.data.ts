/**
 * A phase in the timeline representing a period of time.
 *
 * @property id - Unique phase identifier
 * @property title - Display title for the phase
 * @property dateRange - Human-readable date range (e.g., "2017" or "2017-2021")
 * @property description - Brief description of what happened during this phase
 * @property events - Significant events that occurred in this phase
 * @property color - Tailwind gradient classes for visual styling
 */
export type TimelinePhase = {
  id: string;
  title: string;
  dateRange: string;
  description: string;
  events: TimelineEvent[];
  color: string;
};

/**
 * A significant event within a timeline phase.
 *
 * @property date - Human-readable date of the event
 * @property title - Brief title describing the event
 * @property description - Detailed description of what happened
 * @property importance - Optional severity indicator for visual emphasis
 */
export type TimelineEvent = {
  date: string;
  title: string;
  description: string;
  importance?: 'low' | 'medium' | 'high' | 'critical';
};

/**
 * An analytical discovery or pattern identified in the timeline.
 *
 * @property id - Unique discovery identifier
 * @property number - Sequential discovery number for ordering
 * @property title - Discovery title
 * @property emoji - Icon emoji for visual identification
 * @property description - Brief summary of the discovery
 * @property details - Array of detailed points explaining the discovery
 * @property color - Tailwind gradient classes for visual styling
 */
export type TimelineDiscovery = {
  id: string;
  number: number;
  title: string;
  emoji: string;
  description: string;
  details: string[];
  color: string;
};

/**
 * Complete timeline of events across five major phases.
 *
 * Chronologically organized phases:
 * 1. FAZA I: Fundament (2017) - Symbolic beginning with gift deed
 * 2. Okres Spokoju (2017-2021) - Four years of calm
 * 3. FAZA II: Katalizator (Feb 2021) - Operation Calendar begins
 * 4. FAZA III: Eskalacja (Mar-Jul 2021) - Precisely planned actions
 * 5. FAZA IV: Prawny Blitzkrieg (Aug 2021) - 72-hour contradiction
 * 6. FAZA V: Egzekucja (Oct 2021) - Plan finalization
 *
 * Each phase includes:
 * - Temporal boundaries and description
 * - Critical events with importance levels
 * - Visual styling through gradient colors
 */
export const timelinePhases: TimelinePhase[] = [
  {
    id: 'foundation',
    title: 'FAZA I: Fundament',
    dateRange: '2017',
    description: 'Symboliczny początek 8-letniego cyklu',
    color: 'from-slate-500/40 via-slate-400/10 to-gray-500/10',
    events: [
      {
        date: '7 lipca 2017',
        title: 'Akt darowizny',
        description: 'Symboliczny początek 8-letniego cyklu',
        importance: 'critical',
      },
    ],
  },
  {
    id: 'calm',
    title: 'Okres Spokoju',
    dateRange: '2017-2021',
    description: '4 lata bez znaczących wydarzeń',
    color: 'from-emerald-500/40 via-emerald-400/10 to-teal-500/10',
    events: [],
  },
  {
    id: 'catalyst',
    title: 'FAZA II: Katalizator',
    dateRange: 'Luty 2021',
    description: 'Rozpoczęcie "Operacji Kalendarz"',
    color: 'from-amber-500/40 via-amber-400/10 to-orange-500/10',
    events: [
      {
        date: '10 lutego',
        title: 'Wtargnięcie do pokoju o 2:30 w nocy',
        description: 'Nocna konfrontacja',
        importance: 'high',
      },
      {
        date: '14 lutego',
        title: 'Publiczne ogłoszenie związku',
        description: 'Walentynki - symboliczna data',
        importance: 'medium',
      },
    ],
  },
  {
    id: 'escalation',
    title: 'FAZA III: Eskalacja',
    dateRange: 'Marzec - Lipiec 2021',
    description: 'Seria precyzyjnie zaplanowanych działań',
    color: 'from-rose-500/40 via-rose-400/10 to-red-500/10',
    events: [
      {
        date: '29 marca',
        title: 'Wizyta u prawnika + awantura',
        description: 'Prawna konsultacja przed eskalacją',
        importance: 'critical',
      },
      {
        date: '21 maja',
        title: 'Incydent z "odmową pomocy"',
        description: 'Odwrócony triaż priorytetów',
        importance: 'high',
      },
      {
        date: '17-18 lipca',
        title: 'Noc interwencji',
        description: 'Przejście symboliczne 7→8',
        importance: 'critical',
      },
      {
        date: '19 lipca',
        title: 'Pełnomocnictwo',
        description: 'Przejęcie kontroli nad głosem Sylwestra',
        importance: 'critical',
      },
      {
        date: '27 lipca',
        title: 'Dariusz wyjeżdża do Holandii',
        description: 'Zaplanowany wyjazd do pracy',
        importance: 'medium',
      },
      {
        date: '29 lipca',
        title: 'Niebieska Karta',
        description: 'Dzień po wyjeździe - niemożność obrony',
        importance: 'critical',
      },
    ],
  },
  {
    id: 'blitzkrieg',
    title: 'FAZA IV: Prawny Blitzkrieg',
    dateRange: 'Sierpień 2021',
    description: 'Sprzeczność 72 godzin',
    color: 'from-purple-500/40 via-purple-400/10 to-violet-500/10',
    events: [
      {
        date: '3 sierpnia',
        title: 'Zeznanie: "syn mnie NIE obraża"',
        description: 'Oficjalne przesłuchanie Sylwestra na policji',
        importance: 'critical',
      },
      {
        date: '6 sierpnia',
        title: 'List: "obraża MNIE i żonę"',
        description: '72 godziny później - totalna sprzeczność',
        importance: 'critical',
      },
    ],
  },
  {
    id: 'execution',
    title: 'FAZA V: Egzekucja',
    dateRange: 'Październik 2021',
    description: 'Finalizacja planu',
    color: 'from-red-500/40 via-red-400/10 to-rose-500/10',
    events: [
      {
        date: '13 października',
        title: 'Wyrok nakazowy',
        description: 'Liczba wisielca - "certyfikat winy"',
        importance: 'critical',
      },
    ],
  },
];

/**
 * Analytical discoveries revealing patterns in the timeline.
 *
 * Six major discoveries:
 * 1. Sprzeczność 72 Godzin - How testimony changed in 3 days
 * 2. Pułapka Zaplanowanego Wyjazdu - NK filed day after departure
 * 3. Odwrócony Triaż Priorytetów - Evidence gathering over health
 * 4. Magiczne Liczby - Symbolic dates forming impossible patterns
 * 5. Sekwencja Przejmowania Kontroli - Each step building on previous
 * 6. Teatr z Widzem - Why wait in forest with prepared witness
 *
 * Each discovery includes:
 * - Descriptive title and emoji
 * - Summary of the pattern
 * - Detailed breakdown of supporting evidence
 * - Visual styling through gradient colors
 */
export const discoveries: TimelineDiscovery[] = [
  {
    id: 'contradiction-72h',
    number: 1,
    title: 'Sprzeczność 72 Godzin',
    emoji: '🔍',
    color: 'from-red-500/40 via-red-400/10 to-rose-500/10',
    description: 'Jak darczyńca może w 3 dni całkowicie zmienić zeznania?',
    details: [
      '3 sierpnia 2021: "Syn mnie nie obraża, nie wyzywa. Tylko mnie ignoruje."',
      '6 sierpnia 2021: "Rażąca niewdzięczność polegająca na znieważaniu MNIE I MOJEJ MAŁŻONKI..."',
      'Odpowiedź: List najprawdopodobniej zredagowała Barbara Adamska, wykorzystując pełnomocnictwo z 19 lipca',
    ],
  },
  {
    id: 'planned-trip-trap',
    number: 2,
    title: 'Pułapka Zaplanowanego Wyjazdu',
    emoji: '🎭',
    color: 'from-amber-500/40 via-amber-400/10 to-orange-500/10',
    description: 'NK założona dzień po wyjeździe "sprawcy" - perfekcyjny timing',
    details: [
      '26 lipca: Dzielnicowy stwierdza "brak podstaw do NK"',
      '27 lipca: Dariusz wyjeżdża do Holandii (zaplanowany wyjazd)',
      '29 lipca: MGOPS uruchamia procedurę NK (po wyjeździe!)',
      'Efekt: Brak możliwości złożenia wyjaśnień i konfrontacji z zarzutami',
    ],
  },
  {
    id: 'reversed-triage',
    number: 3,
    title: 'Odwrócony Triaż Priorytetów',
    emoji: '🗓️',
    color: 'from-purple-500/40 via-purple-400/10 to-violet-500/10',
    description: 'Gdy zdobycie dowodu staje się ważniejsze niż zdrowie',
    details: [
      '21 maja 2021: Incydent z "odmową pomocy"',
      'Dariusz zasugerował: "zadzwońcie po pogotowie" (właściwa reakcja)',
      'Barbara: "Ale jak tata zostanie, to jak ja wrócę?" (logistyka > zdrowie)',
      'Priorytet: stworzyć "dowód niewdzięczności" zamiast zapewnić opiekę medyczną',
    ],
  },
  {
    id: 'magic-numbers',
    number: 4,
    title: 'Magiczne Liczby',
    emoji: '🔢',
    color: 'from-cyan-500/40 via-cyan-400/10 to-blue-500/10',
    description: 'Symboliczne daty układają się w niemożliwy wzorzec',
    details: [
      'Siódemka (7): 07.07.2017 (akt darowizny), 17-18.07.2021 (interwencja)',
      'Ósemka (8): 8 lat całego cyklu (2017-2025), noc 17→18 (przejście)',
      'Trzynastka (13): 13.10.2021 (wyrok nakazowy)',
      'Prawdopodobieństwo przypadku: zaskakująco niskie',
    ],
  },
  {
    id: 'control-sequence',
    number: 5,
    title: 'Sekwencja Przejmowania Kontroli',
    emoji: '📋',
    color: 'from-indigo-500/40 via-indigo-400/10 to-blue-500/10',
    description: 'Każdy krok buduje fundament pod następny',
    details: [
      '29.03.2021: Wizyta u prawnika + awantura (konsultacja przed eskalacją)',
      '19.07.2021: Pełnomocnictwo (przejęcie głosu Sylwestra)',
      '27.07.2021: Zawiadomienie na policję (oficjalne oskarżenie)',
      '29.07.2021: Niebieska Karta (instytucjonalne potwierdzenie)',
      '06.08.2021: List o odwołaniu (wykorzystanie pełnomocnictwa)',
      '13.10.2021: Wyrok nakazowy ("certyfikat winy")',
      '29.04.2022: Pozew cywilny (finał: wykorzystanie wyroku)',
    ],
  },
  {
    id: 'theater-with-audience',
    number: 6,
    title: 'Teatr z Widzem',
    emoji: '🎪',
    color: 'from-pink-500/40 via-pink-400/10 to-fuchsia-500/10',
    description: 'Dlaczego wzywająca policję czekała w lesie z przygotowanym świadkiem?',
    details: [
      '17 lipca 2021: Noc interwencji',
      'Barbara nie czekała w domu na policję',
      'Czekała w lesie z mężem i siostrą (Dorota Kowalska)',
      'Hipoteza: Nie spontaniczna reakcja, ale wyreżyserowana scena',
    ],
  },
];
