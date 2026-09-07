// src/pages/AnatomyPage.tsx

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TriggerWarning } from '../features/anatomy/components/TriggerWarning';
import { SchemaCard } from '../features/anatomy/components/SchemaCard';
import { AnalysisWorksheet } from '../features/anatomy/components/AnalysisWorksheet';
import { MANIPULATION_SCHEMAS } from '../features/anatomy/anatomy.data';
import { HelpResources } from '../components/HelpResources';
import '../features/anatomy/anatomy.css';

/**
 * Anatomy page component for analyzing manipulation patterns and toxic relationships.
 *
 * Displays detailed information about six manipulation schemas with interactive cards,
 * an analysis framework/worksheet, and help resources. Features a trigger warning modal
 * on initial page load due to sensitive content. Manages body scroll behavior when the
 * modal is displayed.
 *
 * Key Features:
 * - Trigger warning modal with scroll lock
 * - Six manipulation schemas with expandable detailed information
 * - Interactive schema cards based on real cases
 * - Analysis worksheet framework for self-assessment
 * - Help resources section with crisis support
 * - Accessibility considerations for sensitive content
 *
 * @component
 * @returns {JSX.Element} The manipulation anatomy analysis page with trigger warning and educational content
 */
export default function AnatomyPage(): JSX.Element {
  const { t } = useTranslation();
  const [expandedSchema, setExpandedSchema] = useState<string | null>(null);
  const [showTriggerWarning, setShowTriggerWarning] = useState(true);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showTriggerWarning) {
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('--scrollbar-width');
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('--scrollbar-width');
    };
  }, [showTriggerWarning]);

  return (
    <>
      {/* Trigger Warning Modal */}
      {showTriggerWarning && <TriggerWarning onDismiss={() => setShowTriggerWarning(false)} />}

      {/* Main content */}
      <div className="min-h-screen bg-base-950 text-base-50">
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* HERO SECTION */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="hero-pattern-bg py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 gradient-text">
              {t('anatomy.hero.title')}
            </h1>
            <p className="text-xl text-center max-w-3xl mx-auto text-base-300">
              {t('anatomy.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* AUDIENCE SECTION (optional - can be added later) */}
        {/* ═══════════════════════════════════════════════════════════ */}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 6 MANIPULATION SCHEMAS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">
              {t('anatomy.schemas.sectionTitle')}
            </h2>
            <p className="text-center text-base-300 mb-12 max-w-2xl mx-auto">
              {t(
                'anatomy.schemas.sectionIntro',
                'Sześć powtarzających się wzorców manipulacji, każdy z definicją, sygnałami rozpoznawczymi i zanonimizowanym przykładem. Kliknij kartę, aby zobaczyć rozbicie na fakt, mechanizm i wniosek.'
              )}
            </p>

            <div className="max-w-5xl mx-auto space-y-4">
              {MANIPULATION_SCHEMAS.map((schema) => (
                <SchemaCard
                  key={schema.id}
                  schema={schema}
                  isExpanded={expandedSchema === schema.id}
                  onToggle={() =>
                    setExpandedSchema(expandedSchema === schema.id ? null : schema.id)
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* FRAMEWORK ANALIZY */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-base-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">{t('anatomy.framework.title')}</h2>
            <p className="text-center text-base-300 mb-12 max-w-2xl mx-auto">
              {t('anatomy.framework.intro')}
            </p>
            <AnalysisWorksheet />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* LINK TO EVIDENCE AUDIT LAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-xl border border-accent-500/30 bg-accent-500/5 p-6 text-center md:p-8">
              <h3 className="text-lg font-bold text-accent-300">Od wzorca do dowodu</h3>
              <p className="mx-auto mt-2 max-w-xl leading-relaxed text-base-200">
                Ten katalog nazywa mechanizmy manipulacji. Laboratorium Dowodowe uczy, jak sprawdzić
                konkretny materiał dowodowy: policzyć niezależne źródła i odróżnić twierdzenie
                strony od ustalenia organu.
              </p>
              <Link
                to="/laboratorium-dowodow"
                className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-accent-500/50 px-5 py-2 text-sm font-semibold text-accent-200 transition hover:bg-accent-500/10"
              >
                Przejdź do Laboratorium Dowodowego
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* HELP RESOURCES SECTION */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <HelpResources />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
