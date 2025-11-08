// src/pages/AnatomyPage.tsx

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TriggerWarning } from '../features/anatomy/components/TriggerWarning';
import { SchemaCard } from '../features/anatomy/components/SchemaCard';
import { AnalysisWorksheet } from '../features/anatomy/components/AnalysisWorksheet';
import { MANIPULATION_SCHEMAS } from '../features/anatomy/anatomy.data';
import '../features/anatomy/anatomy.css';

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
              Każdy schemat został dokładnie przeanalizowany i oparty na rzeczywistych przypadkach.
              Kliknij na kartę, aby poznać szczegóły.
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
        {/* RESOURCES SECTION (optional - can be added later) */}
        {/* ═══════════════════════════════════════════════════════════ */}
      </div>
    </>
  );
}
