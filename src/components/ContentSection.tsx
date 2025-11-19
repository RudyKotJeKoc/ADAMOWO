/**
 * ContentSection - Component for clearly separating factual and interpretative content
 *
 * Usage:
 * <ContentSection type="facts" title="Fakty i źródła">...</ContentSection>
 * <ContentSection type="interpretation" title="Interpretacja i symbolika">...</ContentSection>
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import './ContentSection.css';

export type ContentSectionType =
  | 'facts' // Neutral, factual reporting
  | 'chronology' // Timeline of events
  | 'interpretation' // Opinion, literary analysis
  | 'resources' // Help resources and links
  | 'legal' // Legal notices and disclaimers
  | 'summary'; // TL;DR summary

export interface ContentSectionProps {
  /** Section type determines styling and warning labels */
  type: ContentSectionType;

  /** Section title */
  title?: string;

  /** Optional subtitle or description */
  subtitle?: string;

  /** Section content */
  children: React.ReactNode;

  /** Show section icon/badge */
  showBadge?: boolean;

  /** Collapsible section */
  collapsible?: boolean;

  /** Initially collapsed (requires collapsible=true) */
  defaultCollapsed?: boolean;

  /** Custom CSS class */
  className?: string;
}

export function ContentSection({
  type,
  title,
  subtitle,
  children,
  showBadge = true,
  collapsible = false,
  defaultCollapsed = false,
  className = '',
}: ContentSectionProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  // Get section configuration
  const config = getSectionConfig(type, t);

  const sectionTitle = title || config.defaultTitle;

  return (
    <section
      className={`content-section content-section--${type} ${className}`}
      aria-labelledby={`section-${type}-title`}
    >
      <header className="content-section__header">
        <div className="content-section__title-row">
          {showBadge && (
            <span
              className={`content-section__badge content-section__badge--${type}`}
              aria-label={config.badgeLabel}
            >
              {config.icon}
            </span>
          )}

          <h2 id={`section-${type}-title`} className="content-section__title">
            {sectionTitle}
          </h2>

          {collapsible && (
            <button
              className="content-section__toggle"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-expanded={!isCollapsed}
              aria-controls={`section-${type}-content`}
            >
              <span className="visually-hidden">
                {isCollapsed
                  ? t('content.section.expand', 'Rozwiń')
                  : t('content.section.collapse', 'Zwiń')}
              </span>
              <span aria-hidden="true">{isCollapsed ? '▼' : '▲'}</span>
            </button>
          )}
        </div>

        {subtitle && <p className="content-section__subtitle">{subtitle}</p>}

        {config.disclaimer && (
          <div className={`content-section__disclaimer content-section__disclaimer--${type}`}>
            <strong>{config.disclaimer.icon}</strong>
            <span>{config.disclaimer.text}</span>
          </div>
        )}
      </header>

      <div
        id={`section-${type}-content`}
        className={`content-section__content ${isCollapsed ? 'content-section__content--collapsed' : ''}`}
        hidden={collapsible && isCollapsed}
      >
        {children}
      </div>
    </section>
  );
}

// Section configuration
interface SectionConfig {
  defaultTitle: string;
  badgeLabel: string;
  icon: string;
  disclaimer?: {
    icon: string;
    text: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSectionConfig(type: ContentSectionType, t: any): SectionConfig {
  switch (type) {
    case 'facts':
      return {
        defaultTitle: t('content.section.facts.title', 'Fakty i źródła'),
        badgeLabel: t('content.section.facts.badge', 'Sekcja faktograficzna'),
        icon: '📋',
        disclaimer: {
          icon: 'ℹ️',
          text: t(
            'content.section.facts.disclaimer',
            'Poniższe informacje przedstawiono w tonie neutralnym i reporterskim. Dane osobowe zostały zanonimizowane.'
          ),
        },
      };

    case 'chronology':
      return {
        defaultTitle: t('content.section.chronology.title', 'Chronologia wydarzeń'),
        badgeLabel: t('content.section.chronology.badge', 'Oś czasu'),
        icon: '🕐',
      };

    case 'interpretation':
      return {
        defaultTitle: t('content.section.interpretation.title', 'Interpretacja i symbolika'),
        badgeLabel: t('content.section.interpretation.badge', 'Sekcja interpretacyjna'),
        icon: '💭',
        disclaimer: {
          icon: '⚠️',
          text: t(
            'content.section.interpretation.disclaimer',
            'INTERPRETACJA: Poniższa treść przedstawia subiektywną analizę i interpretację. Nie stanowi faktów, lecz opinię autora.'
          ),
        },
      };

    case 'resources':
      return {
        defaultTitle: t('content.section.resources.title', 'Zasoby i pomoc'),
        badgeLabel: t('content.section.resources.badge', 'Zasoby pomocowe'),
        icon: '🆘',
        disclaimer: {
          icon: '💙',
          text: t(
            'content.section.resources.disclaimer',
            'Jeśli doświadczasz przemocy lub potrzebujesz wsparcia, poniżej znajdziesz numery pomocy i zasoby.'
          ),
        },
      };

    case 'legal':
      return {
        defaultTitle: t('content.section.legal.title', 'Informacje prawne'),
        badgeLabel: t('content.section.legal.badge', 'Klauzula prawna'),
        icon: '⚖️',
      };

    case 'summary':
      return {
        defaultTitle: t('content.section.summary.title', 'Podsumowanie (TL;DR)'),
        badgeLabel: t('content.section.summary.badge', 'Skrócone podsumowanie'),
        icon: '📝',
      };

    default:
      return {
        defaultTitle: '',
        badgeLabel: '',
        icon: '📄',
      };
  }
}

/**
 * Pre-configured section components for common use cases
 */

export function FactsSection({ title, children, ...props }: Omit<ContentSectionProps, 'type'>) {
  return (
    <ContentSection type="facts" title={title} {...props}>
      {children}
    </ContentSection>
  );
}

export function ChronologySection({
  title,
  children,
  ...props
}: Omit<ContentSectionProps, 'type'>) {
  return (
    <ContentSection type="chronology" title={title} {...props}>
      {children}
    </ContentSection>
  );
}

export function InterpretationSection({
  title,
  children,
  ...props
}: Omit<ContentSectionProps, 'type'>) {
  return (
    <ContentSection type="interpretation" title={title} {...props}>
      {children}
    </ContentSection>
  );
}

export function ResourcesSection({ title, children, ...props }: Omit<ContentSectionProps, 'type'>) {
  return (
    <ContentSection type="resources" title={title} {...props}>
      {children}
    </ContentSection>
  );
}

export function LegalSection({ title, children, ...props }: Omit<ContentSectionProps, 'type'>) {
  return (
    <ContentSection type="legal" title={title} {...props}>
      {children}
    </ContentSection>
  );
}

export function SummarySection({ title, children, ...props }: Omit<ContentSectionProps, 'type'>) {
  return (
    <ContentSection type="summary" title={title} {...props}>
      {children}
    </ContentSection>
  );
}
