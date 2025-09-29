import { useTranslation } from 'react-i18next';

export default function Home(): JSX.Element {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">{t('pages.home.title')}</h1>
      <p className="max-w-2xl text-base-200">{t('pages.home.lead')}</p>
    </section>
  );
}
