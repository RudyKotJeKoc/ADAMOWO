// src/features/anatomy/components/TriggerWarning.tsx

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TriggerWarningProps {
  onDismiss?: () => void;
}

export function TriggerWarning({ onDismiss }: TriggerWarningProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const STORAGE_KEY = 'anatomy-trigger-warning-dismissed';
  const STORAGE_TIMESTAMP_KEY = 'anatomy-trigger-warning-timestamp';

  // ═══════════════════════════════════════════════════════════
  // CHECK IF SHOULD SHOW
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);

    if (dismissed === 'true') {
      // Check if 30 days have passed (optional: re-show after time)
      if (timestamp) {
        const dismissedDate = new Date(timestamp);
        const now = new Date();
        const daysPassed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

        // Re-show after 30 days
        if (daysPassed > 30) {
          setIsVisible(true);
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
        }
      }
    } else {
      setIsVisible(true);
    }
  }, []);

  // ═══════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════

  const handleAccept = () => {
    handleClose();

    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, new Date().toISOString());
    }

    onDismiss?.();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`
          fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md
          flex items-center justify-center p-4
          ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}
        `}
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trigger-warning-title"
        onKeyDown={handleKeyDown}
      >
        {/* Modal content */}
        <div
          className={`
            relative max-w-2xl w-full bg-base-900 rounded-xl overflow-hidden
            border-2 border-amber-500 shadow-2xl shadow-amber-500/20
            ${isClosing ? 'animate-scaleDown' : 'animate-scaleUp'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button (top-right) */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-base-400 hover:text-base-100 transition-colors p-2 rounded-lg hover:bg-white/5"
            aria-label={t('anatomy.warning.close')}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500/20 via-red-500/20 to-amber-500/20 p-8 text-center border-b-2 border-amber-500/50">
            {/* Warning icon */}
            <div className="text-8xl mb-4 animate-pulse">⚠️</div>

            {/* Title */}
            <h2 id="trigger-warning-title" className="text-3xl font-bold mb-2 text-amber-500">
              {t('anatomy.warning.title')}
            </h2>

            <p className="text-base-300 text-lg">{t('anatomy.warning.subtitle')}</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Main message */}
            <div className="glass p-6 rounded-lg border border-red-500/30">
              <p className="text-base-100 leading-relaxed mb-4">{t('anatomy.warning.message')}</p>

              {/* Content warnings list */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-red-400 mb-2">
                  {t('anatomy.warning.contains')}:
                </p>
                <ul className="space-y-1.5 text-sm text-base-200">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{t('anatomy.warning.content1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{t('anatomy.warning.content2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{t('anatomy.warning.content3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{t('anatomy.warning.content4')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Support notice */}
            <div className="glass p-6 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
              <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0">💙</div>
                <div>
                  <h3 className="font-bold text-cyan-400 mb-2">
                    {t('anatomy.warning.support.title')}
                  </h3>
                  <p className="text-sm text-base-200 leading-relaxed mb-3">
                    {t('anatomy.warning.support.message')}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300">
                      🆘 {t('anatomy.warning.support.hotline')}
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300">
                      💬 {t('anatomy.warning.support.chat')}
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300">
                      ⚖️ {t('anatomy.warning.support.legal')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass p-6 rounded-lg border border-green-500/30 bg-green-500/5">
              <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <span>💡</span>
                {t('anatomy.warning.recommendations.title')}
              </h3>
              <ul className="space-y-2 text-sm text-base-200">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('anatomy.warning.recommendations.rec1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('anatomy.warning.recommendations.rec2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('anatomy.warning.recommendations.rec3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('anatomy.warning.recommendations.rec4')}</span>
                </li>
              </ul>
            </div>

            {/* Don't show again checkbox */}
            <div className="flex items-center gap-3 p-4 bg-base-800/50 rounded-lg border border-base-700">
              <input
                type="checkbox"
                id="dont-show-again"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
              <label
                htmlFor="dont-show-again"
                className="text-sm text-base-200 cursor-pointer select-none"
              >
                {t('anatomy.warning.dontShowAgain')}
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleAccept}
                className="flex-1 btn-primary text-lg py-4 font-bold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
              >
                {t('anatomy.warning.accept')}
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-4 bg-base-800 hover:bg-base-700 rounded-lg transition-colors text-base-200 font-medium"
              >
                {t('anatomy.warning.leave')}
              </button>
            </div>
          </div>

          {/* Footer disclaimer */}
          <div className="bg-base-800/50 px-8 py-4 border-t border-base-700 text-center">
            <p className="text-xs text-base-400">{t('anatomy.warning.disclaimer')}</p>
          </div>
        </div>
      </div>
    </>
  );
}
