// src/features/anatomy/components/AnalysisWorksheet.tsx

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ANALYSIS_FRAMEWORK } from '../anatomy.data';

interface AnalysisData {
  step1: string; // Co osoba MÓWI?
  step2: string; // Co osoba ROBI?
  step3: string; // Gdzie jest sprzeczność?
  timestamp: string;
}

export function AnalysisWorksheet() {
  const { t } = useTranslation();

  // State
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisData[]>([]);
  const [showSavedList, setShowSavedList] = useState(false);

  // ═══════════════════════════════════════════════════════════
  // PERSISTENCE - Load/Save do localStorage
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    // Load current draft
    const draft = localStorage.getItem('anatomy-analysis-draft');
    if (draft) {
      try {
        setAnswers(JSON.parse(draft));
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }

    // Load saved analyses
    const saved = localStorage.getItem('anatomy-analyses');
    if (saved) {
      try {
        setSavedAnalyses(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved analyses:', e);
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(answers).length > 0) {
        localStorage.setItem('anatomy-analysis-draft', JSON.stringify(answers));
      }
    }, 1000); // Debounce 1s

    return () => clearTimeout(timer);
  }, [answers]);

  // ═══════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════

  const handleAnswerChange = (stepNumber: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [stepNumber]: value,
    }));
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);

    // Symulacja analizy (można tu dodać faktyczną logikę AI)
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 1500);
  };

  const handleSaveAnalysis = () => {
    const newAnalysis: AnalysisData = {
      step1: answers[1] || '',
      step2: answers[2] || '',
      step3: answers[3] || '',
      timestamp: new Date().toISOString(),
    };

    const updated = [newAnalysis, ...savedAnalyses];
    setSavedAnalyses(updated);
    localStorage.setItem('anatomy-analyses', JSON.stringify(updated));

    // Clear form
    setAnswers({});
    setShowResults(false);
    localStorage.removeItem('anatomy-analysis-draft');

    alert(t('anatomy.framework.savedSuccess'));
  };

  const handleClear = () => {
    if (confirm(t('anatomy.framework.clearConfirm'))) {
      setAnswers({});
      setShowResults(false);
      localStorage.removeItem('anatomy-analysis-draft');
    }
  };

  const handleExport = () => {
    const text = generateExportText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analiza-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateExportText = () => {
    const date = new Date().toLocaleString('pl-PL');
    return `
ANALIZA SPRZECZNOŚCI - ${date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KROK 1: CO OSOBA MÓWI?
${answers[1] || '(brak danych)'}

KROK 2: CO OSOBA ROBI?
${answers[2] || '(brak danych)'}

KROK 3: GDZIE JEST SPRZECZNOŚĆ?
${answers[3] || '(brak danych)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Wygenerowano przez Radio Adamowo - Anatomia Manipulacji
    `.trim();
  };

  const isFormComplete = answers[1]?.length > 10 && answers[2]?.length > 10;
  const progressPercentage =
    (Object.keys(answers).filter((k) => answers[parseInt(k)]?.length > 10).length / 3) * 100;

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="max-w-5xl mx-auto">
      {/* ─────────────────────────────────────────────────────── */}
      {/* INTRO */}
      {/* ─────────────────────────────────────────────────────── */}
      <div className="glass p-6 rounded-lg mb-8 border border-amber-500/30">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🔍</div>
          <div>
            <h3 className="text-xl font-bold mb-2">{t('anatomy.framework.intro')}</h3>
            <p className="text-base-200 leading-relaxed">{t('anatomy.framework.description')}</p>
          </div>
        </div>

        {/* Progress bar */}
        {progressPercentage > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-base-300">{t('anatomy.framework.progress')}</span>
              <span className="text-amber-500 font-bold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-2 bg-base-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────── */}
      {/* WORKSHEET */}
      {/* ─────────────────────────────────────────────────────── */}
      <div className="glass p-8 rounded-lg border border-base-700">
        {ANALYSIS_FRAMEWORK.steps.map((step) => (
          <div key={step.number} className="mb-8 last:mb-0">
            <div className="flex items-start gap-4">
              {/* Step number badge */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-red-500 text-black rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                  {step.number}
                </div>
              </div>

              {/* Step content */}
              <div className="flex-1">
                {/* Title */}
                <h3 className="text-2xl font-bold mb-2 text-amber-500">{t(step.titleKey)}</h3>

                {/* Description */}
                <p className="text-base-200 mb-4 leading-relaxed">{t(step.descriptionKey)}</p>

                {/* Textarea */}
                <div className="relative">
                  <textarea
                    className="w-full bg-base-900 border-2 border-base-700 rounded-lg p-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                    rows={step.number === 3 ? 6 : 4}
                    placeholder={t(step.placeholderKey)}
                    value={answers[step.number] || ''}
                    onChange={(e) => handleAnswerChange(step.number, e.target.value)}
                  />

                  {/* Character count */}
                  <div className="absolute bottom-2 right-2 text-xs text-base-400">
                    {answers[step.number]?.length || 0} {t('anatomy.framework.characters')}
                  </div>
                </div>

                {/* Hints */}
                {step.number === 1 && (
                  <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded text-sm">
                    <p className="text-cyan-300">
                      <strong>💡 {t('anatomy.framework.hint')}:</strong>{' '}
                      {t('anatomy.framework.hint1')}
                    </p>
                  </div>
                )}

                {step.number === 2 && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded text-sm">
                    <p className="text-red-300">
                      <strong>💡 {t('anatomy.framework.hint')}:</strong>{' '}
                      {t('anatomy.framework.hint2')}
                    </p>
                  </div>
                )}

                {step.number === 3 && (
                  <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded text-sm">
                    <p className="text-green-300">
                      <strong>💡 {t('anatomy.framework.hint')}:</strong>{' '}
                      {t('anatomy.framework.hint3')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Separator (except last) */}
            {step.number !== 3 && (
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-base-700 to-transparent" />
            )}
          </div>
        ))}

        {/* ─────────────────────────────────────────────────────── */}
        {/* ACTION BUTTONS */}
        {/* ─────────────────────────────────────────────────────── */}
        <div className="mt-8 pt-6 border-t border-base-700 flex flex-wrap gap-3">
          <button
            onClick={handleAnalyze}
            disabled={!isFormComplete || isAnalyzing}
            className="btn-primary flex-1 min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin">⚙️</span>
                {t('anatomy.framework.analyzing')}
              </>
            ) : (
              <>
                <span>🔍</span>
                {t('anatomy.framework.analyze')}
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            disabled={Object.keys(answers).length === 0}
            className="px-6 py-3 bg-base-800 hover:bg-base-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🗑️ {t('anatomy.framework.clear')}
          </button>

          <button
            onClick={handleExport}
            disabled={!isFormComplete}
            className="px-6 py-3 bg-base-800 hover:bg-base-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📥 {t('anatomy.framework.export')}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────── */}
      {/* RESULTS PANEL */}
      {/* ─────────────────────────────────────────────────────── */}
      {showResults && (
        <div className="mt-8 glass p-8 rounded-lg border-2 border-green-500/50 animate-slideInUp">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl">✅</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-green-500">
                {t('anatomy.framework.results.title')}
              </h3>
              <p className="text-base-200">{t('anatomy.framework.results.intro')}</p>
            </div>
          </div>

          {/* Analysis results */}
          <div className="space-y-4 mb-6">
            {/* Identyfikacja dysonansu */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <h4 className="font-bold text-amber-500 mb-2 flex items-center gap-2">
                <span>⚠️</span>
                {t('anatomy.framework.results.dissonance')}
              </h4>
              <p className="text-sm text-base-200 leading-relaxed">
                {t('anatomy.framework.results.dissonanceText')}
              </p>
            </div>

            {/* Czerwone flagi */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2">
                <span>🚩</span>
                {t('anatomy.framework.results.redFlags')}
              </h4>
              <ul className="text-sm text-base-200 space-y-1">
                <li>• {t('anatomy.framework.results.flag1')}</li>
                <li>• {t('anatomy.framework.results.flag2')}</li>
                <li>• {t('anatomy.framework.results.flag3')}</li>
              </ul>
            </div>

            {/* Rekomendacje */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="font-bold text-cyan-500 mb-2 flex items-center gap-2">
                <span>💡</span>
                {t('anatomy.framework.results.recommendations')}
              </h4>
              <ul className="text-sm text-base-200 space-y-1">
                <li>• {t('anatomy.framework.results.rec1')}</li>
                <li>• {t('anatomy.framework.results.rec2')}</li>
                <li>• {t('anatomy.framework.results.rec3')}</li>
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={handleSaveAnalysis} className="btn-primary flex items-center gap-2">
              <span>💾</span>
              {t('anatomy.framework.save')}
            </button>
            <button
              onClick={() => setShowResults(false)}
              className="px-6 py-3 bg-base-800 hover:bg-base-700 rounded-lg transition-colors"
            >
              {t('anatomy.framework.results.close')}
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────── */}
      {/* SAVED ANALYSES LIST */}
      {/* ─────────────────────────────────────────────────────── */}
      {savedAnalyses.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowSavedList(!showSavedList)}
            className="w-full glass p-4 rounded-lg border border-base-700 hover:border-amber-500/50 transition-colors flex items-center justify-between"
          >
            <span className="font-bold flex items-center gap-2">
              <span>📁</span>
              {t('anatomy.framework.savedAnalyses')} ({savedAnalyses.length})
            </span>
            <span>{showSavedList ? '▼' : '▶'}</span>
          </button>

          {showSavedList && (
            <div className="mt-4 space-y-3">
              {savedAnalyses.map((analysis, index) => (
                <SavedAnalysisCard
                  key={index}
                  analysis={analysis}
                  onDelete={() => {
                    const updated = savedAnalyses.filter((_, i) => i !== index);
                    setSavedAnalyses(updated);
                    localStorage.setItem('anatomy-analyses', JSON.stringify(updated));
                  }}
                  onLoad={() => {
                    setAnswers({
                      1: analysis.step1,
                      2: analysis.step2,
                      3: analysis.step3,
                    });
                    setShowSavedList(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SUB-KOMPONENT: SavedAnalysisCard
// ═══════════════════════════════════════════════════════════

interface SavedAnalysisCardProps {
  analysis: AnalysisData;
  onDelete: () => void;
  onLoad: () => void;
}

function SavedAnalysisCard({ analysis, onDelete, onLoad }: SavedAnalysisCardProps) {
  const { t } = useTranslation();
  const date = new Date(analysis.timestamp).toLocaleString('pl-PL');

  return (
    <div className="glass p-4 rounded-lg border border-base-700 hover:border-base-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-base-400 mb-1">📅 {date}</p>
          <p className="text-sm text-base-200 line-clamp-2">
            {analysis.step1.substring(0, 100)}...
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={onLoad}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-black rounded text-sm font-medium transition-colors"
            title={t('anatomy.framework.loadAnalysis')}
          >
            📂
          </button>
          <button
            onClick={() => {
              if (confirm(t('anatomy.framework.deleteConfirm'))) {
                onDelete();
              }
            }}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm font-medium transition-colors"
            title={t('anatomy.framework.deleteAnalysis')}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
