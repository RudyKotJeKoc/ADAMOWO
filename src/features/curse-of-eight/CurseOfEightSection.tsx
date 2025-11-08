import clsx from 'clsx';
import { useState } from 'react';
import type { ReactElement } from 'react';

import {
  eightOccurrences,
  cyclePhases,
  culturalMeanings,
  statisticalNote,
} from './curse-of-eight.data';
import type { EightOccurrence, CyclePhase } from './curse-of-eight.data';

export function CurseOfEightSection(): ReactElement {
  const [selectedOccurrence, setSelectedOccurrence] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  return (
    <section
      role="region"
      aria-labelledby="curse-of-eight-heading"
      className="rounded-3xl border border-base-800/70 bg-base-950/60 px-4 py-8 shadow-[0_30px_80px_rgba(10,14,39,0.45)] backdrop-blur-lg sm:px-6 lg:px-10"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {/* Header */}
        <header className="space-y-4 text-base-100">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-accent-300">
            ANALIZA SYMBOLICZNA
          </p>
          <h2
            id="curse-of-eight-heading"
            className="text-3xl font-semibold text-base-50 sm:text-4xl"
          >
            Klątwa Ósemki: Anatomia Nieskończonej Pętli
          </h2>
          <p className="max-w-3xl text-lg font-medium text-accent-200">
            Adamowo 8, 89-422 Sypniewo – Dom, Który Zamyka Koło
          </p>
        </header>

        {/* Introduction */}
        <div className="rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 via-accent-400/5 to-transparent p-6">
          <h3 className="mb-3 text-xl font-semibold text-accent-200">
            🏠 Kiedy Adres Staje Się Wyrokiem
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-base-200">
            Niektóre miejsca są naznaczone. Nie przez duchy czy przekleństwa, ale przez matematykę
            losu, która zapisuje się w datach, liczbach i cyklach niemożliwych do zignorowania.
          </p>
          <p className="text-sm leading-relaxed text-base-100">
            <strong>Adamowo 8</strong> to nie tylko adres. To symbol zamkniętej pętli, z której nie
            ma ucieczki. Dom, którego numer - <strong>ósemka</strong> - od zawsze szeptał o tym, co
            nieuniknione: wiecznym powrocie do początku.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-base-200">
            Ósemka. Symbol matematycznej nieskończoności (∞). W mitologii - <em>Uroboros</em>, wąż
            pożerający własny ogon. W sadze Adamskich - pętla konfliktu, która zatoczyła pełne koło
            przez osiem lat, by powrócić tam, gdzie się zaczęła.
          </p>
        </div>

        {/* Eight Occurrences */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-base-50">♾️ Odkrycie: Ósemka Wszędzie</h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {eightOccurrences.map((occurrence) => (
              <OccurrenceCard
                key={occurrence.id}
                occurrence={occurrence}
                isSelected={selectedOccurrence === occurrence.id}
                onClick={() =>
                  setSelectedOccurrence(selectedOccurrence === occurrence.id ? null : occurrence.id)
                }
              />
            ))}
          </div>
        </div>

        {/* Cycle Diagram */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-base-50">
            🔄 Wzorzec Nieskończoności: Cztery Fazy
          </h3>

          <div className="space-y-4">
            {cyclePhases.map((phase, index) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                isSelected={selectedPhase === phase.id}
                onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                index={index}
              />
            ))}
          </div>

          {/* Visual Diagram */}
          <div className="rounded-2xl border border-base-800/60 bg-base-950/40 p-8">
            <h4 className="mb-6 text-center text-lg font-semibold text-base-50">
              📊 Mapa Ósemki: Wizualizacja Pętli
            </h4>
            <pre className="overflow-x-auto text-center text-xs leading-relaxed text-accent-300 sm:text-sm">
              {`        7.07.2017
           ○
          ╱ ╲
         ╱   ╲
    4 lata   ╲
       ╱       ╲
      ╱    17→18.07.2021
     ╱           ○
    ○            │
POCZĄTEK    TRANSFORMACJA
    │            │
    │       SIERPIEŃ 2021
    │         (8. miesiąc)
    │            │
    │       4 lata
    │            │
    │            ╲
    │             ╲
    ╲              ○
     ╲         7.07.2025
      ╲          KONIEC
       ╲        = POCZĄTEK
        ●─────────●
      PĘTLA ZAMKNIĘTA`}
            </pre>
            <p className="mt-6 text-center text-sm font-semibold text-accent-200">
              Adamowo 8, 89-422 Sypniewo
              <br />
              Dom, który nie puszcza. Adres, który stał się wyrokiem.
              <br />
              Ósemka, która zamknęła koło.
            </p>
          </div>
        </div>

        {/* Cultural Symbolism */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-base-50">
            🎭 Symboliczne Znaczenie Ósemki w Kulturze
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            {culturalMeanings.map((meaning, index) => (
              <div
                key={index}
                className="rounded-xl border border-base-800/60 bg-base-950/40 p-6 text-center"
              >
                <div className="mb-2 text-3xl">{meaning.symbol}</div>
                <h4 className="mb-2 text-lg font-semibold text-accent-200">{meaning.category}</h4>
                <p className="text-sm text-base-200">{meaning.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-accent-500/30 bg-accent-500/10 p-4">
            <p className="text-sm italic leading-relaxed text-base-100">
              "Ósemka jest tu symbolem pułapki, z której nie ma ucieczki. Zwycięstwo Barbary staje
              się jej wiecznym więzieniem, bo osiem lat konfliktu prowadzi do pełnej kontroli, ale w
              atmosferze pustki, osamotnienia i grozy."
            </p>
          </div>
        </div>

        {/* Statistical Analysis */}
        <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 via-red-400/5 to-transparent p-6">
          <h3 className="mb-4 text-xl font-semibold text-red-200">
            💡 Kluczowe Odkrycie: Matematyka Nie Kłamie
          </h3>

          <div className="mb-4 space-y-2">
            <p className="text-sm font-semibold text-base-100">
              Częstotliwość występowania cyfry 8 w sprawie:
            </p>
            <ul className="space-y-1 text-sm text-base-200">
              <li className="flex items-start gap-2">
                <span className="text-accent-400">✅</span>
                <span>Adres: Adamowo 8</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400">✅</span>
                <span>Długość cyklu: 8 lat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400">✅</span>
                <span>Przejście: 17→18 lipca</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400">✅</span>
                <span>Miesiąc kluczowy: sierpień (8)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400">✅</span>
                <span>Urodziny Dariusza: 12.08</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400">✅</span>
                <span>Repertorium aktu: 8310</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400">✅</span>
                <span>Sylwester urodzony: 28.11</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400">✅</span>
                <span>PESEL Barbary: ...08684</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400">✅</span>
                <span>Wartość: 7200 = 900 × 8</span>
              </li>
            </ul>
          </div>

          <p className="text-sm leading-relaxed text-base-200">{statisticalNote}</p>
        </div>

        {/* Conclusion */}
        <div className="space-y-6 rounded-2xl border border-base-800/60 bg-base-950/40 p-6">
          <h3 className="text-2xl font-semibold text-base-50">📍 Finał: Dom Oznaczony Ósemką</h3>

          <div className="space-y-4 text-sm leading-relaxed text-base-200">
            <p>
              <strong className="text-base-50">Adamowo 8</strong> nigdy nie było zwykłym adresem.
            </p>
            <p>
              Od momentu, gdy Sylwester Adamski podpisał akt darowizny 7.07.2017, uruchomił{' '}
              <strong className="text-accent-300">ośmioletni mechanizm zegarowy</strong>, który
              tykał nieubłaganie przez:
            </p>
            <ul className="ml-4 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-accent-400">•</span>
                <span>4 lata pozornego spokoju</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400">•</span>
                <span>Transformację w nocy 17→18 lipca 2021</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400">•</span>
                <span>Sierpniową eskalację prawną</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400">•</span>
                <span>4 lata procesu</span>
              </li>
            </ul>
            <p>
              By powrócić tam, gdzie się zaczął:{' '}
              <strong className="text-accent-300">7 lipca 2025</strong>.
            </p>
            <p className="text-center text-lg font-semibold text-accent-200">
              Osiem lat. Dokładnie osiem.
              <br />
              Jak Uroboros. Jak znak nieskończoności. Jak przekleństwo.
            </p>
          </div>

          <div className="rounded-lg border border-accent-500/30 bg-accent-500/10 p-4">
            <h4 className="mb-2 text-base font-semibold text-accent-200">🔮 Przepowiednia:</h4>
            <p className="mb-2 text-sm text-base-100">
              Czy 7 lipca 2025 rzeczywiście zamknie pętlę?
              <br />
              Czy Uroboros sfinalizuje swój posiłek?
              <br />
              Czy dom pod numerem 8 wypuści swoich mieszkańców?
            </p>
            <p className="text-sm font-semibold text-accent-300">
              Ale jedno jest pewne:
              <br />
              Matematyka nie kłamie. Wzorce się powtarzają.
              <br />A ósemka w Adamowie 8 od zawsze znała zakończenie tej historii.
            </p>
          </div>

          <div className="border-t border-base-800/60 pt-4">
            <p className="text-xs text-base-300">
              <strong>Źródła:</strong> Wszystkie daty, liczby i fakty pochodzą z oficjalnej
              dokumentacji sądowej i notarialnej. Symbolika jest interpretacją wzorców
              matematycznych występujących w rzeczywistych zdarzeniach.
            </p>
            <p className="mt-2 text-center text-sm font-semibold text-accent-300">
              ♾️ Koniec. Albo początek. W pętli nigdy nie wiadomo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function OccurrenceCard({
  occurrence,
  isSelected,
  onClick,
}: {
  occurrence: EightOccurrence;
  isSelected: boolean;
  onClick: () => void;
}): ReactElement {
  const significanceColors = {
    critical: 'from-red-500/20 via-red-400/10 to-transparent border-red-500/40',
    high: 'from-orange-500/20 via-orange-400/10 to-transparent border-orange-500/40',
    medium: 'from-yellow-500/20 via-yellow-400/10 to-transparent border-yellow-500/40',
  };

  return (
    <article
      className={clsx(
        'group relative isolate overflow-hidden rounded-2xl border transition-all duration-300',
        isSelected
          ? significanceColors[occurrence.significance]
          : 'border-base-800/60 hover:border-accent-400/40'
      )}
    >
      <div
        aria-hidden="true"
        className={clsx(
          'pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br transition duration-300',
          significanceColors[occurrence.significance],
          isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'
        )}
      />

      <button
        onClick={onClick}
        className="w-full p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        aria-expanded={isSelected}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-base-950/80 text-xl">
              {occurrence.icon}
            </span>
            <div className="flex-1">
              <h4 className="mb-1 text-base font-semibold text-base-50">{occurrence.title}</h4>
              <p className="text-sm text-base-200">{occurrence.description}</p>
            </div>
            <span
              className={clsx(
                'text-lg transition-transform duration-300',
                isSelected ? 'rotate-180' : ''
              )}
              aria-hidden="true"
            >
              ▼
            </span>
          </div>
        </div>
      </button>

      {isSelected && (
        <div className="border-t border-base-800/60 bg-base-950/40 p-5 pt-4">
          <ul className="space-y-2">
            {occurrence.details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-base-200">
                <span className="mt-1 text-accent-400">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function PhaseCard({
  phase,
  isSelected,
  onClick,
  index,
}: {
  phase: CyclePhase;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}): ReactElement {
  const phaseColors = [
    'from-blue-500/20 to-blue-400/10',
    'from-purple-500/20 to-purple-400/10',
    'from-orange-500/20 to-orange-400/10',
    'from-red-500/20 to-red-400/10',
  ];

  return (
    <article
      className={clsx(
        'rounded-2xl border transition-all duration-300',
        isSelected
          ? 'border-accent-400/60 bg-base-900/70 shadow-lg shadow-accent-500/20'
          : 'border-base-800/60 bg-base-950/70 hover:border-accent-400/40'
      )}
    >
      <button
        onClick={onClick}
        className="w-full p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        aria-expanded={isSelected}
      >
        <div className="flex items-start gap-4">
          <div
            className={clsx(
              'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-base-800/60 bg-gradient-to-br text-2xl',
              phaseColors[index]
            )}
          >
            {phase.symbol}
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="text-lg font-semibold text-base-50">{phase.title}</h4>
            <p className="text-sm font-medium text-accent-300">{phase.date}</p>
            <p className="text-sm text-base-200">{phase.description}</p>
          </div>
        </div>
      </button>
    </article>
  );
}
