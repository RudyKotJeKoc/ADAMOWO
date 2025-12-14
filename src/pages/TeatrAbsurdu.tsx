import type { ReactElement } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

/**
 * Teatr Absurdu Page
 *
 * Educational page exploring the parallels between Theatre of the Absurd
 * and real-life manipulation scenarios. Examines how absurdist theatrical
 * techniques mirror psychological manipulation patterns.
 *
 * Features:
 * - Overview of Theatre of the Absurd concepts
 * - Parallels between absurdist theatre and manipulation
 * - Key playwrights and their works
 * - Interactive expandable sections
 * - Responsive design with dark theme
 */
export default function TeatrAbsurdu(): ReactElement {
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  // Key absurdist concepts with parallels to manipulation
  const sections = [
    {
      id: 'meaninglessness',
      icon: '🎭',
      color: '#9333ea',
      titleKey: 'teatrAbsurdu.sections.meaninglessness.title',
      descKey: 'teatrAbsurdu.sections.meaninglessness.description',
    },
    {
      id: 'circular-logic',
      icon: '🔄',
      color: '#dc2626',
      titleKey: 'teatrAbsurdu.sections.circularLogic.title',
      descKey: 'teatrAbsurdu.sections.circularLogic.description',
    },
    {
      id: 'language-breakdown',
      icon: '💬',
      color: '#ea580c',
      titleKey: 'teatrAbsurdu.sections.languageBreakdown.title',
      descKey: 'teatrAbsurdu.sections.languageBreakdown.description',
    },
    {
      id: 'powerlessness',
      icon: '⛓️',
      color: '#0891b2',
      titleKey: 'teatrAbsurdu.sections.powerlessness.title',
      descKey: 'teatrAbsurdu.sections.powerlessness.description',
    },
  ];

  // Famous absurdist playwrights
  const playwrights = [
    {
      name: 'Samuel Beckett',
      work: 'Waiting for Godot',
      parallel: 'teatrAbsurdu.playwrights.beckett.parallel',
    },
    {
      name: 'Eugène Ionesco',
      work: 'The Bald Soprano',
      parallel: 'teatrAbsurdu.playwrights.ionesco.parallel',
    },
    {
      name: 'Harold Pinter',
      work: 'The Birthday Party',
      parallel: 'teatrAbsurdu.playwrights.pinter.parallel',
    },
    {
      name: 'Jean Genet',
      work: 'The Maids',
      parallel: 'teatrAbsurdu.playwrights.genet.parallel',
    },
  ];

  return (
    <div className="space-y-12">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HEADER SECTION */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-base-50 sm:text-5xl lg:text-6xl">
            {t('teatrAbsurdu.title', 'Teatr Absurdu: Kiedy Życie Staje Się Sztuką')}
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" />
        </div>

        <p className="max-w-4xl text-lg leading-relaxed text-base-200 md:text-xl">
          {t(
            'teatrAbsurdu.lead',
            'Teatr absurdu – forma dramatyczna powstała w połowie XX wieku, która zrywa z konwencjonalną logiką i językiem. Ale co się dzieje, gdy absurd opuszcza scenę i wkracza do naszego życia? Ta analiza bada niesamowite podobieństwa między teatrem absurdu a rzeczywistymi scenariuszami manipulacji psychologicznej.'
          )}
        </p>
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* INTRODUCTION */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="shrink-0 text-4xl">🎪</div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-purple-300">
              {t('teatrAbsurdu.intro.title', 'Czym jest Teatr Absurdu?')}
            </h2>
            <p className="leading-relaxed text-base-200">
              {t(
                'teatrAbsurdu.intro.content',
                'Teatr absurdu to ruch teatralny, który kwestionuje tradycyjną strukturę dramatyczną, logikę dialogu i sens komunikacji. Sztuki absurdystów przedstawiają świat bez wyraźnego znaczenia, gdzie bohaterowie uwięzieni są w bezsensownych sytuacjach, powtarzają bezcelowe działania, a język traci swoją komunikacyjną funkcję. To, co kiedyś było artystyczną konwencją, dziś może służyć jako metafora dla zrozumienia mechanizmów manipulacji.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ABSURDIST CONCEPTS & MANIPULATION PARALLELS */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-base-50">
          {t('teatrAbsurdu.parallels.title', 'Paralele: Teatr a Manipulacja')}
        </h2>

        <div className="space-y-4">
          {sections.map((section) => {
            const isExpanded = expandedSection === section.id;

            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-xl border-2 border-base-800 bg-base-900/60 backdrop-blur-sm transition-all hover:border-base-700"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left transition-colors hover:bg-base-800/40"
                  aria-expanded={isExpanded}
                  aria-controls={`section-${section.id}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-3xl"
                        style={{
                          backgroundColor: `${section.color}20`,
                          border: `2px solid ${section.color}40`,
                        }}
                      >
                        <span role="img" aria-hidden="true">
                          {section.icon}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold" style={{ color: section.color }}>
                        {t(section.titleKey)}
                      </h3>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <div className="shrink-0">
                      {isExpanded ? (
                        <ChevronUpIcon
                          className="h-6 w-6 transition-transform"
                          style={{ color: section.color }}
                        />
                      ) : (
                        <ChevronDownIcon className="h-6 w-6 text-base-500 transition-transform" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expandable Content */}
                {isExpanded && (
                  <div
                    id={`section-${section.id}`}
                    className="border-t border-base-800 bg-base-950/40 p-6"
                  >
                    <p className="text-lg leading-relaxed text-base-200">{t(section.descKey)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* KEY PLAYWRIGHTS */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-base-50">
          {t('teatrAbsurdu.playwrights.title', 'Kluczowi Dramatopisarze')}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {playwrights.map((playwright, index) => (
            <div
              key={index}
              className="group rounded-xl border border-base-800 bg-base-900/40 p-6 transition-all hover:border-purple-500/50 hover:bg-base-900/60 hover:shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-purple-300">{playwright.name}</h3>
                    <p className="text-sm italic text-base-400">{playwright.work}</p>
                  </div>
                  <div className="text-3xl transition-transform group-hover:scale-110">🎭</div>
                </div>
                <p className="leading-relaxed text-base-200">{t(playwright.parallel)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CONCLUSION */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="shrink-0 text-3xl">💡</div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-purple-300">
              {t('teatrAbsurdu.conclusion.title', 'Absurd jako Narzędzie Zrozumienia')}
            </h3>
            <p className="leading-relaxed text-base-200">
              {t(
                'teatrAbsurdu.conclusion.content',
                'Rozpoznanie absurdu w codziennych interakcjach może być pierwszym krokiem do uwolnienia się od manipulacji. Kiedy dostrzeżesz, że rozmowa nie prowadzi donikąd, że argumenty krążą w kółko, a język traci znaczenie – możesz właśnie uczestniczyć w absurdystycznym spektaklu. Różnica polega na tym, że możesz opuścić widownię.'
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
