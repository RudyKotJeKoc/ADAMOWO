import { useTranslation } from 'react-i18next';

export default function ViolenceLoop(): JSX.Element {
  const { t } = useTranslation();

  return (
    <section>
      <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">{t('pages.violenceLoop.title')}</h1>
      <p className="mt-4 max-w-2xl text-base-200">
        Visualisations of cyclical abuse will be crafted in this section.
      </p>
    </section>
  );
}
