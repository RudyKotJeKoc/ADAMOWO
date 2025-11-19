/**
 * DocumentNotice - Component for legal notices about document verification
 *
 * Use this when publishing anonymized versions of legal documents,
 * notarial acts, court files, etc.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import './DocumentNotice.css';

export interface DocumentNoticeProps {
  /** Type of documents referenced */
  documentType?: 'notarial' | 'court' | 'administrative' | 'financial' | 'other';

  /** Custom document type label */
  customTypeLabel?: string;

  /** Contact email for verification requests */
  contactEmail?: string;

  /** Additional information or instructions */
  additionalInfo?: string;

  /** Show anonymization notice */
  showAnonymizationNotice?: boolean;

  /** Show verification instructions */
  showVerificationInstructions?: boolean;

  /** Compact display mode */
  compact?: boolean;

  /** Custom CSS class */
  className?: string;
}

export function DocumentNotice({
  documentType = 'other',
  customTypeLabel,
  contactEmail,
  additionalInfo,
  showAnonymizationNotice = true,
  showVerificationInstructions = true,
  compact = false,
  className = '',
}: DocumentNoticeProps) {
  const { t } = useTranslation();

  const typeLabel = customTypeLabel || getDocumentTypeLabel(documentType, t);

  return (
    <aside
      className={`document-notice ${compact ? 'document-notice--compact' : ''} ${className}`}
      role="note"
      aria-label={t('document.notice.label', 'Informacja o dokumentacji')}
    >
      <div className="document-notice__header">
        <span className="document-notice__icon" aria-hidden="true">
          ⚖️
        </span>
        <h3 className="document-notice__title">
          {t('document.notice.title', 'Dokumentacja źródłowa')}
        </h3>
      </div>

      <div className="document-notice__content">
        <p className="document-notice__main-text">
          <strong>{typeLabel}</strong>
          {' — '}
          {t(
            'document.notice.availability',
            'szczegóły udostępnimy uprawnionym w celu weryfikacji; wersja publiczna została zanonimizowana.'
          )}
        </p>

        {showAnonymizationNotice && (
          <div className="document-notice__anonymization">
            <span className="document-notice__badge document-notice__badge--privacy">
              🔒 {t('document.notice.anonymized', 'Zanonimizowano')}
            </span>
            <p className="document-notice__small-text">
              {t(
                'document.notice.anonymization.details',
                'Dane osobowe, adresy, numery identyfikacyjne i dokładne kwoty zostały ukryte lub zmienione w celu ochrony prywatności.'
              )}
            </p>
          </div>
        )}

        {showVerificationInstructions && (
          <div className="document-notice__verification">
            <h4 className="document-notice__subtitle">
              {t('document.notice.verification.title', 'Weryfikacja dokumentów')}
            </h4>
            <p className="document-notice__small-text">
              {t(
                'document.notice.verification.instructions',
                'Strony uprawnione (uczestniczące w postępowaniu, ich pełnomocnicy, lub osoby posiadające uzasadniony interes prawny) mogą uzyskać dostęp do dokumentacji źródłowej w celu weryfikacji.'
              )}
            </p>

            {contactEmail && (
              <p className="document-notice__contact">
                <strong>{t('document.notice.contact', 'Kontakt:')}</strong>{' '}
                <a href={`mailto:${contactEmail}`} className="document-notice__email">
                  {contactEmail}
                </a>
              </p>
            )}

            <details className="document-notice__details">
              <summary className="document-notice__summary">
                {t('document.notice.procedure.label', 'Procedura dostępu do dokumentów')}
              </summary>
              <ol className="document-notice__procedure-list">
                <li>
                  {t(
                    'document.notice.procedure.step1',
                    'Skontaktuj się z nami, podając swój interes prawny i rodzaj dokumentu.'
                  )}
                </li>
                <li>
                  {t(
                    'document.notice.procedure.step2',
                    'Przedstaw dokument potwierdzający Twoją tożsamość i uprawnienie (np. pełnomocnictwo).'
                  )}
                </li>
                <li>
                  {t(
                    'document.notice.procedure.step3',
                    'Po weryfikacji udostępnimy odpowiednie dokumenty w sposób bezpieczny.'
                  )}
                </li>
              </ol>
            </details>
          </div>
        )}

        {additionalInfo && (
          <div className="document-notice__additional">
            <p className="document-notice__small-text">{additionalInfo}</p>
          </div>
        )}

        <div className="document-notice__footer">
          <span className="document-notice__badge document-notice__badge--legal">
            {t('document.notice.transparency', 'Dla transparentności')}
          </span>
          <p className="document-notice__disclaimer">
            {t(
              'document.notice.disclaimer',
              'Publikacja nastąpiła w interesie publicznym. Jeśli uważasz, że publikacja narusza Twoje prawa, skontaktuj się z nami.'
            )}
          </p>
        </div>
      </div>
    </aside>
  );
}

// Helper function for document type labels
function getDocumentTypeLabel(
  type: string,
  t: (key: string, defaultValue: string) => string
): string {
  switch (type) {
    case 'notarial':
      return t('document.type.notarial', 'Akta notarialne');
    case 'court':
      return t('document.type.court', 'Akta sądowe');
    case 'administrative':
      return t('document.type.administrative', 'Dokumenty administracyjne');
    case 'financial':
      return t('document.type.financial', 'Dokumenty finansowe');
    default:
      return t('document.type.other', 'Dokumentacja');
  }
}

/**
 * Simplified version for inline use
 */
export function InlineDocumentNotice({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <p className="inline-document-notice">
      <span className="inline-document-notice__icon" aria-hidden="true">
        📄
      </span>
      {children ||
        t(
          'document.notice.inline.default',
          'Dokumentacja źródłowa: szczegóły udostępnimy uprawnionym w celu weryfikacji; wersja publiczna została zanonimizowana.'
        )}
    </p>
  );
}
