import { useTranslation } from 'react-i18next';

/**
 * Shows page component.
 *
 * Displays a collection of archived and upcoming shows related to the ADAMOWO project.
 * This page will eventually feature a comprehensive list of live performances, events,
 * and scheduled broadcasts.
 *
 * @component
 * @returns {JSX.Element} The shows archive and schedule page
 */
export default function Shows(): JSX.Element {
  const { t } = useTranslation();

  return (
    <section>
      <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">{t('pages.shows.title')}</h1>
      <p className="mt-4 max-w-2xl text-base-200">
        Archived and upcoming shows will be listed here.
      </p>
    </section>
  );
}
