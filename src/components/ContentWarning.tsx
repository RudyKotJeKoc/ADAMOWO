import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export interface ContentWarningProps {
  /**
   * Warning topics (e.g., "przemoc", "trauma", "samookaleczenie")
   */
  topics: string[];
  /**
   * Severity level
   */
  severity?: 'mild' | 'moderate' | 'severe';
  /**
   * Custom warning message
   */
  message?: string;
  /**
   * Whether to show as modal blocking content
   */
  blocking?: boolean;
  /**
   * Callback when user dismisses warning
   */
  onDismiss?: () => void;
  /**
   * Children content to show after dismissing warning
   */
  children?: React.ReactNode;
  /**
   * Storage key for remembering user's choice
   */
  storageKey?: string;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Universal ContentWarning component for sensitive content
 * Can be used as inline warning or blocking modal
 */
export function ContentWarning({
  topics,
  severity = 'moderate',
  message,
  blocking = false,
  onDismiss,
  children,
  storageKey,
  className = '',
}: ContentWarningProps): JSX.Element {
  const { t } = useTranslation();
  const [isDismissed, setIsDismissed] = useState(() => {
    if (storageKey && typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(storageKey) === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (blocking && !isDismissed) {
      // Prevent body scroll when blocking modal is open
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
  }, [blocking, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (storageKey && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(storageKey, 'true');
    }
    onDismiss?.();
  };

  const severityStyles = {
    mild: {
      container: 'border-yellow-700/50 bg-gradient-to-br from-yellow-950/30 to-yellow-900/20',
      icon: 'text-yellow-300',
      title: 'text-yellow-200',
      text: 'text-yellow-100',
      button: 'bg-yellow-600 hover:bg-yellow-500 text-white',
    },
    moderate: {
      container: 'border-orange-700/50 bg-gradient-to-br from-orange-950/30 to-orange-900/20',
      icon: 'text-orange-300',
      title: 'text-orange-200',
      text: 'text-orange-100',
      button: 'bg-orange-600 hover:bg-orange-500 text-white',
    },
    severe: {
      container: 'border-red-700/50 bg-gradient-to-br from-red-950/30 to-red-900/20',
      icon: 'text-red-300',
      title: 'text-red-200',
      text: 'text-red-100',
      button: 'bg-red-600 hover:bg-red-500 text-white',
    },
  };

  const styles = severityStyles[severity];

  const WarningContent = () => (
    <div
      className={clsx(
        'rounded-xl border shadow-lg',
        styles.container,
        blocking ? 'max-w-2xl p-8' : 'p-6',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="mb-4 flex items-start gap-4">
        <div
          className={clsx(
            'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-current/20',
            styles.icon
          )}
          aria-hidden="true"
        >
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className={clsx('text-2xl font-bold', styles.title)}>
            {t('content.warning.title', 'Ostrzeżenie o treści')}
          </h2>
          <p className={clsx('mt-2 text-base', styles.text)}>
            {message ||
              t(
                'content.warning.message',
                'Poniższa treść może być trudna emocjonalnie i zawierać opisy sytuacji traumatycznych.'
              )}
          </p>
        </div>
      </div>

      {topics.length > 0 && (
        <div className="mb-6">
          <p className={clsx('mb-2 text-sm font-semibold', styles.text)}>
            {t('content.warning.topics', 'Treść dotyczy:')}
          </p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <span
                key={index}
                className={clsx(
                  'rounded-full border px-3 py-1 text-xs font-semibold',
                  severity === 'severe'
                    ? 'border-red-500/50 bg-red-500/10 text-red-200'
                    : severity === 'moderate'
                      ? 'border-orange-500/50 bg-orange-500/10 text-orange-200'
                      : 'border-yellow-500/50 bg-yellow-500/10 text-yellow-200'
                )}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className={clsx('text-sm', styles.text)}>
          {t(
            'content.warning.selfCare',
            'Pamiętaj o dbaniu o siebie. Jeśli czujesz, że nie jesteś gotowy/a na tę treść, możesz wrócić do niej później.'
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDismiss}
            className={clsx(
              'rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2',
              styles.button,
              blocking ? 'focus-visible:ring-offset-base-950' : 'focus-visible:ring-offset-base-900'
            )}
          >
            {t('content.warning.continue', 'Rozumiem, kontynuuj')}
          </button>
          {blocking && (
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-full border-2 border-current px-6 py-3 text-sm font-semibold transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
            >
              {t('content.warning.goBack', 'Wróć')}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (isDismissed) {
    return <>{children}</>;
  }

  if (blocking) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-base-950/95 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-warning-title"
      >
        <WarningContent />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WarningContent />
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
