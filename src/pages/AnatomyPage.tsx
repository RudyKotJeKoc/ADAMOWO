// src/pages/AnatomyPage.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SchemaCard } from '../features/anatomy/components/SchemaCard';
import { MANIPULATION_SCHEMAS } from '../features/anatomy/anatomy.data';
import '../features/anatomy/anatomy.css';

export default function AnatomyPage(): JSX.Element {
  const { t } = useTranslation();
  const [expandedSchema, setExpandedSchema] = useState<string | null>(null);

  return (
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
                onToggle={() => setExpandedSchema(
                  expandedSchema === schema.id ? null : schema.id
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* FRAMEWORK SECTION (optional - can be added later) */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* RESOURCES SECTION (optional - can be added later) */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* WARNING SECTION */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-amber-900/10 border-t border-amber-500/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="text-xl font-bold text-amber-400 mb-2">
                {t('anatomy.warning.title')}
              </h3>
              <p className="text-base-200 mb-4">
                {t('anatomy.warning.message')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
