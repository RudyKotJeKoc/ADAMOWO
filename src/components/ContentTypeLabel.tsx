import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

/**
 * Content type categories for labeling different types of content
 */
export type ContentType =
  | 'artistic' // Fabularyzowane / Artystyczne / Satyryczne
  | 'expert' // Analiza ekspercka
  | 'guide' // Poradnik praktyczny
  | 'tool' // Narzędzie interaktywne
  | 'documentary' // Materiał dokumentalny
  | 'educational' // Materiał edukacyjny
  | 'case-study' // Studium przypadku
  | 'scientific'; // Treści naukowe

interface ContentTypeLabelProps {
  type: ContentType;
  className?: string;
}

/**
 * ContentTypeLabel Component
 *
 * Displays a badge indicating the type/nature of content to help users
 * distinguish between artistic/satirical content and educational/practical materials.
 *
 * Addresses the recommendation: "Wyraźne rozdzielenie sekcji 'satyra/art' od sekcji 'edukacja/poradnik'"
 */
export function ContentTypeLabel({ type, className }: ContentTypeLabelProps): JSX.Element {
  const { t } = useTranslation();

  const getTypeConfig = (contentType: ContentType) => {
    const configs: Record<
      ContentType,
      { labelKey: string; colorClasses: string; icon: string }
    > = {
      artistic: {
        labelKey: 'contentType.artistic',
        colorClasses: 'border-purple-500/30 bg-purple-500/10 text-purple-200',
        icon: '🎭',
      },
      expert: {
        labelKey: 'contentType.expert',
        colorClasses: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
        icon: '👤',
      },
      guide: {
        labelKey: 'contentType.guide',
        colorClasses: 'border-green-500/30 bg-green-500/10 text-green-200',
        icon: '📖',
      },
      tool: {
        labelKey: 'contentType.tool',
        colorClasses: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
        icon: '🛠️',
      },
      documentary: {
        labelKey: 'contentType.documentary',
        colorClasses: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
        icon: '🎬',
      },
      educational: {
        labelKey: 'contentType.educational',
        colorClasses: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200',
        icon: '📚',
      },
      'case-study': {
        labelKey: 'contentType.caseStudy',
        colorClasses: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
        icon: '📋',
      },
      scientific: {
        labelKey: 'contentType.scientific',
        colorClasses: 'border-teal-500/30 bg-teal-500/10 text-teal-200',
        icon: '🔬',
      },
    };

    return configs[contentType];
  };

  const config = getTypeConfig(type);

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        config.colorClasses,
        className
      )}
      role="status"
      aria-label={t(config.labelKey)}
    >
      <span aria-hidden="true">{config.icon}</span>
      <span>{t(config.labelKey)}</span>
    </span>
  );
}
