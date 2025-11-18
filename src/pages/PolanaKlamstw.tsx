import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { PolanaKlamstwReader } from '../features/polana-klamstw/PolanaKlamstwReader';
import { polanaData } from '../features/polana-klamstw/polana.data';

/**
 * PolanaKlamstw Page
 *
 * Main page for the "Polana Kłamstw" contemporary fairytale.
 * A story about family conflict, manipulation, and the power of truth vs. echo.
 *
 * Features:
 * - SEO optimization with Helmet
 * - Content warnings for sensitive topics
 * - Responsive reader interface
 * - Progress tracking
 * - Accessible navigation
 */
export default function PolanaKlamstw() {
  const { t } = useTranslation();

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{polanaData.metadata.title} - Radio Adamowo</title>
        <meta
          name="description"
          content={polanaData.metadata.description}
        />
        <meta
          name="keywords"
          content="Polana Kłamstw, baśń współczesna, manipulacja rodzinna, prawda vs kłamstwo, Radio Adamowo"
        />
        <meta property="og:title" content={polanaData.metadata.title} />
        <meta
          property="og:description"
          content={polanaData.metadata.description}
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Accessibility */}
        <meta name="theme-color" content="#1a1a1a" />
      </Helmet>

      {/* Page Container */}
      <div className="polana-klamstw-page">
        {/* Header Section */}
        <header className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              {t('polanaKlamstw.title', 'Polana Kłamstw')}
            </h1>
            <p className="page-subtitle">
              {t(
                'polanaKlamstw.subtitle',
                'Baśń współczesna o tym, jak echo może być silniejsze niż głos, a wolność cenniejsza niż majątek.'
              )}
            </p>
          </div>

          {/* Content Warning */}
          <aside className="content-warning" role="note" aria-label="Ostrzeżenie o treści">
            <div className="warning-header">
              <svg
                className="warning-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
              </svg>
              <h2 className="warning-title">
                {t('polanaKlamstw.contentWarning', 'Ostrzeżenie o treści')}
              </h2>
            </div>
            <p className="warning-text">
              {t(
                'polanaKlamstw.contentWarningText',
                'Ta opowieść porusza trudne tematy rodzinne, w tym manipulację psychologiczną, konflikty rodzinne i działanie systemu prawnego. Treści mogą być trudne dla osób, które doświadczyły podobnych sytuacji.'
              )}
            </p>
            <ul className="warning-topics">
              <li>{t('polanaKlamstw.warningTopic1', 'Manipulacja psychologiczna')}</li>
              <li>{t('polanaKlamstw.warningTopic2', 'Konflikt rodzinny')}</li>
              <li>{t('polanaKlamstw.warningTopic3', 'Trudności systemu prawnego')}</li>
              <li>{t('polanaKlamstw.warningTopic4', 'Znęcanie się emocjonalne')}</li>
            </ul>
          </aside>

          {/* Story Info */}
          <div className="story-info">
            <dl className="info-list">
              <div className="info-item">
                <dt>{t('polanaKlamstw.genre', 'Gatunek')}</dt>
                <dd>{polanaData.metadata.genre}</dd>
              </div>
              <div className="info-item">
                <dt>{t('polanaKlamstw.timespan', 'Okres')}</dt>
                <dd>{polanaData.metadata.timespan}</dd>
              </div>
              <div className="info-item">
                <dt>{t('polanaKlamstw.chapters', 'Rozdziałów')}</dt>
                <dd>{polanaData.chapters.length}</dd>
              </div>
              <div className="info-item">
                <dt>{t('polanaKlamstw.totalWords', 'Słów')}</dt>
                <dd>{polanaData.metadata.totalWords.toLocaleString('pl-PL')}</dd>
              </div>
            </dl>
          </div>
        </header>

        {/* Main Reader */}
        <main className="page-main">
          <Suspense
            fallback={
              <div className="loading-spinner" role="status">
                <div className="spinner" aria-label="Ładowanie treści" />
                <p>{t('common.loading', 'Ładowanie...')}</p>
              </div>
            }
          >
            <PolanaKlamstwReader />
          </Suspense>
        </main>

        {/* Footer with themes */}
        <footer className="page-footer">
          <h2 className="footer-title">
            {t('polanaKlamstw.themes', 'Główne tematy')}
          </h2>
          <ul className="themes-list">
            {polanaData.metadata.themes.map((theme, index) => (
              <li key={index} className="theme-item">
                {theme}
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </>
  );
}
