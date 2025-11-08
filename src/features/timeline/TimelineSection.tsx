import clsx from 'clsx';
import { useState } from 'react';
import type { ReactElement } from 'react';

import { timelinePhases, discoveries } from './timeline.data';
import type { TimelinePhase, TimelineDiscovery } from './timeline.data';

export function TimelineSection(): ReactElement {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedDiscovery, setSelectedDiscovery] = useState<string | null>(null);

  return (
    <section
      role="region"
      aria-labelledby="timeline-heading"
      className="rounded-3xl border border-base-800/70 bg-base-950/60 px-4 py-8 shadow-[0_30px_80px_rgba(10,14,39,0.45)] backdrop-blur-lg sm:px-6 lg:px-10"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {/* Header */}
        <header className="space-y-4 text-base-100">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-accent-300">
            INTERAKTYWNA ANALIZA
          </p>
          <h2 id="timeline-heading" className="text-3xl font-semibold text-base-50 sm:text-4xl">
            Kalendarz jako Broń: Anatomia Zaplanowanego Konfliktu
          </h2>
          <p className="max-w-3xl text-base-200">
            Kiedy chronologia wydarzeń układa się w zbyt precyzyjny wzór, powstaje pytanie: czy to
            przypadek, czy strategia? Poniższa analiza ujawnia fascynujące powiązania między datami
            w sprawie rodziny Adamskich.
          </p>
        </header>

        {/* Introduction Box */}
        <div className="rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 via-accent-400/5 to-transparent p-6">
          <h3 className="mb-3 text-xl font-semibold text-accent-200">
            🎯 Wprowadzenie: Kiedy Czas Staje Się Strategią
          </h3>
          <p className="text-sm leading-relaxed text-base-200">
            W większości sporów rodzinnych daty są przypadkowe – wynikają z emocji, impulsów,
            nieplanowanych kłótni. Ale co się dzieje, gdy chronologia wydarzeń układa się w zbyt
            precyzyjny wzór? Gdy każda interwencja, każde pismo i każdy dokument prawny pojawiają
            się dokładnie wtedy, kiedy wywołują maksymalny efekt?
          </p>
        </div>

        {/* Timeline Phases */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-base-50">📊 Oś Czasu: Kluczowe Momenty</h3>

          <div className="relative space-y-4">
            {/* Timeline vertical line */}
            <div
              aria-hidden="true"
              className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-accent-500/50 via-accent-400/30 to-accent-500/50 sm:left-8"
            />

            {timelinePhases.map((phase, index) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                isSelected={selectedPhase === phase.id}
                onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Discoveries Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-base-50">💡 Kluczowe Odkrycia</h3>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {discoveries.map((discovery) => (
              <DiscoveryCard
                key={discovery.id}
                discovery={discovery}
                isSelected={selectedDiscovery === discovery.id}
                onClick={() =>
                  setSelectedDiscovery(selectedDiscovery === discovery.id ? null : discovery.id)
                }
              />
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div className="space-y-6 rounded-2xl border border-base-800/60 bg-base-950/40 p-6">
          <h3 className="text-2xl font-semibold text-base-50">
            📍 Wzorzec Niemożliwy do Zignorowania
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-accent-200">Kluczowe obserwacje:</h4>
              <ul className="space-y-2 text-sm text-base-200">
                <li className="flex items-start gap-2">
                  <span className="text-accent-400">✅</span>
                  <span>
                    <strong>Wizyta u prawnika (29.03)</strong> poprzedza oficjalną eskalację o 4
                    miesiące
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-400">✅</span>
                  <span>
                    <strong>Pełnomocnictwo (19.07)</strong> pojawia się 2 dni po pierwszej
                    interwencji
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-400">✅</span>
                  <span>
                    <strong>Niebieska Karta (29.07)</strong> uruchamiana dzień po wyjeździe
                    "sprawcy"
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-400">✅</span>
                  <span>
                    <strong>Sprzeczność 3-6 sierpnia</strong> ujawnia manipulację zeznaniami
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-400">✅</span>
                  <span>
                    <strong>Wszystkie daty</strong> układają się w perfekcyjną sekwencję prawną
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-accent-500/30 bg-accent-500/10 p-4">
              <h4 className="mb-2 text-lg font-semibold text-accent-200">🎯 Konkluzja:</h4>
              <p className="text-sm leading-relaxed text-base-100">
                <strong>To nie jest chronologia spontanicznego konfliktu rodzinnego.</strong>
                <br />
                <strong>To kalendarz zaplanowanej operacji prawnej.</strong>
              </p>
              <p className="mt-3 text-sm text-base-200">
                Każda data została wybrana lub wykorzystana tak, aby: maksymalizować efekt prawny,
                minimalizować możliwość obrony, budować spójną narrację pod pozew.
              </p>
            </div>

            <div className="rounded-lg border border-base-800/60 bg-base-900/50 p-4">
              <h4 className="mb-2 text-lg font-semibold text-base-50">💡 Dla Czytelnika</h4>
              <p className="mb-2 text-sm text-base-200">
                <strong>Jeśli to wszystko jest przypadkiem</strong>, to należy przyznać, że los ma
                niezwykłe wyczucie dramaturgii i precyzję szwajcarskiego zegara.
              </p>
              <p className="text-sm text-base-200">
                <strong>Jeśli to nie jest przypadek</strong>, to jesteś świadkiem jednej z
                najbardziej precyzyjnie zaplanowanych rodzinnych batalii prawnych w historii
                polskiego sądownictwa.
              </p>
              <p className="mt-3 text-sm font-semibold text-accent-300">Ty zdecyduj.</p>
            </div>
          </div>

          <div className="border-t border-base-800/60 pt-4">
            <h4 className="mb-2 text-sm font-semibold text-base-200">📌 Źródła i Weryfikacja</h4>
            <p className="text-xs text-base-300">
              Wszystkie daty i fakty można zweryfikować w: aktach notarialnych (Rep. A Nr 8310/2017,
              Rep. A Nr 10381/2021), protokołach policyjnych (interwencje 17-18.07, 25.07.2021),
              dokumentach sądowych (II K 568/21), notatniku Barbary Adamskiej (dowód w sprawie).
            </p>
            <p className="mt-2 text-xs font-semibold text-accent-300">
              Dane nie kłamią. Wzorce mówią same za siebie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhaseCard({
  phase,
  isSelected,
  onClick,
  index,
}: {
  phase: TimelinePhase;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}): ReactElement {
  const hasEvents = phase.events.length > 0;

  return (
    <article
      className={clsx(
        'relative ml-12 rounded-2xl border transition-all duration-300 sm:ml-16',
        isSelected
          ? 'border-accent-400/60 bg-base-900/70 shadow-lg shadow-accent-500/20'
          : 'border-base-800/60 bg-base-950/70 hover:border-accent-400/40'
      )}
    >
      {/* Timeline dot */}
      <div
        aria-hidden="true"
        className={clsx(
          'absolute -left-[2.6rem] top-6 flex h-8 w-8 items-center justify-center rounded-full border-4 border-base-950 sm:-left-[3.1rem]',
          `bg-gradient-to-br ${phase.color}`
        )}
      >
        <span className="text-xs font-bold text-base-50">{index + 1}</span>
      </div>

      <button
        onClick={onClick}
        className="w-full p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        aria-expanded={isSelected}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h4 className="text-lg font-semibold text-base-50">{phase.title}</h4>
              <p className="text-sm font-medium text-accent-300">{phase.dateRange}</p>
            </div>
            {hasEvents && (
              <span
                className={clsx(
                  'text-2xl transition-transform duration-300',
                  isSelected ? 'rotate-180' : ''
                )}
                aria-hidden="true"
              >
                ▼
              </span>
            )}
          </div>
          <p className="text-sm text-base-200">{phase.description}</p>
        </div>
      </button>

      {/* Events - expandable */}
      {hasEvents && isSelected && (
        <div className="border-t border-base-800/60 p-6 pt-4">
          <ul className="space-y-3">
            {phase.events.map((event, eventIndex) => (
              <li
                key={eventIndex}
                className={clsx(
                  'rounded-lg border p-3',
                  event.importance === 'critical'
                    ? 'border-red-500/40 bg-red-500/10'
                    : event.importance === 'high'
                      ? 'border-orange-500/40 bg-orange-500/10'
                      : event.importance === 'medium'
                        ? 'border-yellow-500/40 bg-yellow-500/10'
                        : 'border-base-800/60 bg-base-900/50'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold text-base-50">{event.title}</p>
                    <p className="text-xs text-base-300">{event.description}</p>
                  </div>
                  <span className="whitespace-nowrap text-xs font-medium text-accent-300">
                    {event.date}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function DiscoveryCard({
  discovery,
  isSelected,
  onClick,
}: {
  discovery: TimelineDiscovery;
  isSelected: boolean;
  onClick: () => void;
}): ReactElement {
  return (
    <article
      className={clsx(
        'group relative isolate overflow-hidden rounded-2xl border transition-all duration-300',
        isSelected
          ? 'border-accent-400/60 shadow-lg shadow-accent-500/20'
          : 'border-base-800/60 hover:border-accent-400/40'
      )}
    >
      <div
        aria-hidden="true"
        className={clsx(
          'pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br opacity-80 transition duration-300',
          discovery.color,
          isSelected ? 'opacity-100' : 'group-hover:opacity-90'
        )}
      />

      <button
        onClick={onClick}
        className="w-full p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        aria-expanded={isSelected}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-base-950/80 text-2xl">
              {discovery.emoji}
            </span>
            <div className="flex-1">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-300">
                Odkrycie #{discovery.number}
              </div>
              <h4 className="text-base font-semibold text-base-50">{discovery.title}</h4>
            </div>
            <span
              className={clsx(
                'text-xl transition-transform duration-300',
                isSelected ? 'rotate-180' : ''
              )}
              aria-hidden="true"
            >
              ▼
            </span>
          </div>

          <p className="text-sm text-base-200">{discovery.description}</p>
        </div>
      </button>

      {isSelected && (
        <div className="border-t border-base-800/60 bg-base-950/40 p-6 pt-4">
          <ul className="space-y-2">
            {discovery.details.map((detail, index) => (
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
