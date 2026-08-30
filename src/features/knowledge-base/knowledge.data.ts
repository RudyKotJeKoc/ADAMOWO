import type { KnowledgeEntry, KnowledgeSource } from './knowledge.types';

const KC: KnowledgeSource = {
  label: 'Kodeks cywilny — tekst w ISAP',
  url: 'https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20240001061/U/D20241061Lj.pdf',
};

const KK: KnowledgeSource = {
  label: 'Kodeks karny — tekst w ISAP',
  url: 'https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU19970880553/U/D19970553Lj.pdf',
};

const KPK: KnowledgeSource = {
  label: 'Kodeks postępowania karnego — tekst w ISAP',
  url: 'https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU19970890555/U/D19970555Lj.pdf',
};

const KPC: KnowledgeSource = {
  label: 'Kodeks postępowania cywilnego — tekst w ISAP',
  url: 'https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU19640430296/U/D19640296Lj.pdf',
};

const BLUE_CARD: KnowledgeSource = {
  label: 'Rozporządzenie w sprawie procedury „Niebieskie Karty”',
  url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20230001870',
};

const ETHICS: KnowledgeSource = {
  label: 'Zbiór Zasad Etyki Adwokackiej — tekst jednolity',
  url: 'https://www.adwokatura.pl/admin/wgrane_pliki/file-zal-do-uchwaly-prezydium-nra-nr-3582023kodeksetykiadwokackiejtekst-jednolity-37687.pdf',
};

const RPO: KnowledgeSource = {
  label: 'Rzecznik Praw Obywatelskich — informacje i wnioski',
  url: 'https://bip.brpo.gov.pl/pl/content/jak-zlozyc-wniosek-do-rzecznika-praw-obywatelskich',
};

export const KNOWLEDGE_REVIEW_DATE = '30 sierpnia 2026';

