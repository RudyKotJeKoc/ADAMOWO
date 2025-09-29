import { useCallback, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'pl', label: 'Polski' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'en', label: 'English' }
];

export function LangSwitch(): JSX.Element {
  const { i18n, t } = useTranslation();

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLSelectElement>) => {
      await i18n.changeLanguage(event.target.value);
    },
    [i18n]
  );

  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-base-200">
      <span className="sr-only sm:not-sr-only">{t('controls.language')}</span>
      <select
        className="rounded-full border border-base-700 bg-base-900 px-3 py-2 text-base-100 focus:border-accent-400 focus:outline-none focus-visible:shadow-focus"
        value={i18n.resolvedLanguage ?? i18n.language}
        onChange={handleChange}
        aria-label={t('controls.language')}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </label>
  );
}
