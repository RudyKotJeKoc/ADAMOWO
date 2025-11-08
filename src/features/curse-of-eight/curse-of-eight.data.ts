// src/features/curse-of-eight/curse-of-eight.data.ts

export interface EightOccurrence {
  id: string;
  icon: string;
  title: string;
  description: string;
  details: string[];
  significance: 'critical' | 'high' | 'medium';
}

export interface CyclePhase {
  id: string;
  title: string;
  date: string;
  description: string;
  symbol: string;
}

export const eightOccurrences: EightOccurrence[] = [
  {
    id: 'address',
    icon: '🏠',
    title: 'Adres Przeznaczenia',
    description: 'Adamowo 8, 89-422 Sypniewo',
    details: [
      'Protokoły policyjne z 17/18 lipca 2021: interwencja pod Adamowo 8',
      'Notatki dzielnicowego z 25-26 lipca 2021: wizja lokalna Adamowo 8',
      'Procedura Niebieskiej Karty: miejsce zdarzenia Adamowo 8',
      'Akt darowizny z 7 lipca 2017: przedmiot umowy Adamowo 8',
    ],
    significance: 'critical',
  },
  {
    id: 'eight-years',
    icon: '⏳',
    title: 'Osiem Lat. Dokładnie Osiem.',
    description: '7 lipca 2017 → 7 lipca 2025',
    details: [
      'Darowizna została podpisana 7.07.2017',
      'Finał przewidziany na 7.07.2025 (ósma rocznica)',
      'Pomiędzy nimi: 2922 dni = dokładnie 8 lat',
      'Ósemka symbolizuje Uroborosa – nieskończoną pętlę nienawiści i samozatraty',
    ],
    significance: 'critical',
  },
  {
    id: 'transition',
    icon: '🌙',
    title: 'Przejście 7→8: Noc Transformacji',
    description: '17/18 lipca 2021 - Punkt Zwrotny',
    details: [
      '17 lipca (siódemka) o godzinie 22:15: wezwanie policji',
      '18 lipca (ósemka) po północy: założenie Niebieskiej Karty',
      'O północy, gdy siódemka w kalendarzu ustępowała miejscu ósemce, klątwa weszła w nowy etap',
      'Dokładnie w połowie 8-letniego cyklu (4 lata po darowiźnie, 4 lata przed finałem)',
    ],
    significance: 'critical',
  },
  {
    id: 'august',
    icon: '📅',
    title: 'Sierpień - Ósmy Miesiąc, Ósma Pieczęć',
    description: 'Kluczowe wydarzenia w ósmym miesiącu roku',
    details: [
      '1.08.2021: Wszczęcie dochodzenia karnego',
      '3.08.2021: Sylwester zeznaje: "syn mnie NIE obraża"',
      '6.08.2021: List o odwołaniu: "obraża MNIE i żonę" (3 dni później!)',
      '31.08.2021: Końcowa data zarzutów w akcie oskarżenia',
      '72 godziny między zeznaniem Sylwestra a listem odwołującym darowiznę',
    ],
    significance: 'high',
  },
  {
    id: 'birthday',
    icon: '🎂',
    title: 'Urodziny w Ósmym Miesiącu',
    description: 'Dariusz Adamski: urodzony 12 sierpnia 1993',
    details: [
      'Protagonista urodzony w ósmym miesiącu',
      'Symboliczne połączenie z adresem Adamowo 8',
      'Związek z ośmioletnim cyklem konfliktu',
      '28 lat miał Dariusz, gdy w sierpniu 2021 zaczęto przeciwko niemu postępowanie',
    ],
    significance: 'medium',
  },
  {
    id: 'repertorium',
    icon: '📜',
    title: 'Repertorium Przeznaczenia',
    description: 'Akt Darowizny: Repertorium A Nr 8310/2017',
    details: [
      'Numer aktu notarialnego zaczyna się od 8',
      'Numeryczna sygnatura dokumentu, który uruchomił cały cykl',
      '83 w numeracji: 8+3 = 11 (symboliczny podwójny początek)',
      '8 jako pierwsza cyfra - dominacja symbolu nieskończoności',
    ],
    significance: 'medium',
  },
  {
    id: 'pesel',
    icon: '🔢',
    title: 'PESEL: Zakodowana Ósemka',
    description: 'Numery PESEL zawierające ósemkę',
    details: [
      'Barbara Adamska: 68120308684** (68, 08, końcówka 8)',
      'Sylwester Adamski: 56112800135** (data urodzenia 28)',
      '28 listopada → 2+8 = 10 → 1+0 = 1',
      'Zakodowana w numerach identyfikacyjnych głównych postaci',
    ],
    significance: 'medium',
  },
  {
    id: 'servitude-value',
    icon: '💰',
    title: 'Wartość Służebności: 7200 zł rocznie',
    description: 'Roczna wartość służebności z aktu darowizny',
    details: [
      '7200 zł rocznie = 900 × 8',
      'Wartość nieruchomości: 180 000 zł',
      '180 = 8 × 22,5 (ósemka jako dzielnik)',
      'Matematyczne powiązanie z symbolem nieskończoności',
    ],
    significance: 'high',
  },
];

export const cyclePhases: CyclePhase[] = [
  {
    id: 'phase-1',
    title: 'FAZA 1: Początek Pętli (7)',
    date: '7 lipca 2017',
    description: 'Dar, który stał się więzieniem',
    symbol: '⭕',
  },
  {
    id: 'phase-2',
    title: 'FAZA 2: Transformacja (7→8)',
    date: '17→18 lipca 2021',
    description:
      'Przejście z iluzji ładu w pętlę konfliktu. Dokładnie 4 lata później = połowa cyklu',
    symbol: '🔄',
  },
  {
    id: 'phase-3',
    title: 'FAZA 3: Pieczętowanie (8)',
    date: 'Sierpień 2021',
    description:
      'Miesiąc prawnej egzekucji: 1.08 dochodzenie, 3.08 prawda, 6.08 manipulacja, 31.08 koniec zarzucanego okresu',
    symbol: '📋',
  },
  {
    id: 'phase-4',
    title: 'FAZA 4: Zamknięcie Koła (8→7)',
    date: '7 lipca 2025',
    description: 'Ósma rocznica = powrót do początku. 8 lat walki. Uroboros zamyka paszczę',
    symbol: '♾️',
  },
];

export const culturalMeanings = [
  {
    category: 'Matematyka',
    symbol: '∞',
    description: 'Symbol nieskończoności to obrócona ósemka',
  },
  {
    category: 'Mitologia',
    symbol: '🐍',
    description: 'Uroboros - wąż pożerający własny ogon, wieczny powrót, cykl bez końca',
  },
  {
    category: 'Filozofia',
    symbol: '🔁',
    description: 'Wieczne Powracanie - Nietzscheańska koncepcja powtarzalności zdarzeń',
  },
];

export const statisticalNote = `
Statystyczne prawdopodobieństwo, że jedna cyfra pojawi się w TYLU kluczowych momentach jednej sprawy jest astronomicznie niskie.
Częstotliwość występowania cyfry 8 w sprawie przekracza wszelkie normy przypadkowości.
`;
