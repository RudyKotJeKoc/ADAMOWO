import { useTranslation } from 'react-i18next';

/**
 * Live streaming page component.
 *
 * Displays a placeholder for the planned 24/7 live streaming experience.
 * This page will eventually feature real-time audio/video streaming content
 * related to the ADAMOWO project.
 *
 * @component
 * @returns {JSX.Element} The live streaming page
 */
export default function Live(): JSX.Element {
  const { t } = useTranslation();

  return (
    <section>
      <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">{t('pages.live.title')}</h1>
      <p className="mt-4 max-w-2xl text-base-200">
        Placeholder for the live streaming experience.
      </p>
    </section>
  );
}
