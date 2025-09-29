import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { ViolenceLoopSection } from '../features/violence-loop/ViolenceLoopSection';

export default function Home(): ReactElement {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">{t('pages.home.title')}</h1>
        <p className="max-w-2xl text-base-200">{t('pages.home.lead')}</p>
      </section>

      <ViolenceLoopSection />
    </div>
  );
}
