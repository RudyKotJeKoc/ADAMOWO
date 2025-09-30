import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { TabNav } from '../../components/TabNav';
import { CommentsBoard } from './comments/CommentsBoard';
import { SimulatorSection } from '../simulator/SimulatorSection';
import { RedFlagsCalendar } from '../redflags/RedFlagsCalendar';
import { RedFlagForm } from '../redflags/RedFlagForm';
import { RedFlagList } from '../redflags/RedFlagList';

const TABS = ['voices', 'simulator', 'redflags'] as const;

export function CommunitySection(): JSX.Element {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('voices');

  const tabs = TABS.map((tab) => ({
    id: tab,
    label: t(`community.tabs.${tab}`),
    panelId: `community-panel-${tab}`
  }));

  return (
    <section className="space-y-8" aria-labelledby="community-section-title" role="region">
      <header className="space-y-3">
        <h1 id="community-section-title" className="text-3xl font-bold text-base-50 sm:text-4xl">
          {t('community.title')}
        </h1>
        <p className="text-base text-base-200">{t('community.subtitle')}</p>
      </header>
      <TabNav
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as (typeof TABS)[number])}
        ariaLabel={t('community.tabs.ariaLabel')}
      />
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={tab.panelId}
          role="tabpanel"
          aria-labelledby={`${tab.id}-tab`}
          hidden={activeTab !== tab.id}
          className="space-y-8"
        >
          {tab.id === 'voices' ? (
            <CommentsBoard />
          ) : null}
          {tab.id === 'simulator' ? (
            <SimulatorSection />
          ) : null}
          {tab.id === 'redflags' ? (
            <div className="space-y-6">
              <RedFlagsCalendar />
              <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
                <RedFlagList />
                <RedFlagForm />
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </section>
  );
}