export const knowledgeEntries: KnowledgeEntry[] = [
  {
    slug: 'art-888-kc-umowa-darowizny',
    title: 'Art. 888 k.c. — umowa darowizny',
    shortTitle: 'Umowa darowizny',
    category: 'cywilne',
    kind: 'przepis',
    areas: ['wykladnie', 'analiza'],
    summary: 'Darowizna to zobowiązanie do bezpłatnego świadczenia kosztem majątku darczyńcy.',
    explanation: [
      'Najważniejszą cechą darowizny jest nieodpłatność: darczyńca nie otrzymuje równoważnego świadczenia. Przy nieruchomości konieczny jest akt notarialny przenoszący własność.',
      'Darowizna nie jest tym samym co dożywocie. Obciążenie nieruchomości służebnością mieszkania także nie zamienia automatycznie darowizny w umowę dożywocia.',
    ],
    remember: [
      'Sprawdź treść aktu notarialnego, nie tylko jego tytuł.',
      'Oddziel przeniesienie własności od dodatkowych praw i obowiązków stron.',
    ],
    legalBasis: ['art. 888–902 k.c.', 'art. 158 k.c. przy nieruchomości'],
    caution:
      'Forma, wykonanie darowizny i jej ewentualne odwołanie wymagają oceny całego aktu oraz późniejszych zdarzeń.',
    tags: ['darowizna', 'nieruchomość', 'akt notarialny', 'darczyńca'],
    related: ['art-898-kc-razaca-niewdziecznosc', 'art-908-kc-umowa-dozywocia'],
    sources: [KC],
  },
  {
    slug: 'art-898-kc-razaca-niewdziecznosc',
    title: 'Art. 898 k.c. — odwołanie darowizny',
    shortTitle: 'Rażąca niewdzięczność',
    category: 'cywilne',
    kind: 'przepis',
    areas: ['wykladnie', 'orzecznictwo', 'analiza'],
    summary:
      'Wykonana darowizna może zostać odwołana, gdy obdarowany dopuścił się wobec darczyńcy rażącej niewdzięczności.',
    explanation: [
      'Nie każde pogorszenie relacji, konflikt czy brak wdzięczności spełnia tę przesłankę. Sąd bada wagę zachowania, jego intencję, kontekst relacji oraz dowody.',
      'Samo oświadczenie o odwołaniu darowizny nie zawsze przywraca własność nieruchomości. Jeżeli obdarowany nie przeniesie jej zwrotnie, może być potrzebne roszczenie prowadzące do zastąpienia jego oświadczenia wyrokiem.',
    ],
    remember: [
      'Istotny jest roczny termin liczony od uzyskania wiedzy o niewdzięczności.',
      'Oświadczenie o odwołaniu powinno być złożone na piśmie.',
    ],
    legalBasis: [
      'art. 898–900 k.c.',
      'art. 64 k.c. w razie sporu o zwrotne przeniesienie własności',
    ],
    caution:
      'Ocena „rażącej” niewdzięczności jest silnie zależna od faktów; pojedynczy incydent nie przesądza wyniku.',
    tags: ['darowizna', 'niewdzięczność', 'odwołanie', 'termin'],
    related: ['art-888-kc-umowa-darowizny', 'art-64-kc-zastepcze-oswiadczenie-woli'],
    sources: [KC],
  },
  {
    slug: 'art-296-kc-sluzebnosc-osobista-mieszkania',
    title: 'Art. 296 k.c. — służebność osobista; mieszkanie',
    shortTitle: 'Służebność mieszkania',
    category: 'cywilne',
    kind: 'przepis',
    areas: ['wykladnie', 'ochrona'],
    summary:
      'Art. 296 k.c. tworzy ogólną konstrukcję służebności osobistej; szczegóły służebności mieszkania wynikają także z art. 301–302 k.c.',
    explanation: [
      'Uprawnienie jest związane z konkretną osobą, a nie z posiadaniem innej nieruchomości. Zakres korzystania wynika przede wszystkim z aktu ustanawiającego prawo oraz przepisów kodeksu.',
      'Służebność mieszkania nie daje własności. Może jednak zapewniać prawnie chronioną możliwość zajmowania oznaczonych pomieszczeń i korzystania z części wspólnych.',
    ],
    remember: [
      'Sprawdź dokładny zakres wpisany w akcie i księdze wieczystej.',
      'Nie utożsamiaj służebności z umową dożywocia ani najmem.',
    ],
    legalBasis: ['art. 296–305 k.c.', 'w szczególności art. 301–302 k.c.'],
    caution:
      'Sposób wykonywania prawa zależy od jego treści, stosunków miejscowych i zasad współżycia społecznego.',
    tags: ['służebność', 'mieszkanie', 'nieruchomość', 'księga wieczysta'],
    related: ['art-908-kc-umowa-dozywocia', 'ksiegi-wieczyste-ostrzezenie-o-procesie'],
    sources: [KC],
  },
  {
    slug: 'art-908-kc-umowa-dozywocia',
    title: 'Art. 908 k.c. — umowa dożywocia',
    shortTitle: 'Umowa dożywocia',
    category: 'cywilne',
    kind: 'przepis',
    areas: ['wykladnie', 'ochrona'],
    summary:
      'W zamian za przeniesienie własności nieruchomości nabywca zobowiązuje się zapewnić zbywcy dożywotnie utrzymanie.',
    explanation: [
      'Dożywocie jest umową odpłatną i wzajemną. Typowe obowiązki obejmują przyjęcie jako domownika, wyżywienie, ubranie, mieszkanie, pomoc i pielęgnowanie, o ile strony nie ustaliły inaczej.',
      'Przy poważnym konflikcie sąd może w określonych warunkach zamienić uprawnienia na rentę, a wyjątkowo rozwiązać umowę.',
    ],
    remember: [
      'Treść świadczeń może być zmodyfikowana w akcie notarialnym.',
      'Dożywocie różni się od darowizny obciążonej służebnością.',
    ],
    legalBasis: ['art. 908–916 k.c.'],
    tags: ['dożywocie', 'utrzymanie', 'nieruchomość', 'akt notarialny'],
    related: ['art-888-kc-umowa-darowizny', 'art-296-kc-sluzebnosc-osobista-mieszkania'],
    sources: [KC],
  },
  {
    slug: 'art-82-kc-brak-swiadomosci-lub-swobody',
    title: 'Art. 82 k.c. — brak świadomości albo swobody',
    shortTitle: 'Wada oświadczenia woli',
    category: 'cywilne',
    kind: 'przepis',
    areas: ['wykladnie', 'argumenty', 'orzecznictwo'],
    summary:
      'Nieważne jest oświadczenie złożone w stanie wyłączającym świadome albo swobodne podjęcie decyzji i wyrażenie woli.',
    explanation: [
      'Przyczyną może być choroba psychiczna, zaburzenie czynności psychicznych lub inne, nawet przemijające zaburzenie. Kluczowy jest jednak stan w konkretnej chwili składania oświadczenia.',
      'Sama diagnoza, podeszły wiek albo późniejsze problemy z pamięcią nie przesądzają sprawy. Znaczenie mają dokumentacja medyczna, obserwacje świadków, treść czynności i często opinia biegłego.',
    ],
    remember: [
      'Ustal dokładną datę i okoliczności czynności.',
      'Zabezpiecz dokumentację możliwie bliską tej dacie.',
    ],
    legalBasis: ['art. 82 k.c.'],
    caution:
      'To przesłanka nieważności oceniana indywidualnie, a nie automatyczny skutek rozpoznania choroby.',
    tags: ['oświadczenie woli', 'świadomość', 'swoboda', 'biegły'],
    related: ['mechanizm-zywego-stempla', 'pelnomocnictwo-notarialne'],
    sources: [KC],
  },
  {
    slug: 'art-64-kc-zastepcze-oswiadczenie-woli',
    title: 'Art. 64 k.c. — wyrok zastępujący oświadczenie woli',
    shortTitle: 'Zastępcze oświadczenie woli',
    category: 'cywilne',
    kind: 'przepis',
    areas: ['orzecznictwo', 'wykladnie'],
    summary:
      'Prawomocne orzeczenie może zastąpić oświadczenie osoby, która miała obowiązek je złożyć.',
    explanation: [
      'Najpierw trzeba wykazać istnienie konkretnego obowiązku złożenia oznaczonego oświadczenia. Art. 64 k.c. nie tworzy samodzielnie tego obowiązku.',
      'Treść żądania musi być na tyle precyzyjna, aby wyrok mógł zastąpić brakujące oświadczenie, na przykład przy zwrotnym przeniesieniu własności.',
    ],
    remember: [
      'Wskaż źródło obowiązku drugiej strony.',
      'Precyzyjnie opisz treść żądanego oświadczenia.',
    ],
    legalBasis: ['art. 64 k.c.', 'art. 1047 k.p.c.'],
    tags: ['wyrok', 'oświadczenie woli', 'własność', 'wykonanie'],
    related: ['art-898-kc-razaca-niewdziecznosc', 'ksiegi-wieczyste-ostrzezenie-o-procesie'],
    sources: [KC, KPC],
  },
  {
    slug: 'art-226-kc-rozliczenie-nakladow',
    title: 'Art. 226 k.c. — rozliczenie nakładów',
    shortTitle: 'Nakłady na nieruchomość',
    category: 'cywilne',
    kind: 'przepis',
    areas: ['wykladnie', 'argumenty'],
    summary:
      'Zasady rozliczenia wydatków na cudzą rzecz zależą m.in. od rodzaju nakładów i dobrej albo złej wiary posiadacza.',
    explanation: [
      'Kodeks rozróżnia nakłady konieczne od innych nakładów oraz sytuację posiadacza w dobrej i złej wierze. Znaczenie ma też moment zwrotu rzeczy i wzrost jej wartości.',
      'Nie każdy remont automatycznie daje roszczenie z art. 226 k.c. Podstawa może wynikać z umowy, stosunków między współwłaścicielami albo innych przepisów.',
    ],
    remember: [
      'Zachowuj faktury, przelewy, zdjęcia i ustalenia stron.',
      'Oddziel koszt prac od rzeczywistego wzrostu wartości nieruchomości.',
    ],
    legalBasis: ['art. 226–231 k.c.'],
    caution: 'Wybór podstawy prawnej zależy od tytułu do nieruchomości i relacji między stronami.',
    tags: ['nakłady', 'remont', 'posiadacz', 'nieruchomość'],
    related: ['art-405-kc-bezpodstawne-wzbogacenie', 'prawo-zatrzymania-art-461-kc'],
    sources: [KC],
  },
  {
    slug: 'art-405-kc-bezpodstawne-wzbogacenie',
    title: 'Art. 405 k.c. — bezpodstawne wzbogacenie',
    shortTitle: 'Bezpodstawne wzbogacenie',
    category: 'cywilne',
    kind: 'przepis',
    areas: ['wykladnie', 'argumenty'],
    summary:
      'Kto bez podstawy prawnej uzyskał korzyść kosztem innej osoby, powinien ją wydać albo zwrócić jej wartość.',
    explanation: [
      'Trzeba połączyć cztery elementy: korzyść jednej osoby, zubożenie drugiej, związek między nimi i brak podstawy prawnej przesunięcia majątkowego.',
      'Roszczenie ma charakter uzupełniający. Jeżeli rozliczenie reguluje umowa albo przepis szczególny, to one zwykle są pierwszym punktem analizy.',
    ],
    remember: [
      'Wykaż konkretną korzyść i odpowiadające jej zubożenie.',
      'Sprawdź, czy istniała umowa lub inna podstawa świadczenia.',
    ],
    legalBasis: ['art. 405–414 k.c.'],
    tags: ['wzbogacenie', 'zwrot', 'świadczenie nienależne', 'roszczenie'],
    related: ['art-226-kc-rozliczenie-nakladow', 'nienalezyte-wykonanie-umowy-przez-prawnika'],
    sources: [KC],
  },
  {
    slug: 'art-5-kc-naduzycie-prawa',
    title: 'Art. 5 k.c. — nadużycie prawa podmiotowego',
    shortTitle: 'Zasady współżycia społecznego',
    category: 'cywilne',
    kind: 'przepis',
    areas: ['argumenty', 'orzecznictwo', 'wykladnie'],
    summary:
      'Wykonywanie prawa sprzecznie z jego społeczno-gospodarczym przeznaczeniem lub zasadami współżycia nie korzysta z ochrony.',
    explanation: [
      'Przepis pozwala sądowi ocenić sposób wykonywania istniejącego prawa w wyjątkowych okolicznościach. Nie służy do dowolnego pomijania przepisów.',
      'Zwykle działa jako środek obrony przed konkretnym żądaniem, a nie jako samodzielne źródło roszczenia o zapłatę lub przeniesienie własności.',
    ],
    remember: [
      'Połącz argument z konkretnym zachowaniem i skutkiem.',
      'Nie zastępuj art. 5 k.c. właściwej podstawy roszczenia.',
    ],
    legalBasis: ['art. 5 k.c.'],
    tags: ['nadużycie prawa', 'zasady współżycia', 'obrona', 'słuszność'],
    related: ['art-898-kc-razaca-niewdziecznosc'],
    sources: [KC],
  },
  {
    slug: 'pelnomocnictwo-notarialne',
    title: 'Pełnomocnictwo notarialne — zakres i odwołanie',
    shortTitle: 'Pełnomocnictwo notarialne',
    category: 'cywilne',
    kind: 'pojecie-prawne',
    areas: ['ochrona', 'analiza', 'wykladnie'],
    summary:
      'Pełnomocnik może działać tylko w granicach umocowania, a forma pełnomocnictwa zależy od czynności, której ma dokonać.',
    explanation: [
      'Akt notarialny nie daje nieograniczonej władzy. Trzeba odczytać zakres umocowania, warunki jego użycia i rodzaj czynności, do których upoważnia.',
      'Pełnomocnictwo co do zasady można odwołać. Nadużycie zaufania może rodzić odpowiedzialność, lecz skutki czynności wobec osoby trzeciej zależą m.in. od granic umocowania i jej wiedzy.',
    ],
    remember: [
      'Zdobądź pełny wypis pełnomocnictwa i dokument czynności.',
      'Po odwołaniu poinformuj osoby i instytucje, wobec których mogłoby zostać użyte.',
    ],
    legalBasis: ['art. 95–109 k.c.'],
    caution: 'Odwołanie pełnomocnictwa nie cofa automatycznie czynności już skutecznie dokonanych.',
    tags: ['pełnomocnik', 'notariusz', 'umocowanie', 'odwołanie'],
    related: ['art-296-kk-naduzycie-zaufania', 'art-82-kc-brak-swiadomosci-lub-swobody'],
    sources: [KC],
  },
  {
    slug: 'ksiegi-wieczyste-ostrzezenie-o-procesie',
    title: 'Księga wieczysta — ostrzeżenie o sporze',
    shortTitle: 'Ostrzeżenie w księdze wieczystej',
    category: 'cywilne',
    kind: 'procedura',
    areas: ['ochrona', 'orzecznictwo'],
    summary:
      'Wpis ostrzeżenia ujawnia, że treść księgi lub prawo do nieruchomości jest objęte sporem.',
    explanation: [
      'Ostrzeżenie może ograniczyć ochronę osoby, która nabywa nieruchomość w zaufaniu do księgi, i informuje uczestników obrotu o roszczeniu.',
      'Sam wpis nie przenosi własności i nie rozstrzyga procesu. Do jego uzyskania potrzebna jest właściwa podstawa, dokument oraz wniosek do sądu wieczystoksięgowego.',
    ],
    remember: [
      'Sprawdź aktualny odpis wszystkich działów księgi.',
      'Rozważ zabezpieczenie roszczenia i ujawnienie go bez zwłoki.',
    ],
    legalBasis: [
      'ustawa o księgach wieczystych i hipotece',
      'przepisy k.p.c. o zabezpieczeniu roszczeń',
    ],
    caution: 'Rodzaj możliwego wpisu zależy od treści roszczenia i postanowienia sądu.',
    tags: ['księga wieczysta', 'ostrzeżenie', 'własność', 'zabezpieczenie'],
    related: ['art-64-kc-zastepcze-oswiadczenie-woli', 'art-898-kc-razaca-niewdziecznosc'],
    sources: [KPC],
  },
  {
    slug: 'prawo-zatrzymania-art-461-kc',
    title: 'Art. 461 k.c. — prawo zatrzymania',
    shortTitle: 'Prawo zatrzymania (retencja)',
    category: 'cywilne',
    kind: 'przepis',
    areas: ['ochrona', 'argumenty', 'wykladnie'],
    summary:
      'W określonych warunkach osoba zobowiązana do wydania cudzej rzeczy może ją zatrzymać do czasu zabezpieczenia lub zaspokojenia roszczenia.',
    explanation: [
      'Retencja może dotyczyć zwrotu nakładów na rzecz albo naprawienia szkody wyrządzonej przez rzecz. Jest zarzutem obronnym, a nie sposobem nabycia własności.',
      'Ustawa przewiduje wyjątki, m.in. gdy obowiązek wydania wynika z czynu niedozwolonego albo dotyczy rzeczy wynajętej, wydzierżawionej lub użyczonej.',
    ],
    remember: [
      'Ustal, z czego wynika obowiązek wydania rzeczy.',
      'Wykaż wysokość i związek roszczenia z rzeczą.',
    ],
    legalBasis: ['art. 461 k.c.'],
    caution:
      'Prawo zatrzymania nie oznacza automatycznie prawa do dalszego zajmowania każdego lokalu.',
    tags: ['retencja', 'zatrzymanie', 'nakłady', 'wydanie rzeczy'],
    related: ['art-226-kc-rozliczenie-nakladow'],
    sources: [KC],
  },
  {
    slug: 'art-207-kk-znecanie-sie',
    title: 'Art. 207 k.k. — znęcanie się',
    shortTitle: 'Znęcanie psychiczne lub fizyczne',
    category: 'karne',
    kind: 'przepis',
    areas: ['wykladnie', 'ochrona', 'analiza'],
    summary:
      'Przepis penalizuje fizyczne lub psychiczne znęcanie się m.in. nad osobą najbliższą lub zależną.',
    explanation: [
      'Znęcanie jest oceniane jako zachowanie o określonej intensywności, powtarzalności lub szczególnej dotkliwości. Nie każdy rodzinny konflikt i nie każda zniewaga automatycznie wypełnia znamiona tego przestępstwa.',
      'Znaczenie ma cały wzorzec zachowań: czas, częstotliwość, przewaga sprawcy, skutki i sytuacja osoby pokrzywdzonej.',
    ],
    remember: [
      'Dokumentuj chronologię i konkretne zdarzenia.',
      'W nagłym zagrożeniu najpierw zadbaj o bezpieczeństwo i kontakt ze służbami.',
    ],
    legalBasis: ['art. 207 k.k.'],
    caution: 'Kwalifikację prawną ustalają organy na podstawie całego materiału dowodowego.',
    tags: ['znęcanie', 'przemoc domowa', 'przemoc psychiczna', 'bezpieczeństwo'],
    related: ['procedura-niebieskiej-karty', 'deprywacja-przestrzeni-zyciowej'],
    sources: [KK],
  },
  {
    slug: 'art-191-kk-zmuszanie',
    title: 'Art. 191 § 1 k.k. — zmuszanie',
    shortTitle: 'Zmuszanie przemocą lub groźbą',
    category: 'karne',
    kind: 'przepis',
    areas: ['wykladnie', 'ochrona', 'argumenty'],
    summary:
      'Przestępstwo polega na użyciu przemocy lub groźby bezprawnej, aby zmusić inną osobę do działania, zaniechania albo znoszenia.',
    explanation: [
      'Trzeba ustalić środek nacisku, oczekiwane zachowanie oraz związek między nimi. Sama presja emocjonalna lub ostra rozmowa nie zawsze odpowiada ustawowym znamionom.',
      'Określenie „zmuszanie korytarzowe” nie występuje w kodeksie. Może opisywać miejsce i sposób nacisku, ale kwalifikacja zależy od faktycznego użycia przemocy lub groźby bezprawnej.',
    ],
    remember: [
      'Zapisz możliwie dokładnie słowa, działania, czas i świadków.',
      'Oddziel ocenę sytuacji od opisu obserwowalnych faktów.',
    ],
    legalBasis: ['art. 191 § 1 k.k.', 'art. 115 § 12 k.k. — groźba bezprawna'],
    tags: ['zmuszanie', 'groźba', 'przemoc', 'nacisk'],
    related: ['zmowa-korytarzowa', 'sfabrykowane-oskarzenia-i-prowokacje'],
    sources: [KK],
  },
  {
    slug: 'art-233-kk-falszywe-zeznania',
    title: 'Art. 233 § 1 k.k. — fałszywe zeznania',
    shortTitle: 'Fałszywe zeznania',
    category: 'karne',
    kind: 'przepis',
    areas: ['wykladnie', 'argumenty', 'orzecznictwo'],
    summary:
      'Odpowiedzialność dotyczy świadomego zeznania nieprawdy lub zatajenia prawdy w postępowaniu prowadzonym na podstawie ustawy.',
    explanation: [
      'Nie każda sprzeczność, pomyłka pamięci lub odmienna interpretacja jest fałszywym zeznaniem. Znaczenie ma umyślność oraz spełnienie wymogów dotyczących pouczenia lub przyrzeczenia.',
      'Najpierw warto zestawić dokładne protokoły, nagrania i obiektywne dokumenty, zamiast opierać zawiadomienie na ogólnym przekonaniu, że świadek kłamie.',
    ],
    remember: [
      'Wskaż konkretne zdanie i dowód jego nieprawdziwości.',
      'Sprawdź status osoby i pouczenie przed przesłuchaniem.',
    ],
    legalBasis: ['art. 233 k.k.'],
    caution:
      'Ocena wiarygodności świadka przez sąd nie jest równoznaczna ze stwierdzeniem przestępstwa.',
    tags: ['zeznania', 'świadek', 'nieprawda', 'dowód'],
    related: ['art-234-kk-falszywe-oskarzenie', 'inicjatywa-dowodowa-stron'],
    sources: [KK],
  },
  {
    slug: 'art-234-kk-falszywe-oskarzenie',
    title: 'Art. 234 k.k. — fałszywe oskarżenie',
    shortTitle: 'Fałszywe oskarżenie',
    category: 'karne',
    kind: 'przepis',
    areas: ['wykladnie', 'ochrona', 'argumenty'],
    summary:
      'Przepis dotyczy fałszywego oskarżenia konkretnej osoby przed organem powołanym do ścigania lub orzekania.',
    explanation: [
      'Sprawca musi wiedzieć, że zarzut jest fałszywy. Nie wystarcza, że postępowanie później umorzono albo oskarżony został uniewinniony.',
      'Art. 234 k.k. należy odróżnić od art. 238 k.k., który dotyczy zawiadomienia o przestępstwie, wiedząc, że w ogóle go nie popełniono.',
    ],
    remember: [
      'Oddziel treść zarzutu od dowodów i wyniku postępowania.',
      'Wykaż świadomość nieprawdziwości, nie tylko błąd oskarżającego.',
    ],
    legalBasis: ['art. 234 k.k.'],
    tags: ['oskarżenie', 'pomówienie', 'organ ścigania', 'umyślność'],
    related: ['art-238-kk-falszywe-zawiadomienie', 'sfabrykowane-oskarzenia-i-prowokacje'],
    sources: [KK],
  },
  {
    slug: 'art-238-kk-falszywe-zawiadomienie',
    title: 'Art. 238 k.k. — zawiadomienie o niepopełnionym przestępstwie',
    shortTitle: 'Fałszywe zawiadomienie',
    category: 'karne',
    kind: 'przepis',
    areas: ['wykladnie', 'ochrona'],
    summary:
      'Odpowiedzialność dotyczy zawiadomienia organu o przestępstwie, wiedząc, że czynu nie popełniono.',
    explanation: [
      'Przepis chroni wymiar sprawiedliwości przed uruchamianiem działań na podstawie świadomie zmyślonego zdarzenia. Pomyłka lub uzasadnione, choć błędne podejrzenie to co innego.',
      'Gdy fałszywy zarzut jest skierowany przeciw konkretnej osobie, analizowany może być także art. 234 k.k.',
    ],
    remember: [
      'Ustal, co dokładnie zgłoszono i z jaką wiedzą.',
      'Nie utożsamiaj braku skazania z fałszywym zawiadomieniem.',
    ],
    legalBasis: ['art. 238 k.k.'],
    tags: ['zawiadomienie', 'niepopełnione przestępstwo', 'policja', 'prokuratura'],
    related: ['art-234-kk-falszywe-oskarzenie'],
    sources: [KK],
  },
  {
    slug: 'art-286-kk-oszustwo-sadowe',
    title: 'Art. 286 § 1 k.k. — oszustwo; tzw. oszustwo sądowe',
    shortTitle: 'Oszustwo sądowe',
    category: 'karne',
    kind: 'przepis',
    areas: ['wykladnie', 'argumenty', 'orzecznictwo'],
    summary:
      '„Oszustwo sądowe” nie jest osobnym typem czynu; to określenie sytuacji analizowanej przez pryzmat znamion zwykłego oszustwa.',
    explanation: [
      'Dla art. 286 § 1 k.k. konieczne są m.in. zamiar osiągnięcia korzyści majątkowej, wprowadzenie w błąd lub wyzyskanie błędu i niekorzystne rozporządzenie mieniem.',
      'Samo przedstawienie nieprawdziwego twierdzenia w piśmie procesowym nie przesądza automatycznie oszustwa. Trzeba wykazać cały mechanizm i skutek majątkowy.',
    ],
    remember: [
      'Rozpisz każde ustawowe znamię osobno.',
      'Wykaż drogę od wprowadzenia w błąd do rozporządzenia mieniem.',
    ],
    legalBasis: ['art. 286 § 1 k.k.'],
    caution:
      'To kwalifikacja zależna od szczegółów i dorobku orzecznictwa, a nie ustawowa nazwa odrębnego przestępstwa.',
    tags: ['oszustwo', 'proces', 'mienie', 'korzyść majątkowa'],
    related: ['art-296-kk-naduzycie-zaufania', 'inicjatywa-dowodowa-stron'],
    sources: [KK],
  },
  {
    slug: 'art-296-kk-naduzycie-zaufania',
    title: 'Art. 296 k.k. — nadużycie zaufania w obrocie gospodarczym',
    shortTitle: 'Nadużycie zaufania majątkowego',
    category: 'karne',
    kind: 'przepis',
    areas: ['wykladnie', 'argumenty'],
    summary:
      'Przepis może dotyczyć osoby zobowiązanej do zajmowania się cudzymi sprawami majątkowymi lub działalnością gospodarczą, która wyrządza znaczną szkodę.',
    explanation: [
      'Źródłem obowiązku może być ustawa, decyzja lub umowa. Potrzebne jest nadużycie uprawnień albo niedopełnienie obowiązku oraz skutek majątkowy określony w ustawie.',
      'Nie każdy pełnomocnik i nie każde przekroczenie zaufania w relacji prywatnej podlega art. 296 k.k. Trzeba zbadać charakter obowiązków, szkodę i stronę podmiotową.',
    ],
    remember: [
      'Ustal dokument będący źródłem obowiązków.',
      'Policz szkodę i opisz związek z konkretnym działaniem.',
    ],
    legalBasis: ['art. 296 k.k.'],
    caution: 'Pełnomocnictwo samo w sobie nie przesądza spełnienia wszystkich znamion.',
    tags: ['pełnomocnik', 'szkoda', 'majątek', 'nadużycie uprawnień'],
    related: ['pelnomocnictwo-notarialne', 'art-286-kk-oszustwo-sadowe'],
    sources: [KK],
  },
  {
    slug: 'art-500-kpk-wyrok-nakazowy',
    title: 'Art. 500 k.p.k. — warunki wyroku nakazowego',
    shortTitle: 'Wyrok nakazowy',
    category: 'karne',
    kind: 'procedura',
    areas: ['orzecznictwo', 'wykladnie', 'ochrona'],
    summary:
      'W postępowaniu nakazowym sąd może wydać wyrok bez rozprawy, gdy materiał nie budzi wątpliwości i wystarczają określone kary.',
    explanation: [
      'Wyrok powstaje na posiedzeniu bez udziału stron. To nie zamyka drogi do zwykłego rozpoznania sprawy, jeżeli uprawniona osoba skutecznie wniesie sprzeciw.',
      'Art. 500 k.p.k. opisuje warunki tego trybu. Termin i skutki sprzeciwu reguluje przede wszystkim art. 506 k.p.k.',
    ],
    remember: [
      'Sprawdź datę doręczenia odpisu wyroku.',
      'Przeczytaj pouczenie dołączone do orzeczenia.',
    ],
    legalBasis: ['art. 500–507 k.p.k.'],
    tags: ['wyrok nakazowy', 'posiedzenie', 'bez rozprawy', 'sprzeciw'],
    related: ['sprzeciw-od-wyroku-nakazowego-art-506-kpk'],
    sources: [KPK],
  },
  {
    slug: 'sprzeciw-od-wyroku-nakazowego-art-506-kpk',
    title: 'Art. 506 k.p.k. — sprzeciw od wyroku nakazowego',
    shortTitle: 'Sprzeciw od wyroku nakazowego',
    category: 'karne',
    kind: 'procedura',
    areas: ['ochrona', 'orzecznictwo'],
    summary:
      'Oskarżony i oskarżyciel mogą wnieść sprzeciw w terminie 7 dni od doręczenia wyroku nakazowego.',
    explanation: [
      'Skuteczny sprzeciw powoduje utratę mocy wyroku nakazowego wobec osoby, która go wniosła, a sprawa jest rozpoznawana na zasadach ogólnych.',
      'Termin jest zawity: spóźniona czynność co do zasady jest bezskuteczna. W szczególnych warunkach można wnioskować o przywrócenie terminu, wykazując brak winy w uchybieniu.',
    ],
    remember: [
      'Liczy się prawidłowo ustalona data doręczenia.',
      'Zachowaj potwierdzenie złożenia lub nadania sprzeciwu.',
    ],
    legalBasis: ['art. 506 k.p.k.', 'art. 126 k.p.k. — przywrócenie terminu'],
    caution: 'Sprzeciw uruchamia zwykłe rozpoznanie; nie gwarantuje korzystnego wyniku.',
    tags: ['sprzeciw', '7 dni', 'termin zawity', 'wyrok nakazowy'],
    related: ['art-500-kpk-wyrok-nakazowy'],
    sources: [KPK],
  },
  {
    slug: 'art-11-kpc-wiazacy-wyrok-karny',
    title: 'Art. 11 k.p.c. — wpływ wyroku karnego na proces cywilny',
    shortTitle: 'Wiążący wyrok skazujący',
    category: 'karne',
    kind: 'przepis',
    areas: ['orzecznictwo', 'argumenty'],
    summary:
      'Sąd cywilny jest związany ustaleniami prawomocnego wyroku skazującego co do popełnienia przestępstwa.',
    explanation: [
      'Związanie nie obejmuje automatycznie każdej informacji z uzasadnienia ani wszystkich skutków cywilnych. Sąd cywilny nadal ustala np. wysokość szkody, związek przyczynowy i zakres odpowiedzialności, o ile nie zostały wiążąco przesądzone.',
      'Wyrok uniewinniający lub umorzenie nie działa na tej samej zasadzie. Sąd cywilny może samodzielnie ocenić fakty według cywilnego standardu dowodowego.',
    ],
    remember: [
      'Sprawdź prawomocność i dokładny opis czynu w sentencji.',
      'Oddziel ustalenie popełnienia przestępstwa od rozmiaru roszczenia cywilnego.',
    ],
    legalBasis: ['art. 11 k.p.c.'],
    tags: ['wyrok karny', 'proces cywilny', 'związanie', 'prawomocność'],
    related: ['inicjatywa-dowodowa-stron', 'art-233-kk-falszywe-zeznania'],
    sources: [KPC],
  },
  {
    slug: 'procedura-niebieskiej-karty',
    title: 'Procedura „Niebieskie Karty”',
    shortTitle: 'Niebieska Karta',
    category: 'karne',
    kind: 'procedura',
    areas: ['ochrona', 'analiza'],
    summary:
      'To interdyscyplinarna procedura reagowania na uzasadnione podejrzenie przemocy domowej; nie wymaga wcześniejszego skazania sprawcy.',
    explanation: [
      'Procedura rozpoczyna się przez wypełnienie formularza „Niebieska Karta — A” przez uprawnioną osobę. Dalej obejmuje diagnozę sytuacji, działania pomocowe i pracę grupy diagnostyczno-pomocowej.',
      'Dokumentacja z procedury może być ważnym materiałem, ale samo wszczęcie Niebieskiej Karty nie jest wyrokiem karnym ani automatycznym dowodem prawdziwości wszystkich relacji.',
    ],
    remember: [
      'Proś o informację o etapach i podmiotach prowadzących działania.',
      'Koryguj nieścisłości rzeczowo, wskazując dokumenty i daty.',
    ],
    legalBasis: [
      'ustawa o przeciwdziałaniu przemocy domowej',
      'rozporządzenie Rady Ministrów z 6 września 2023 r.',
    ],
    caution:
      'Priorytetem procedury jest bezpieczeństwo i pomoc, a ustalenia karne należą do właściwych organów.',
    tags: ['Niebieska Karta', 'przemoc domowa', 'grupa diagnostyczna', 'pomoc'],
    related: ['art-207-kk-znecanie-sie', 'inicjatywa-dowodowa-stron'],
    sources: [BLUE_CARD],
  },
  {
    slug: 'art-148a-kpk-dane-adresowe',
    title: 'Art. 148a k.p.k. — ochrona danych adresowych',
    shortTitle: 'Utajnienie danych adresowych',
    category: 'karne',
    kind: 'procedura',
    areas: ['ochrona', 'wykladnie'],
    summary:
      'Dane dotyczące miejsca zamieszkania i pracy pokrzywdzonego lub świadka co do zasady trafiają do odrębnego załącznika adresowego.',
    explanation: [
      'Celem jest ograniczenie ujawniania danych osobom zapoznającym się z protokołem. Przepis przewiduje wyjątki i tryb dostępu, gdy dane mają znaczenie dla rozstrzygnięcia.',
      'Ochrona adresu nie oznacza pełnej anonimowości świadka i nie jest tym samym co instytucja świadka anonimowego.',
    ],
    remember: [
      'Zasygnalizuj organowi realne ryzyko dla bezpieczeństwa.',
      'Nie umieszczaj zbędnych danych adresowych w załącznikach składanych jawnie.',
    ],
    legalBasis: ['art. 148a k.p.k.'],
    tags: ['adres', 'świadek', 'pokrzywdzony', 'bezpieczeństwo danych'],
    related: ['procedura-niebieskiej-karty'],
    sources: [KPK],
  },
  {
    slug: 'inicjatywa-dowodowa-stron',
    title: 'Inicjatywa dowodowa stron',
    shortTitle: 'Zgłaszanie dowodów',
    category: 'karne',
    kind: 'procedura',
    areas: ['argumenty', 'analiza', 'ochrona'],
    summary:
      'Strona powinna wskazywać fakty, które chce wykazać, oraz konkretne dowody; zakres obowiązków różni się w procesie cywilnym i karnym.',
    explanation: [
      'W sprawie cywilnej ciężar wykazania faktu zasadniczo spoczywa na osobie, która wywodzi z niego skutki prawne. Sąd może pominąć dowód spóźniony, nieistotny lub nieprzydatny.',
      'W postępowaniu karnym dowody przeprowadza się na wniosek stron lub z urzędu. Wniosek powinien wskazywać dowód i okoliczność, którą ma potwierdzić.',
    ],
    remember: [
      'Do każdego twierdzenia przypisz dowód i tezę dowodową.',
      'Pilnuj terminów wyznaczonych przez sąd i zachowuj potwierdzenia złożenia pism.',
    ],
    legalBasis: ['art. 6 k.c. i art. 232 k.p.c.', 'art. 167 i 169 k.p.k.'],
    caution: 'Samo dołączenie dużej liczby dokumentów nie zastępuje wyjaśnienia, co z nich wynika.',
    tags: ['dowód', 'wniosek dowodowy', 'ciężar dowodu', 'termin'],
    related: ['art-11-kpc-wiazacy-wyrok-karny', 'stalking-dokumentacyjny'],
    sources: [KC, KPC, KPK],
  },
  {
    slug: 'skarga-nadzwyczajna-i-kasacja-rpo',
    title: 'Skarga nadzwyczajna i kasacja — rola RPO',
    shortTitle: 'Nadzwyczajne środki zaskarżenia',
    category: 'karne',
    kind: 'procedura',
    areas: ['ochrona', 'orzecznictwo'],
    summary:
      'Kasacja i skarga nadzwyczajna to różne, wyjątkowe środki kontroli prawomocnych orzeczeń; w określonych sprawach może je wnieść RPO.',
    explanation: [
      'Nie są kolejną zwykłą apelacją. Każdy środek ma własne przesłanki, terminy, zakres i właściwy sąd. Wniosek do RPO uruchamia analizę, ale nie zobowiązuje Rzecznika do wniesienia środka.',
      'Skuteczny wniosek powinien jasno przedstawić przebieg sprawy, wskazać prawomocne orzeczenia, wykorzystane środki oraz konkretną wadę prawną lub naruszenie praw.',
    ],
    remember: [
      'Dołącz orzeczenia z uzasadnieniami i chronologię środków zaskarżenia.',
      'Nie opieraj wniosku wyłącznie na ocenie, że rozstrzygnięcie jest niesprawiedliwe.',
    ],
    legalBasis: [
      'ustawa o Sądzie Najwyższym — skarga nadzwyczajna',
      'k.p.k. — kasacja, w tym uprawnienia RPO',
    ],
    caution: 'Dopuszczalność zależy od rodzaju sprawy, daty orzeczenia i wcześniejszych środków.',
    tags: ['RPO', 'kasacja', 'skarga nadzwyczajna', 'Sąd Najwyższy'],
    related: ['art-11-kpc-wiazacy-wyrok-karny'],
    sources: [RPO, KPK],
  },
  {
    slug: 'lojalnosc-obroncy',
    title: 'Lojalność obrońcy wobec klienta',
    shortTitle: 'Lojalność obrońcy',
    category: 'etyka',
    kind: 'etyka-zawodowa',
    areas: ['ochrona', 'argumenty'],
    summary:
      'Obrońca ma działać wyłącznie w interesie oskarżonego, z zachowaniem niezależności, tajemnicy i zawodowej staranności.',
    explanation: [
      'Lojalność nie oznacza obowiązku wykonywania każdego polecenia klienta. Prawnik nie może podejmować działań bezprawnych ani wprowadzać sądu w błąd.',
      'Powinien natomiast informować o sytuacji procesowej, ryzykach i możliwych działaniach, konsultować kluczowe decyzje oraz nie porzucać obrony w sposób zagrażający interesom klienta.',
    ],
    remember: [
      'Potwierdzaj ważne ustalenia i przekazanie dokumentów na piśmie.',
      'Proś o wyjaśnienie strategii, terminów i skutków proponowanych decyzji.',
    ],
    legalBasis: ['art. 86 k.p.k.', 'zasady etyki adwokackiej lub radcowskiej'],
    caution:
      'Niekorzystny wynik sprawy sam w sobie nie dowodzi nielojalności ani błędu zawodowego.',
    tags: ['obrońca', 'klient', 'tajemnica', 'staranność'],
    related: ['konflikt-interesow-pelnomocnikow', 'odpowiedzialnosc-dyscyplinarna-prawnika'],
    sources: [KPK, ETHICS],
  },
  {
    slug: 'konflikt-interesow-pelnomocnikow',
    title: 'Konflikt interesów pełnomocników',
    shortTitle: 'Konflikt interesów',
    category: 'etyka',
    kind: 'etyka-zawodowa',
    areas: ['ochrona', 'analiza'],
    summary:
      'Prawnik nie powinien prowadzić sprawy, gdy interes klienta koliduje z interesem innego klienta lub istnieje istotne ryzyko wykorzystania poufnych informacji.',
    explanation: [
      'Ocena obejmuje nie tylko formalne wskazanie pełnomocnika, lecz także powiązania w kancelarii, wcześniejsze zlecenia, dostęp do tajemnicy i rzeczywisty układ interesów.',
      'Samo zatrudnienie dwóch prawników w tej samej organizacji nie zawsze automatycznie rozstrzyga sprawę, ale może wymagać szczególnie uważnej analizy zasad zawodowych.',
    ],
    remember: [
      'Zbierz pełnomocnictwa, nazwy kancelarii i zakres wcześniejszych zleceń.',
      'Wskaż konkretną kolizję interesów lub ryzyko dla tajemnicy.',
    ],
    legalBasis: [
      'zasady etyki właściwego samorządu zawodowego',
      'przepisy procesowe o wyłączeniu obrońcy przy sprzeczności interesów',
    ],
    tags: ['konflikt interesów', 'kancelaria', 'tajemnica zawodowa', 'pełnomocnik'],
    related: ['lojalnosc-obroncy', 'odpowiedzialnosc-dyscyplinarna-prawnika'],
    sources: [ETHICS],
  },
  {
    slug: 'odpowiedzialnosc-dyscyplinarna-prawnika',
    title: 'Odpowiedzialność dyscyplinarna adwokata lub radcy',
    shortTitle: 'Skarga dyscyplinarna',
    category: 'etyka',
    kind: 'procedura',
    areas: ['ochrona'],
    summary:
      'Skargę dotyczącą naruszenia obowiązków zawodowych składa się do właściwego samorządu; postępowanie dyscyplinarne jest odrębne od sprawy sądowej klienta.',
    explanation: [
      'W przypadku adwokata pismo może trafić do właściwej okręgowej rady adwokackiej lub rzecznika dyscyplinarnego. Powinno opisywać konkretne działania, daty, obowiązki i dowody.',
      'Organ dyscyplinarny nie zastępuje sądu odwoławczego i co do zasady nie przyzna odszkodowania. Roszczenie cywilne oraz zawiadomienie ubezpieczyciela OC wymagają osobnej oceny.',
    ],
    remember: [
      'Załącz umowę, korespondencję, potwierdzenia wpłat i pisma procesowe.',
      'Opisz skutek zaniedbania bez obraźliwych ocen.',
    ],
    legalBasis: ['Prawo o adwokaturze lub ustawa o radcach prawnych', 'właściwy kodeks etyki'],
    tags: ['ORA', 'rzecznik dyscyplinarny', 'adwokat', 'radca prawny'],
    related: ['nienalezyte-wykonanie-umowy-przez-prawnika', 'lojalnosc-obroncy'],
    sources: [ETHICS],
  },
  {
    slug: 'kontakt-prawnika-z-przeciwnikiem-procesowym',
    title: 'Kontakt prawnika z przeciwnikiem procesowym',
    shortTitle: 'Granice kontaktu z przeciwnikiem',
    category: 'etyka',
    kind: 'etyka-zawodowa',
    areas: ['ochrona', 'argumenty'],
    summary:
      'Nie istnieje jeden prosty zakaz każdej rozmowy; znaczenie ma reprezentacja strony, cel kontaktu, brak nacisku oraz zasady właściwego samorządu.',
    explanation: [
      'Prawnik powinien unikać obchodzenia ustanowionego pełnomocnika, wywierania niedozwolonej presji, pozyskiwania informacji w sposób nielojalny i wykorzystywania przewagi profesjonalnej.',
      'Ocena konkretnego kontaktu wymaga ustalenia, kto był obecny, czy strona miała pełnomocnika, czego dotyczyła rozmowa i czy sporządzono jej wiarygodny zapis.',
    ],
    remember: [
      'Zapisz datę, uczestników i możliwie dokładny przebieg rozmowy.',
      'Oddziel sam fakt kontaktu od zachowania, które mogło naruszać zasady.',
    ],
    legalBasis: ['zasady etyki właściwego samorządu zawodowego'],
    caution: 'Hasło „zakaz kontaktów” jest uproszczeniem i może prowadzić do błędnych wniosków.',
    tags: ['przeciwnik procesowy', 'kontakt', 'etyka', 'pełnomocnik'],
    related: ['konflikt-interesow-pelnomocnikow', 'zmowa-korytarzowa'],
    sources: [ETHICS],
  },
  {
    slug: 'nienalezyte-wykonanie-umowy-przez-prawnika',
    title: 'Nienależyte wykonanie umowy przez prawnika',
    shortTitle: 'Odpowiedzialność odszkodowawcza prawnika',
    category: 'etyka',
    kind: 'pojecie-prawne',
    areas: ['ochrona', 'argumenty'],
    summary:
      'Odpowiedzialność może powstać, gdy prawnik naruszył zawodowy standard staranności, powodując możliwą do wykazania szkodę.',
    explanation: [
      'Trzeba wykazać obowiązek wynikający z umowy, jego niewykonanie lub nienależyte wykonanie, szkodę oraz związek przyczynowy. Przegranie sprawy nie jest samo w sobie dowodem błędu.',
      'Przykładowe problemy to zawiniony brak środka zaskarżenia, uchybienie terminowi lub nieprzekazanie kluczowej informacji. Każdy przypadek wymaga oceny, czy prawidłowe działanie dawało realną szansę innego rezultatu.',
    ],
    remember: [
      'Zabezpiecz umowę, rachunki, korespondencję i akta.',
      'Ustal dokładnie, jaka szkoda wynika z konkretnego zaniedbania.',
    ],
    legalBasis: [
      'art. 355 § 2 i art. 471 k.c.',
      'przepisy o zleceniu stosowane odpowiednio do świadczenia usług',
    ],
    tags: ['odszkodowanie', 'błąd zawodowy', 'umowa', 'OC'],
    related: ['odpowiedzialnosc-dyscyplinarna-prawnika', 'lojalnosc-obroncy'],
    sources: [KC],
  },
  {
    slug: 'stalking-dokumentacyjny',
    title: 'Stalking dokumentacyjny',
    shortTitle: 'Stalking dokumentacyjny',
    category: 'psychologia',
    kind: 'model-adamowo',
    areas: ['mechanizmy', 'analiza', 'argumenty'],
    summary:
      'Model opisuje systematyczne tworzenie jednostronnej dokumentacji, która ma z czasem zastąpić pełny obraz relacji i zdarzeń.',
    explanation: [
      'Mogą to być liczne notatki, zgłoszenia, wiadomości i nagrania pozbawione kontekstu, powtarzające tę samą interpretację. Sama liczba dokumentów może następnie sprawiać wrażenie niezależnego potwierdzenia.',
      'Analiza powinna rozdzielać źródła pierwotne od powtórzeń, sprawdzać czas powstania zapisów i szukać materiału weryfikującego kontekst.',
    ],
    remember: [
      'Twórz oś czasu i grupuj dokumenty według ich pierwotnego źródła.',
      'Szukaj danych niezależnych: metadanych, świadków, nagrań i dokumentacji instytucjonalnej.',
    ],
    caution:
      'To autorskie pojęcie analityczne ADAMOWO, nie nazwa przestępstwa ani diagnoza kliniczna.',
    tags: ['dokumentacja', 'narracja', 'chronologia', 'dowody'],
    related: ['pomiary-inwigilacyjne', 'sfabrykowane-oskarzenia-i-prowokacje'],
  },
  {
    slug: 'odwrocony-triaz-priorytetow',
    title: 'Odwrócony triaż priorytetów',
    shortTitle: 'Odwrócony triaż priorytetów',
    category: 'psychologia',
    kind: 'model-adamowo',
    areas: ['mechanizmy', 'analiza'],
    summary:
      'Model opisuje sytuację, w której dokumentowanie lub budowanie przewagi zostaje postawione ponad pilną pomocą i ograniczeniem szkody.',
    explanation: [
      'Przykładem jest skupienie się na uzyskaniu korzystnego zapisu z incydentu zamiast na uspokojeniu sytuacji albo wezwaniu adekwatnej pomocy. Później sam zapis może być przedstawiany jako neutralny obraz zdarzenia.',
      'W analizie trzeba porównać, co uczestnicy wiedzieli w danym momencie, jakie mieli bezpieczne możliwości działania i czy reakcja była proporcjonalna do zagrożenia.',
    ],
    remember: [
      'Najpierw odtwórz kolejność decyzji i dostępne alternatywy.',
      'Nie przypisuj motywu wyłącznie na podstawie skutku.',
    ],
    caution: 'To model analityczny ADAMOWO, a nie uznany termin medyczny lub prawny.',
    tags: ['priorytety', 'prowokacja', 'zaniechanie', 'dokumentacja'],
    related: ['sfabrykowane-oskarzenia-i-prowokacje', 'stalking-dokumentacyjny'],
  },
  {
    slug: 'projekcja-psychologiczna',
    title: 'Projekcja psychologiczna',
    shortTitle: 'Projekcja',
    category: 'psychologia',
    kind: 'psychologia',
    areas: ['mechanizmy', 'analiza'],
    summary:
      'Projekcja to pojęcie opisujące przypisywanie innym własnych nieakceptowanych uczuć, impulsów lub cech.',
    explanation: [
      'W konflikcie może przejawiać się oskarżaniem drugiej osoby o zachowania podobne do własnych. Samo podobieństwo zarzutów nie pozwala jednak pewnie rozpoznać projekcji.',
      'W materiale edukacyjnym pojęcie pomaga stawiać hipotezy, lecz fakty powinny być oceniane niezależnie od etykiety psychologicznej.',
    ],
    remember: [
      'Opisuj obserwowalne zachowania przed interpretacją mechanizmu.',
      'Rozważ alternatywne wyjaśnienia i sprawdzalne dowody.',
    ],
    caution: 'To pojęcie psychologiczne, nie samodzielny dowód kłamstwa ani diagnoza osoby.',
    tags: ['projekcja', 'mechanizm obronny', 'oskarżenie', 'interpretacja'],
    related: ['sfabrykowane-oskarzenia-i-prowokacje'],
  },
  {
    slug: 'mechanizm-zywego-stempla',
    title: 'Mechanizm „żywego stempla”',
    shortTitle: '„Żywy stempel”',
    category: 'psychologia',
    kind: 'model-adamowo',
    areas: ['mechanizmy', 'analiza', 'ochrona'],
    summary:
      'Model opisuje instrumentalne wykorzystywanie osoby z ograniczeniami poznawczymi do zatwierdzania cudzych decyzji lub narracji.',
    explanation: [
      'Sygnałem może być powtarzanie gotowych sformułowań, podpisywanie niezrozumiałych dokumentów, izolowanie od niezależnej porady albo nagłe decyzje sprzeczne z wcześniejszym postępowaniem.',
      'Analiza nie może opierać się na samym wieku lub chorobie. Potrzebne są dowody stanu w chwili czynności, sposobu przekazania informacji i realnej samodzielności decyzji.',
    ],
    remember: [
      'Porównuj język dokumentu z naturalnym sposobem wypowiedzi osoby.',
      'Zabezpiecz informacje o stanie i okolicznościach konkretnej czynności.',
    ],
    caution:
      'To autorski model ADAMOWO. Nie zastępuje oceny zdolności do świadomego i swobodnego działania ani opinii biegłego.',
    tags: ['instrumentalizacja', 'ubytki poznawcze', 'podpis', 'wpływ'],
    related: ['art-82-kc-brak-swiadomosci-lub-swobody', 'pelnomocnictwo-notarialne'],
  },
  {
    slug: 'deprywacja-przestrzeni-zyciowej',
    title: 'Deprywacja przestrzeni życiowej',
    shortTitle: 'Wypieranie z przestrzeni życiowej',
    category: 'psychologia',
    kind: 'model-adamowo',
    areas: ['mechanizmy', 'analiza', 'ochrona'],
    summary:
      'Model opisuje stopniowe ograniczanie dostępu do pomieszczeń, rzeczy, prywatności i bezpiecznego funkcjonowania w domu.',
    explanation: [
      'Może obejmować zajmowanie przestrzeni, blokowanie swobodnego korzystania z domu, naruszanie prywatności lub tworzenie warunków skłaniających osobę do izolacji w jednym miejscu.',
      'Późniejsza izolacja może zostać przedstawiona jako dobrowolny wybór. Dlatego potrzebna jest chronologia zmian, opis warunków i rozróżnienie prawa do lokalu od faktycznej możliwości korzystania.',
    ],
    remember: [
      'Dokumentuj zmiany dostępu i warunków, nie tylko końcowy stan.',
      'Sprawdź tytuły prawne, ustalenia domowe i możliwe środki bezpieczeństwa.',
    ],
    caution: 'To termin opisowy ADAMOWO, nie odrębna kwalifikacja prawna.',
    tags: ['dom', 'izolacja', 'przestrzeń', 'kontrola'],
    related: ['art-296-kc-sluzebnosc-osobista-mieszkania', 'art-207-kk-znecanie-sie'],
  },
  {
    slug: 'szantaz-emocjonalny-i-majatkowy',
    title: 'Szantaż emocjonalny i majątkowy',
    shortTitle: 'Szantaż emocjonalny i majątkowy',
    category: 'psychologia',
    kind: 'psychologia',
    areas: ['mechanizmy', 'ochrona', 'analiza'],
    summary:
      'To presja oparta na groźbie utraty relacji, bezpieczeństwa, mieszkania lub pieniędzy, jeżeli osoba nie podporządkuje się żądaniu.',
    explanation: [
      'Charakterystyczne jest ultimatum łączące emocjonalną więź z decyzją majątkową. Presja może być realna nawet wtedy, gdy nie spełnia znamion groźby bezprawnej z kodeksu karnego.',
      'W analizie warto oddzielić legalną propozycję negocjacyjną od wykorzystywania zależności, strachu, choroby albo braku alternatywy.',
    ],
    remember: [
      'Zapisz dokładną treść żądania, warunek i zapowiedziany skutek.',
      'Nie podejmuj nieodwracalnej decyzji bez niezależnej porady i czasu do namysłu.',
    ],
    caution:
      'Pojęcie psychologiczne nie przesądza odpowiedzialności karnej; znaczenie ma forma i treść konkretnego nacisku.',
    tags: ['szantaż', 'ultimatum', 'majątek', 'presja'],
    related: ['art-191-kk-zmuszanie', 'pelnomocnictwo-notarialne'],
  },
  {
    slug: 'sfabrykowane-oskarzenia-i-prowokacje',
    title: 'Sfabrykowane oskarżenia i prowokacje behawioralne',
    shortTitle: 'Fabrykowanie incydentów',
    category: 'psychologia',
    kind: 'model-adamowo',
    areas: ['mechanizmy', 'analiza', 'argumenty'],
    summary:
      'Model opisuje celowe tworzenie lub eskalowanie sytuacji, aby uzyskać nagranie, interwencję albo dokument wspierający wcześniej przyjętą narrację.',
    explanation: [
      'Możliwy schemat obejmuje przygotowanie rejestracji, wybór momentu wysokiego napięcia, prowokowanie reakcji i przedstawienie samego finału bez wcześniejszego kontekstu.',
      'Podejrzenie trzeba testować: analizować pełne nagrania, metadane, zachowanie wszystkich stron przed zdarzeniem i niezależne relacje. Nie wolno zakładać inscenizacji tylko dlatego, że materiał jest niekorzystny.',
    ],
    remember: [
      'Zabezpieczaj oryginalne, pełne pliki z metadanymi.',
      'Porównuj czas rozpoczęcia nagrania z początkiem opisywanego konfliktu.',
    ],
    caution:
      'To hipoteza analityczna wymagająca dowodów, nie automatyczna ocena każdego nagrania lub zgłoszenia.',
    tags: ['prowokacja', 'nagranie', 'interwencja', 'kontekst'],
    related: ['art-234-kk-falszywe-oskarzenie', 'stalking-dokumentacyjny'],
  },
  {
    slug: 'pomiary-inwigilacyjne',
    title: 'Pomiary inwigilacyjne zachowań domowych',
    shortTitle: 'Pomiary inwigilacyjne',
    category: 'psychologia',
    kind: 'model-adamowo',
    areas: ['mechanizmy', 'analiza', 'ochrona'],
    summary:
      'Model opisuje chroniczne notowanie, nasłuchiwanie i kontrolowanie codziennych zachowań w celu wywierania presji lub budowania jednostronnej dokumentacji.',
    explanation: [
      'Pojedyncza notatka lub legalne zabezpieczenie dowodu nie tworzy jeszcze wzorca. Istotne są skala, powtarzalność, ingerencja w prywatność, sposób użycia materiału i wpływ na funkcjonowanie domowników.',
      'Ocena prawna nagrywania i monitorowania zależy od miejsca, uczestnictwa w rozmowie, sposobu pozyskania informacji oraz późniejszego wykorzystania.',
    ],
    remember: [
      'Twórz chronologię incydentów i opisuj wpływ na codzienne życie.',
      'Nie publikuj prywatnych nagrań ani danych bez sprawdzenia podstaw prawnych.',
    ],
    caution:
      'To opis wzorca zachowań, nie ustawowa nazwa przestępstwa. Legalność każdej formy rejestracji ocenia się oddzielnie.',
    tags: ['inwigilacja', 'podsłuchiwanie', 'prywatność', 'kontrola'],
    related: ['stalking-dokumentacyjny', 'deprywacja-przestrzeni-zyciowej'],
  },
  {
    slug: 'zmowa-korytarzowa',
    title: 'Zmowa korytarzowa',
    shortTitle: 'Zmowa korytarzowa',
    category: 'psychologia',
    kind: 'model-adamowo',
    areas: ['mechanizmy', 'analiza', 'ochrona'],
    summary:
      'Model opisuje nieformalną, nieudokumentowaną presję wywieraną poza salą lub oficjalnym spotkaniem, aby skłonić osobę do rezygnacji albo zmiany stanowiska.',
    explanation: [
      'Typowa trudność polega na braku protokołu i przewadze kilku uczestników nad jedną osobą. Treścią może być przedstawienie kapitulacji jako jedynego rozsądnego wyjścia albo wykorzystanie silnego stresu.',
      'Nie każda rozmowa na korytarzu jest zmową. Trzeba ustalić uczestników, zgodność ich działań, treść nacisku i związek z późniejszą decyzją.',
    ],
    remember: [
      'Po rozmowie sporządź datowaną notatkę i wyślij potwierdzenie ustaleń.',
      'Przy ważnych decyzjach poproś o przedstawienie propozycji na piśmie.',
    ],
    caution:
      'To autorski model ADAMOWO, nie termin kodeksowy. Ewentualne zmuszanie ocenia się według konkretnych znamion prawa.',
    tags: ['korytarz', 'presja', 'pełnomocnik', 'kapitulacja'],
    related: ['art-191-kk-zmuszanie', 'kontakt-prawnika-z-przeciwnikiem-procesowym'],
  },
];

export const knowledgeBySlug = new Map(knowledgeEntries.map((entry) => [entry.slug, entry]));
