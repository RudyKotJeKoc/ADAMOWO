import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useTotalVisits } from '../../hooks/useVisitStats';

interface VisitCounterProps {
  className?: string;
  showLabel?: boolean;
}

export function VisitCounter({ className, showLabel = true }: VisitCounterProps): JSX.Element {
  const { t } = useTranslation();
  const { visits, loading, error } = useTotalVisits();
  const [displayCount, setDisplayCount] = useState(0);

  // Animate the counter
  useEffect(() => {
    if (!loading && visits > 0) {
      const duration = 1500; // ms
      const steps = 60;
      const stepValue = visits / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayCount(visits);
          clearInterval(interval);
        } else {
          setDisplayCount(Math.floor(stepValue * currentStep));
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [visits, loading]);

  if (error) {
    return <div className={clsx('text-sm text-base-500', className)}>{t('analytics.error')}</div>;
  }

  if (loading) {
    return (
      <div className={clsx('animate-pulse text-sm text-base-400', className)}>
        {t('analytics.loading')}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        'flex items-center gap-3 rounded-xl border border-base-800 bg-gradient-to-br from-base-900/90 to-base-950/90 px-5 py-3 shadow-lg backdrop-blur-sm',
        className
      )}
    >
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500/20 text-xl"
        >
          <span role="img" aria-label={t('analytics.icon.label')}>
            👁️
          </span>
        </motion.div>
      </div>

      <div className="flex flex-col">
        {showLabel && (
          <span className="text-xs font-medium uppercase tracking-wide text-base-400">
            {t('analytics.label')}
          </span>
        )}
        <div className="flex items-baseline gap-2">
          <motion.span
            key={displayCount}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold tabular-nums text-accent-400"
          >
            {displayCount.toLocaleString()}
          </motion.span>
          <span className="text-sm text-base-500">
            {t('analytics.visits', { count: displayCount })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
