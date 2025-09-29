import clsx from 'clsx';
import { LayoutGroup, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
const LANG_CODES = ['pl', 'nl', 'en'] as const;

export function LangSwitch(): JSX.Element {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;
  return (
    <div className="relative" role="group" aria-label={t('controls.language.label')}>
      <LayoutGroup>
        <div className="relative flex items-center gap-1 rounded-full border border-base-700 bg-base-900/80 px-1 py-1 text-xs font-semibold uppercase tracking-wide text-base-200 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-base-900/70">
          {LANG_CODES.map((code) => {
            const isActive = current === code;
            const label = t(`controls.language.${code}`);
            const short = code.toUpperCase();

            return (
              <button
                key={code}
                type="button"
                className={clsx(
                  'relative inline-flex min-w-[2.75rem] items-center justify-center rounded-full px-2.5 py-1.5 transition focus-visible:shadow-focus',
                  isActive ? 'text-base-950' : 'text-base-200 hover:text-base-50'
                )}
                aria-pressed={isActive}
                onClick={() => {
                  void i18n.changeLanguage(code);
                }}
                lang={code}
                title={label}
              >
                {isActive ? (
                  <motion.span
                    layoutId="lang-switch-indicator"
                    className="absolute inset-0 -z-10 rounded-full bg-base-200 text-base-950 shadow-[0_8px_20px_-15px_rgba(10,14,39,0.8)]"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                ) : null}
                <span aria-hidden="true">{short}</span>
                <span className="sr-only">{label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
