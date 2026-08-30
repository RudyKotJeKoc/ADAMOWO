import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, type AccordionItem } from './Accordion';

/**
 * FAQ Section component demonstrating the Accordion component.
 *
 * This is an example implementation showing how to use the Accordion component
 * for FAQ sections or any collapsible content. The component uses i18n for
 * multilingual support and provides a clean, accessible interface for
 * presenting question-answer pairs.
 *
 * Usage Example:
 * ```tsx
 * import { FAQSection } from '../components/FAQSection';
 *
 * function MyPage() {
 *   return (
 *     <div>
 *       <h1>Help Page</h1>
 *       <FAQSection />
 *     </div>
 *   );
 * }
 * ```
 *
 * Key Features:
 * - Collapsible Q&A format to reduce visual clutter
 * - Single-expansion mode (only one item open at a time)
 * - Keyboard accessible (Space/Enter to toggle)
 * - ARIA compliant for screen readers
 * - Mobile-optimized touch targets
 * - Smooth animations with reduced motion support
 *
 * @component
 * @returns {ReactElement} FAQ section with accordion interface
 */
export function FAQSection(): ReactElement {
  const { t } = useTranslation();

  // Example FAQ items - in a real application, these would come from i18n
  const faqItems: AccordionItem[] = [
    {
      id: 'what-is-radio-adamowo',
      title: 'Czym jest Adamowo.com?',
      content: (
        <div className="space-y-3">
          <p>
            Adamowo.com to edukacyjna baza wiedzy poświęcona prawu, procedurom, analizie materiału
            dowodowego i mechanizmom manipulacji.
          </p>
          <p className="text-sm text-base-300">
            Serwis zawiera definicje, analizy, nagrane audycje, interaktywne narzędzia oraz
            uporządkowane materiały edukacyjne.
          </p>
        </div>
      ),
      defaultExpanded: true,
    },
    {
      id: 'how-to-use-tools',
      title: t('faq.howToUseTools.question', 'Jak korzystać z narzędzi?'),
      content: (
        <div className="space-y-3">
          <p>
            {t(
              'faq.howToUseTools.answer',
              'Nasze narzędzia są dostępne w zakładce "Narzędzia" w głównym menu. Znajdziesz tam analizator pętli przemocy, studio nagrań i inne interaktywne funkcje.'
            )}
          </p>
          <ul className="ml-4 list-inside list-disc space-y-2 text-sm text-base-300">
            <li>Pętla Przemocy - narzędzie do analizy wzorców przemocy</li>
            <li>Studio - tworzenie i nagrywanie treści</li>
            <li>Laboratorium AI - eksperymentalne funkcje oparte na AI</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'is-content-free',
      title: t('faq.isContentFree.question', 'Czy treści są darmowe?'),
      badge: 'Popularne',
      content: (
        <p>
          Wszystkie treści na Adamowo.com są dostępne bezpłatnie. Wiedza o prawie, procedurach i
          manipulacji powinna być przedstawiona jasno oraz bez tworzenia sztucznej bariery dostępu.
        </p>
      ),
    },
    {
      id: 'how-to-get-help',
      title: t('faq.howToGetHelp.question', 'Gdzie mogę znaleźć pomoc?'),
      content: (
        <div className="space-y-3">
          <p>
            {t(
              'faq.howToGetHelp.answer',
              'W zakładce "Pomoc" znajdziesz listę zasobów i numerów telefonów, które mogą pomóc w sytuacjach kryzysowych.'
            )}
          </p>
          <div className="rounded-lg bg-accent-500/10 p-4">
            <p className="font-medium text-accent-200">
              {t('faq.howToGetHelp.emergency', 'W przypadku bezpośredniego zagrożenia:')}
            </p>
            <p className="text-2xl font-bold text-accent-300">112</p>
            <p className="text-sm text-base-300">
              {t('faq.howToGetHelp.emergencyNote', 'Numer alarmowy')}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'multilingual-support',
      title: t('faq.multilingualSupport.question', 'Jakie języki są obsługiwane?'),
      content: (
        <p>
          Adamowo.com obsługuje język polski, angielski i niderlandzki. Język można zmienić w górnej
          części strony.
        </p>
      ),
    },
    {
      id: 'technical-requirements',
      title: t('faq.technicalRequirements.question', 'Jakie są wymagania techniczne?'),
      content: (
        <div className="space-y-3">
          <p>
            Adamowo.com działa we współczesnych przeglądarkach internetowych na komputerach i
            urządzeniach mobilnych.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-base-800 bg-base-900/30 p-3">
              <p className="mb-1 font-medium text-base-100">Desktop</p>
              <p className="text-sm text-base-300">Chrome, Firefox, Safari, Edge</p>
            </div>
            <div className="rounded-lg border border-base-800 bg-base-900/30 p-3">
              <p className="mb-1 font-medium text-base-100">Mobile</p>
              <p className="text-sm text-base-300">iOS Safari, Android Chrome</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-base-50">
          {t('faq.title', 'Często Zadawane Pytania')}
        </h2>
        <p className="mt-2 text-base-200">
          {t(
            'faq.description',
            'Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące platformy.'
          )}
        </p>
      </div>
      <Accordion items={faqItems} allowMultiple={false} />
    </section>
  );
}
