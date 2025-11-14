/**
 * ViolenceWarning - Specialized content warning for violence-related articles
 *
 * Displays trigger warnings and help resources prominently at the top
 * of articles dealing with domestic violence, psychological abuse, etc.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentWarning } from './ContentWarning';
import './ViolenceWarning.css';

export interface ViolenceWarningProps {
  /** Specific violence topics (will be added to default topics) */
  topics?: string[];

  /** Severity level */
  severity?: 'mild' | 'moderate' | 'severe';

  /** Custom warning message */
  customMessage?: string;

  /** Show help resources section */
  showResources?: boolean;

  /** Additional resource links */
  additionalResources?: Array<{
    name: string;
    url: string;
    phone?: string;
    description?: string;
  }>;

  /** Blocking mode (requires explicit acknowledgment) */
  blocking?: boolean;

  /** Remember user's choice */
  storageKey?: string;

  /** Content to show after warning */
  children?: React.ReactNode;
}

export function ViolenceWarning({
  topics = [],
  severity = 'severe',
  customMessage,
  showResources = true,
  additionalResources = [],
  blocking = true,
  storageKey,
  children,
}: ViolenceWarningProps) {
  const { t } = useTranslation();
  const [acknowledged, setAcknowledged] = useState(() => {
    if (!storageKey) return false;
    return sessionStorage.getItem(storageKey) === 'acknowledged';
  });

  // Default topics for violence warnings
  const defaultTopics = [
    t('content.warning.topic.violence', 'przemoc'),
    t('content.warning.topic.psychological.abuse', 'przemoc psychiczna'),
  ];

  const allTopics = [...defaultTopics, ...topics];

  const handleAcknowledge = () => {
    setAcknowledged(true);
    if (storageKey) {
      sessionStorage.setItem(storageKey, 'acknowledged');
    }
  };

  // Default help resources for Poland
  const defaultResources = [
    {
      name: t('violence.warning.resource.blueline.name', 'Niebieska Linia'),
      phone: '800 120 002',
      url: 'https://www.niebieskalinia.pl/',
      description: t(
        'violence.warning.resource.blueline.desc',
        'Wsparcie kryzysowe dla ofiar przemocy domowej, dostępne 24/7'
      ),
    },
    {
      name: t('violence.warning.resource.trustphone.name', 'Telefon Zaufania'),
      phone: '116 123',
      url: 'https://www.116123.pl/',
      description: t(
        'violence.warning.resource.trustphone.desc',
        'Wsparcie emocjonalne i interwencja kryzysowa'
      ),
    },
    {
      name: t('violence.warning.resource.womensrights.name', 'Centrum Praw Kobiet'),
      phone: '600 070 717',
      url: 'https://cpk.org.pl/',
      description: t(
        'violence.warning.resource.womensrights.desc',
        'Pomoc prawna, psychologiczna i doradztwo'
      ),
    },
  ];

  const allResources = [...defaultResources, ...additionalResources];

  if (acknowledged && !blocking) {
    return <>{children}</>;
  }

  return (
    <div className="violence-warning-container">
      <ContentWarning
        topics={allTopics}
        severity={severity}
        message={
          customMessage ||
          t(
            'violence.warning.default.message',
            'Poniższy artykuł zawiera opisy przemocy psychicznej, manipulacji i innych trudnych doświadczeń. Jeśli te treści mogą być dla Ciebie trudne lub wyzwalające, rozważ przeczytanie go w bezpiecznym dla siebie momencie.'
          )
        }
        blocking={blocking}
        onDismiss={handleAcknowledge}
        storageKey={storageKey}
      />

      {showResources && (
        <aside className="violence-warning__resources" aria-label={t('violence.warning.resources.label', 'Zasoby pomocowe')}>
          <div className="violence-warning__resources-header">
            <h3 className="violence-warning__resources-title">
              {t('violence.warning.resources.title', '🆘 Gdzie szukać pomocy?')}
            </h3>
            <p className="violence-warning__resources-subtitle">
              {t(
                'violence.warning.resources.subtitle',
                'Jeśli doświadczasz przemocy lub potrzebujesz wsparcia, skontaktuj się z jedną z poniższych organizacji:'
              )}
            </p>
          </div>

          <ul className="violence-warning__resources-list">
            {allResources.map((resource, index) => (
              <li key={index} className="violence-warning__resource-item">
                <div className="violence-warning__resource-header">
                  <strong className="violence-warning__resource-name">{resource.name}</strong>
                  {resource.phone && (
                    <a
                      href={`tel:${resource.phone.replace(/\s/g, '')}`}
                      className="violence-warning__resource-phone"
                    >
                      📞 {resource.phone}
                    </a>
                  )}
                </div>
                {resource.description && (
                  <p className="violence-warning__resource-description">{resource.description}</p>
                )}
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="violence-warning__resource-link"
                  >
                    {t('violence.warning.resource.visit', 'Odwiedź stronę')} →
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="violence-warning__emergency-note">
            <strong>⚠️ {t('violence.warning.emergency.title', 'W sytuacji bezpośredniego zagrożenia:')}</strong>
            <p>
              {t(
                'violence.warning.emergency.description',
                'Zadzwoń pod numer alarmowy 112 lub skontaktuj się z lokalną Policją. Twoje bezpieczeństwo jest priorytetem.'
              )}
            </p>
          </div>
        </aside>
      )}

      {acknowledged && blocking && (
        <div className="violence-warning__content" role="main">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Quick wrapper for articles with violence content
 */
export function ViolenceArticle({
  title,
  severity = 'severe',
  children,
}: {
  title: string;
  severity?: 'mild' | 'moderate' | 'severe';
  children: React.ReactNode;
}) {
  const storageKey = `violence-warning-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <ViolenceWarning
      severity={severity}
      blocking={true}
      showResources={true}
      storageKey={storageKey}
    >
      {children}
    </ViolenceWarning>
  );
}
