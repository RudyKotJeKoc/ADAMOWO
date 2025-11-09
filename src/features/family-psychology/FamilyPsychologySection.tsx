import { useTranslation } from 'react-i18next';
import { ContentTypeLabel } from '@/components/ContentTypeLabel';
import { AuthorCredit } from '@/components/AuthorCredit';
import { PSYCHOLOGY_SECTIONS } from './family-psychology.data';
import { TransmissionDiagram } from './TransmissionDiagram';
import { PatternIndicators } from './PatternIndicators';
import { ObserverPerspective } from './ObserverPerspective';
import { CurseMetaphor } from './CurseMetaphor';
import { LiberationSteps } from './LiberationSteps';
import { CommunicationExamples } from './CommunicationExamples';
import { ScientificReferences } from './ScientificReferences';

type FamilyPsychologySectionProps = {
  sectionId?: string;
};

export function FamilyPsychologySection({ sectionId }: FamilyPsychologySectionProps = {}): JSX.Element {
  const { t } = useTranslation();

  return (
    <section
      id={sectionId}
      role="region"
      aria-labelledby="family-psychology-title"
      className="space-y-8 rounded-[2.5rem] border border-base-900 bg-gradient-to-br from-base-950/95 via-base-925/80 to-base-950/95 p-8 shadow-[0_0_64px_rgba(9,12,32,0.6)]"
    >
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-accent-200">{t('familyPsychology.kicker')}</p>
          <ContentTypeLabel type="scientific" />
        </div>
        <div className="space-y-3">
          <h2 id="family-psychology-title" className="font-display text-3xl font-semibold text-base-50 sm:text-4xl">
            {t('familyPsychology.title')}
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-base-200">{t('familyPsychology.intro')}</p>
        </div>
      </header>

      <AuthorCredit
        authors={[
          {
            id: 'psychology-expert',
            nameKey: 'author.examples.psychologyExpert.name',
            roleKey: 'author.examples.psychologyExpert.role',
            bioKey: 'author.examples.psychologyExpert.bio',
            credentials: [
              'author.examples.psychologyExpert.credentials.phd',
              'author.examples.psychologyExpert.credentials.certification',
              'author.examples.psychologyExpert.credentials.experience',
            ],
          },
        ]}
        publishedDate="2024-01-15"
        updatedDate="2025-01-05"
      />

      {/* Section 1: Mechanisms */}
      <div className="space-y-6">
        <div className="rounded-xl border border-accent-500/20 bg-base-950/40 p-6">
          <h3 className="mb-4 font-display text-2xl font-semibold text-accent-300">
            {t(PSYCHOLOGY_SECTIONS[0].titleKey)}
          </h3>
          <div className="space-y-4 text-base-200">
            {PSYCHOLOGY_SECTIONS[0].contentKeys.map((contentKey, idx) => (
              <p key={idx} className="leading-relaxed">
                {t(contentKey)}
              </p>
            ))}
          </div>
        </div>

        <TransmissionDiagram />

        <div className="rounded-lg border border-base-800 bg-base-900/40 p-5">
          <h4 className="mb-3 font-semibold text-accent-300">{t('familyPsychology.concepts.title')}</h4>
          <p className="text-sm text-base-300">{t('familyPsychology.concepts.list')}</p>
        </div>
      </div>

      {/* Section 2: Recognition Patterns */}
      <div className="space-y-6">
        <div className="rounded-xl border border-accent-500/20 bg-base-950/40 p-6">
          <h3 className="mb-4 font-display text-2xl font-semibold text-accent-300">
            {t(PSYCHOLOGY_SECTIONS[1].titleKey)}
          </h3>
          <p className="leading-relaxed text-base-200">{t(PSYCHOLOGY_SECTIONS[1].contentKeys[0])}</p>
        </div>

        <PatternIndicators />
      </div>

      {/* Section 3: Observer Perspective */}
      <div className="space-y-6">
        <ObserverPerspective />
      </div>

      {/* Section 4: Curse Metaphor */}
      <div className="space-y-6">
        <CurseMetaphor />
      </div>

      {/* Section 5: Liberation */}
      <div className="space-y-6">
        <div className="rounded-xl border border-accent-500/20 bg-base-950/40 p-6">
          <h3 className="mb-4 font-display text-2xl font-semibold text-accent-300">
            {t(PSYCHOLOGY_SECTIONS[4].titleKey)}
          </h3>
          <p className="leading-relaxed text-base-200">{t(PSYCHOLOGY_SECTIONS[4].contentKeys[0])}</p>
        </div>

        <LiberationSteps />
      </div>

      {/* Section 6: Communication Examples */}
      <CommunicationExamples />

      {/* Scientific References */}
      <ScientificReferences />

      {/* Closing Note */}
      <div className="mt-8 rounded-xl border-2 border-accent-500/50 bg-gradient-to-r from-accent-950/20 to-base-950/20 p-8 text-center">
        <p className="text-lg font-semibold text-accent-200">{t('familyPsychology.closing')}</p>
      </div>
    </section>
  );
}
