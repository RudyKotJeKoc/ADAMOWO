// src/features/anatomy/components/SchemaCard.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ManipulationSchema, Example } from '../anatomy.schema';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface SchemaCardProps {
  schema: ManipulationSchema;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SchemaCard({ schema, isExpanded, onToggle }: SchemaCardProps) {
  const { t } = useTranslation();
  const [showExample, setShowExample] = useState<string | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Kolory według severity
  const severityConfig = {
    high: {
      border: 'border-red-500',
      bg: 'bg-red-500/10',
      badge: 'bg-red-500/20 text-red-400',
      glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]'
    },
    medium: {
      border: 'border-amber-500',
      bg: 'bg-amber-500/10',
      badge: 'bg-amber-500/20 text-amber-400',
      glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]'
    },
    low: {
      border: 'border-green-500',
      bg: 'bg-green-500/10',
      badge: 'bg-green-500/20 text-green-400',
      glow: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]'
    }
  };

  const config = severityConfig[schema.severity];

  // Mapowanie ikon (emoji jako fallback)
  const iconMap: Record<string, string> = {
    'MasksIcon': '🎭',
    'BrokenHeartIcon': '💔',
    'ScalesIcon': '⚖️',
    'MirrorIcon': '🪞',
    'NotebookIcon': '📔',
    'ShieldIcon': '🛡️'
  };

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer !== null) {
      setQuizSubmitted(true);
    }
  };

  const resetQuiz = () => {
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  return (
    <div
      className={`glass rounded-lg overflow-hidden transition-all duration-300 border-2 ${config.border} ${config.bg} ${config.glow}`}
    >
      {/* ═══════════════════════════════════════ */}
      {/* HEADER - zawsze widoczny */}
      {/* ═══════════════════════════════════════ */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors group"
        aria-expanded={isExpanded}
        aria-controls={`schema-content-${schema.id}`}
      >
        <div className="flex items-center gap-4 flex-1">
          {/* Ikona */}
          <div className="text-5xl transform transition-transform group-hover:scale-110">
            {iconMap[schema.icon] || '❓'}
          </div>

          {/* Tytuł i metadata */}
          <div className="text-left flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold">
                {t(schema.titleKey)}
              </h3>
              {/* Badge severity */}
              <span className={`text-xs px-2 py-1 rounded-full ${config.badge} uppercase tracking-wide font-semibold`}>
                {t(`anatomy.severity.${schema.severity}`)}
              </span>
            </div>
            <p className="text-sm text-base-300 uppercase tracking-wide">
              {t(`anatomy.categories.${schema.category}`)}
            </p>
          </div>
        </div>

        {/* Toggle icon */}
        <div className="ml-4">
          {isExpanded ? (
            <ChevronUpIcon className="w-6 h-6 text-amber-500" />
          ) : (
            <ChevronDownIcon className="w-6 h-6 text-base-400" />
          )}
        </div>
      </button>

      {/* ═══════════════════════════════════════ */}
      {/* ROZWIJALNA TREŚĆ */}
      {/* ═══════════════════════════════════════ */}
      {isExpanded && (
        <div
          id={`schema-content-${schema.id}`}
          className="p-6 pt-0 space-y-6 animate-slideInUp"
        >
          {/* Separacja */}
          <div className="h-px bg-gradient-to-r from-transparent via-base-700 to-transparent" />

          {/* ─────────────────────────────────── */}
          {/* DEFINICJA */}
          {/* ─────────────────────────────────── */}
          <div>
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="text-amber-500">📖</span>
              {t('anatomy.schemas.whatIsIt')}
            </h4>
            <p className="text-base-200 leading-relaxed">
              {t(schema.definitionKey)}
            </p>
          </div>

          {/* ─────────────────────────────────── */}
          {/* CZERWONE FLAGI */}
          {/* ─────────────────────────────────── */}
          <div>
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="text-red-500">🚩</span>
              {t('anatomy.schemas.howToRecognize')}
            </h4>
            <ul className="space-y-3">
              {schema.redFlags.map((flag) => (
                <li
                  key={flag.id}
                  className="flex items-start gap-3 group"
                >
                  <span className="text-red-500 text-xl mt-0.5 group-hover:scale-125 transition-transform">
                    ✓
                  </span>
                  <span className="text-base-100 leading-relaxed">
                    {t(flag.translationKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ─────────────────────────────────── */}
          {/* PRZYKŁADY Z DOKUMENTACJI */}
          {/* ─────────────────────────────────── */}
          {schema.examples && schema.examples.length > 0 && (
            <div>
              <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-cyan-500">📋</span>
                {t('anatomy.schemas.exampleFromDocs')}
              </h4>

              <div className="space-y-3">
                {schema.examples.map((example) => (
                  <ExampleBlock
                    key={example.id}
                    example={example}
                    isOpen={showExample === example.id}
                    onToggle={() => setShowExample(
                      showExample === example.id ? null : example.id
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────── */}
          {/* QUIZ */}
          {/* ─────────────────────────────────── */}
          {schema.quiz && (
            <div className="bg-base-800/50 backdrop-blur-sm p-5 rounded-lg border border-amber-500/30">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-amber-500">🎯</span>
                {t('anatomy.schemas.testYourKnowledge')}
              </h4>

              {/* Pytanie */}
              <p className="text-base-100 mb-4 font-medium">
                {t(schema.quiz.questionKey)}
              </p>

              {/* Opcje */}
              <div className="space-y-2 mb-4">
                {schema.quiz.options.map((option, index) => {
                  const isSelected = selectedQuizAnswer === index;
                  const isCorrect = option.isCorrect;
                  const showFeedback = quizSubmitted && isSelected;

                  return (
                    <label
                      key={index}
                      className={`
                        block p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${!quizSubmitted && 'hover:border-amber-500/50 hover:bg-white/5'}
                        ${isSelected && !quizSubmitted && 'border-amber-500 bg-amber-500/10'}
                        ${!isSelected && !quizSubmitted && 'border-base-700'}
                        ${showFeedback && isCorrect && 'border-green-500 bg-green-500/10'}
                        ${showFeedback && !isCorrect && 'border-red-500 bg-red-500/10'}
                        ${quizSubmitted && !isSelected && 'opacity-50'}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name={`quiz-${schema.id}`}
                          checked={isSelected}
                          onChange={() => !quizSubmitted && setSelectedQuizAnswer(index)}
                          disabled={quizSubmitted}
                          className="mt-1 accent-amber-500"
                        />
                        <div className="flex-1">
                          <p className="text-base-100">
                            {t(option.textKey)}
                          </p>

                          {/* Wyjaśnienie po submicie */}
                          {showFeedback && (
                            <div className={`mt-2 p-2 rounded text-sm ${
                              isCorrect ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                            }`}>
                              <p className="font-semibold mb-1">
                                {isCorrect ? '✓ Prawidłowo!' : '✗ Nieprawidłowo'}
                              </p>
                              <p className="text-xs leading-relaxed">
                                {t(option.explanationKey)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Przyciski */}
              <div className="flex gap-3">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedQuizAnswer === null}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-amber-500 disabled:hover:to-orange-500"
                  >
                    {t('anatomy.schemas.quiz.submit')}
                  </button>
                ) : (
                  <button
                    onClick={resetQuiz}
                    className="px-4 py-2 bg-base-700 hover:bg-base-600 rounded-lg transition-colors font-medium"
                  >
                    {t('anatomy.schemas.quiz.tryAgain')}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────── */}
          {/* FOOTER - Dodatkowe info */}
          {/* ─────────────────────────────────── */}
          <div className="pt-4 border-t border-base-700">
            <p className="text-sm text-base-400 italic">
              {t('anatomy.schemas.footer', {
                category: t(`anatomy.categories.${schema.category}`).toLowerCase()
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SUB-KOMPONENT: ExampleBlock
// ═══════════════════════════════════════════════════════════

interface ExampleBlockProps {
  example: Example;
  isOpen: boolean;
  onToggle: () => void;
}

function ExampleBlock({ example, isOpen, onToggle }: ExampleBlockProps) {
  const { t } = useTranslation();

  return (
    <div className="border border-base-700 rounded-lg overflow-hidden">
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
        aria-expanded={isOpen}
      >
        <span className="text-cyan-400 font-medium">
          {isOpen ? '▼' : '▶'} {t('anatomy.schemas.showHideExample')}
        </span>
        {example.sourceDocs && (
          <span className="text-xs text-base-400">
            {t('anatomy.schemas.sources')}: {example.sourceDocs.length}
          </span>
        )}
      </button>

      {/* Przykład content */}
      {isOpen && (
        <div className="p-4 pt-0 space-y-3 animate-fadeIn">
          {/* Kontekst */}
          <div>
            <h5 className="text-sm font-semibold text-amber-500 uppercase tracking-wide mb-1">
              {t('anatomy.schemas.example.context')}
            </h5>
            <p className="text-sm text-base-200">
              {t(example.context)}
            </p>
          </div>

          {/* Zachowanie */}
          <div>
            <h5 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-1">
              {t('anatomy.schemas.example.behavior')}
            </h5>
            <p className="text-sm text-base-200 bg-base-900/50 p-3 rounded border-l-4 border-red-500">
              {t(example.behavior)}
            </p>
          </div>

          {/* Analiza */}
          <div>
            <h5 className="text-sm font-semibold text-green-500 uppercase tracking-wide mb-1">
              {t('anatomy.schemas.example.analysis')}
            </h5>
            <p className="text-sm text-base-200 leading-relaxed">
              {t(example.analysis)}
            </p>
          </div>

          {/* Źródła */}
          {example.sourceDocs && example.sourceDocs.length > 0 && (
            <div className="pt-2 border-t border-base-800">
              <h5 className="text-xs font-semibold text-base-400 uppercase tracking-wide mb-1">
                {t('anatomy.schemas.example.sourceDocs')}
              </h5>
              <div className="flex flex-wrap gap-2">
                {example.sourceDocs.map((doc, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-base-800 px-2 py-1 rounded border border-base-700"
                  >
                    📄 {doc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
