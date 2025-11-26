import type { ReactElement } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import {
  TACTIC_CATEGORIES,
  getTacticsByCategory,
} from '../features/manipulation-taxonomy/taxonomy.data';
import type { TacticCategory } from '../features/manipulation-taxonomy/taxonomy.schema';

/**
 * Manipulation Taxonomy Page - Anatomia Manipulacji: Taksonomia Mechanizmów Systemowych
 *
 * A comprehensive lexicon/knowledge base of manipulation tactics identified during
 * the Adamowo investigation. Presents a systematic categorization of psychological,
 * legal, and institutional manipulation vectors.
 *
 * Features:
 * - Three main categories (Corporate, Legal/Family, Institutional)
 * - Professional investigative design with dark theme
 * - Expandable category sections with collapsible tactic cards
 * - Grid-based responsive layout
 * - Color-coded categories for visual hierarchy
 */
export default function ManipulationTaxonomy(): ReactElement {
  const { t } = useTranslation();
  const [expandedCategory, setExpandedCategory] = useState<TacticCategory | null>(null);

  const toggleCategory = (categoryId: TacticCategory) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="space-y-12">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HEADER SECTION */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-base-50 sm:text-5xl lg:text-6xl">
            {t('taxonomy.title', 'Anatomia Manipulacji: Taksonomia Mechanizmów Systemowych')}
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full" />
        </div>

        <p className="max-w-4xl text-lg leading-relaxed text-base-200 md:text-xl">
          {t(
            'taxonomy.lead',
            'Analiza ta stanowi dekonstrukcję taktyk psychologicznych, prawnych i organizacyjnych zidentyfikowanych w toku śledztwa Adamowo. Poniższy leksykon definiuje konkretne wektory ataku – od korporacyjnego gaslightingu po inżynierię prawną. To nie teoria, to mapa błędów systemu.'
          )}
        </p>
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CATEGORIES SECTION */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-8">
        {TACTIC_CATEGORIES.map((category) => {
          const tactics = getTacticsByCategory(category.id);
          const isExpanded = expandedCategory === category.id;

          return (
            <div
              key={category.id}
              className="overflow-hidden rounded-xl border-2 border-base-800 bg-base-900/60 backdrop-blur-sm transition-all hover:border-base-700"
            >
              {/* ─────────────────────────────────────────────── */}
              {/* CATEGORY HEADER (Always Visible) */}
              {/* ─────────────────────────────────────────────── */}
              <button
                onClick={() => toggleCategory(category.id as TacticCategory)}
                className="w-full p-6 text-left transition-colors hover:bg-base-800/40 md:p-8"
                aria-expanded={isExpanded}
                aria-controls={`category-${category.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 md:gap-6">
                    {/* Category Icon */}
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-3xl md:h-16 md:w-16 md:text-4xl"
                      style={{
                        backgroundColor: `${category.color}20`,
                        border: `2px solid ${category.color}40`,
                      }}
                    >
                      <span role="img" aria-hidden="true">
                        {category.icon}
                      </span>
                    </div>

                    {/* Category Title & Description */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h2
                          className="text-2xl font-bold md:text-3xl"
                          style={{ color: category.color }}
                        >
                          {t(category.nameKey)}
                        </h2>
                        <span className="rounded-full bg-base-800 px-3 py-1 text-xs font-semibold text-base-400">
                          {tactics.length}
                        </span>
                      </div>
                      <p className="text-base leading-relaxed text-base-300 md:text-lg">
                        {t(category.descriptionKey)}
                      </p>
                    </div>
                  </div>

                  {/* Expand/Collapse Icon */}
                  <div className="shrink-0 pt-1">
                    {isExpanded ? (
                      <ChevronUpIcon
                        className="h-6 w-6 text-accent-400 transition-transform md:h-7 md:w-7"
                        style={{ color: category.color }}
                      />
                    ) : (
                      <ChevronDownIcon
                        className="h-6 w-6 text-base-500 transition-transform md:h-7 md:w-7"
                      />
                    )}
                  </div>
                </div>
              </button>

              {/* ─────────────────────────────────────────────── */}
              {/* TACTICS GRID (Expandable) */}
              {/* ─────────────────────────────────────────────── */}
              {isExpanded && (
                <div
                  id={`category-${category.id}`}
                  className="border-t border-base-800 bg-base-950/40 p-6 md:p-8"
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    {tactics.map((tactic) => (
                      <div
                        key={tactic.id}
                        className="group rounded-lg border border-base-800 bg-base-900/40 p-6 transition-all hover:border-base-700 hover:bg-base-900/60 hover:shadow-lg"
                      >
                        <div className="flex items-start gap-4">
                          {/* Tactic Icon */}
                          {tactic.icon && (
                            <div className="shrink-0 text-3xl transition-transform group-hover:scale-110">
                              <span role="img" aria-hidden="true">
                                {tactic.icon}
                              </span>
                            </div>
                          )}

                          {/* Tactic Content */}
                          <div className="flex-1 space-y-3">
                            <h3
                              className="text-xl font-bold transition-colors"
                              style={{ color: category.color }}
                            >
                              {t(tactic.nameKey)}
                            </h3>
                            <p className="leading-relaxed text-base-200">
                              {t(tactic.descriptionKey)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* FOOTER NOTE */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="rounded-xl border border-accent-500/30 bg-accent-500/5 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="shrink-0 text-3xl">⚠️</div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-accent-300">
              {t('taxonomy.footer.title', 'Nota metodologiczna')}
            </h3>
            <p className="leading-relaxed text-base-200">
              {t(
                'taxonomy.footer.content',
                'Niniejsza taksonomia została opracowana w oparciu o dokumentację, zeznania i analizę rzeczywistych przypadków. Każda taktyka opisuje konkretne mechanizmy systemowe zidentyfikowane w toku śledztwa. Nie są to konstrukcje teoretyczne – to udokumentowane wzorce działań.'
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
