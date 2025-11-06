import { useTranslation } from 'react-i18next';
import { TRANSMISSION_CHAIN } from './family-psychology.data';

export function TransmissionDiagram(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="my-8 overflow-x-auto">
      <div className="min-w-[600px] rounded-2xl border border-accent-500/30 bg-base-950/60 p-8">
        <h3 className="mb-6 text-center font-display text-xl font-semibold text-accent-300">
          {t('familyPsychology.transmission.title')}
        </h3>
        <div className="flex items-center justify-center gap-4">
          {TRANSMISSION_CHAIN.map((node, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-20 w-32 items-center justify-center rounded-xl border border-accent-400/50 bg-gradient-to-br from-base-900 to-base-925 p-3 text-center shadow-lg">
                  <span className="text-sm font-semibold text-base-50">{t(node.nameKey)}</span>
                </div>
                <div className="mt-3 max-w-[140px] text-center text-xs text-base-300">
                  {t(node.mechanismKey)}
                </div>
              </div>
              {index < TRANSMISSION_CHAIN.length - 1 && (
                <div className="flex flex-col items-center">
                  <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                    <path
                      d="M2 16 L38 16 M38 16 L30 8 M38 16 L30 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-accent-500"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-lg border border-base-800 bg-base-900/40 p-4 text-center">
          <p className="text-sm italic text-base-200">{t('familyPsychology.transmission.note')}</p>
        </div>
      </div>
    </div>
  );
}
