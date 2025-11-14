import { useTranslation } from 'react-i18next';

/**
 * Violence Loop page component.
 *
 * Displays educational content about cyclical patterns of abuse and violence.
 * This page will feature interactive visualizations and tools to help users
 * understand and recognize cycles of toxic behavior and manipulation.
 *
 * @component
 * @returns {JSX.Element} The violence loop visualization page
 */
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
