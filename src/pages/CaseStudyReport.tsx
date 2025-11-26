import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Case Study Report Page - Analytisch Rapport
 *
 * A comprehensive analytical report presenting a case study of legal system
 * instrumentalization and psychological manipulation. Designed as a high-end
 * investigative/forensic report with academic rigor.
 *
 * Primary Language: Dutch (Nederlands)
 * Features:
 * - Dark investigative aesthetic
 * - Professional report structure with numbered sections
 * - Tables and grids for tactical analysis
 * - Serif typography for academic feel
 * - Highlighted conclusions section
 */
export default function CaseStudyReport(): ReactElement {
  const { t } = useTranslation();

  return (
    <article className="mx-auto max-w-5xl space-y-16">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HEADER / TITLE SECTION */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="space-y-6 border-b border-base-700 pb-8">
        <div className="space-y-3">
          <div className="font-mono text-xs uppercase tracking-widest text-accent-400">
            {t('caseStudy.label', 'Casestudy')}
          </div>
          <h1 className="font-serif text-4xl font-bold leading-tight text-base-50 md:text-5xl lg:text-6xl">
            {t('caseStudy.title')}
          </h1>
          <p className="text-xl font-medium text-accent-300 md:text-2xl">
            {t('caseStudy.subtitle')}
          </p>
        </div>

        <div className="rounded-lg border-l-4 border-accent-500 bg-accent-500/10 p-6">
          <p className="leading-relaxed text-base-200">{t('caseStudy.intro')}</p>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION I: ARCHITECTURE OF MANIPULATION */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-serif text-3xl font-bold text-base-50">
            {t('caseStudy.section1.title')}
          </h2>
          <p className="text-lg leading-relaxed text-base-200">{t('caseStudy.section1.intro')}</p>
        </div>

        {/* Subsection 1.1 */}
        <div className="space-y-4 rounded-xl border border-base-800 bg-base-900/60 p-6 md:p-8">
          <h3 className="text-xl font-bold text-accent-300">
            {t('caseStudy.section1.sub1.title')}
          </h3>
          <p className="leading-relaxed text-base-200">{t('caseStudy.section1.sub1.content')}</p>
        </div>

        {/* Subsection 1.2 - Tactical Table */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-accent-300">
            {t('caseStudy.section1.sub2.title')}
          </h3>

          <div className="overflow-hidden rounded-xl border border-base-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-base-900/80">
                  <tr>
                    <th className="p-4 text-left font-mono text-sm uppercase tracking-wide text-accent-400">
                      {t('caseStudy.section1.sub2.table.tactic')}
                    </th>
                    <th className="p-4 text-left font-mono text-sm uppercase tracking-wide text-accent-400">
                      {t('caseStudy.section1.sub2.table.description')}
                    </th>
                    <th className="p-4 text-left font-mono text-sm uppercase tracking-wide text-accent-400">
                      {t('caseStudy.section1.sub2.table.goal')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-800">
                  {/* Tactic 1 */}
                  <tr className="transition-colors hover:bg-base-900/40">
                    <td className="p-4 font-semibold text-base-100">
                      {t('caseStudy.section1.sub2.tactics.obsessiveDoc.name')}
                    </td>
                    <td className="p-4 text-base-200">
                      {t('caseStudy.section1.sub2.tactics.obsessiveDoc.desc')}
                    </td>
                    <td className="p-4 text-base-300">
                      {t('caseStudy.section1.sub2.tactics.obsessiveDoc.goal')}
                    </td>
                  </tr>
                  {/* Tactic 2 */}
                  <tr className="transition-colors hover:bg-base-900/40">
                    <td className="p-4 font-semibold text-base-100">
                      {t('caseStudy.section1.sub2.tactics.provocation.name')}
                    </td>
                    <td className="p-4 text-base-200">
                      {t('caseStudy.section1.sub2.tactics.provocation.desc')}
                    </td>
                    <td className="p-4 text-base-300">
                      {t('caseStudy.section1.sub2.tactics.provocation.goal')}
                    </td>
                  </tr>
                  {/* Tactic 3 */}
                  <tr className="transition-colors hover:bg-base-900/40">
                    <td className="p-4 font-semibold text-base-100">
                      {t('caseStudy.section1.sub2.tactics.blackmail.name')}
                    </td>
                    <td className="p-4 text-base-200">
                      {t('caseStudy.section1.sub2.tactics.blackmail.desc')}
                    </td>
                    <td className="p-4 text-base-300">
                      {t('caseStudy.section1.sub2.tactics.blackmail.goal')}
                    </td>
                  </tr>
                  {/* Tactic 4 */}
                  <tr className="transition-colors hover:bg-base-900/40">
                    <td className="p-4 font-semibold text-base-100">
                      {t('caseStudy.section1.sub2.tactics.reverseTriage.name')}
                    </td>
                    <td className="p-4 text-base-200">
                      {t('caseStudy.section1.sub2.tactics.reverseTriage.desc')}
                    </td>
                    <td className="p-4 text-base-300">
                      {t('caseStudy.section1.sub2.tactics.reverseTriage.goal')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Subsection 1.3 */}
        <div className="space-y-4 rounded-xl border border-base-800 bg-base-900/60 p-6 md:p-8">
          <h3 className="text-xl font-bold text-accent-300">
            {t('caseStudy.section1.sub3.title')}
          </h3>
          <p className="leading-relaxed text-base-200">{t('caseStudy.section1.sub3.content')}</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION II: INSTRUMENTALIZATION OF ENVIRONMENT */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-serif text-3xl font-bold text-base-50">
            {t('caseStudy.section2.title')}
          </h2>
          <p className="text-lg leading-relaxed text-base-200">{t('caseStudy.section2.intro')}</p>
        </div>

        {/* Subsection 2.1 - Case Study: Sylwester */}
        <div className="space-y-6 rounded-xl border-2 border-danger-500/30 bg-danger-500/5 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎭</div>
            <h3 className="text-xl font-bold text-danger-300">
              {t('caseStudy.section2.sub1.title')}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border-l-4 border-danger-500 bg-base-900/60 p-4">
              <h4 className="mb-2 font-mono text-sm uppercase tracking-wide text-danger-400">
                {t('caseStudy.section2.sub1.point1.title')}
              </h4>
              <p className="text-base-200">{t('caseStudy.section2.sub1.point1.content')}</p>
            </div>

            <div className="rounded-lg border-l-4 border-danger-500 bg-base-900/60 p-4">
              <h4 className="mb-2 font-mono text-sm uppercase tracking-wide text-danger-400">
                {t('caseStudy.section2.sub1.point2.title')}
              </h4>
              <p className="text-base-200">{t('caseStudy.section2.sub1.point2.content')}</p>
            </div>

            <div className="rounded-lg border-l-4 border-danger-500 bg-base-900/60 p-4">
              <h4 className="mb-2 font-mono text-sm uppercase tracking-wide text-danger-400">
                {t('caseStudy.section2.sub1.point3.title')}
              </h4>
              <p className="text-base-200">{t('caseStudy.section2.sub1.point3.content')}</p>
            </div>
          </div>
        </div>

        {/* Subsection 2.2 */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-accent-300">
            {t('caseStudy.section2.sub2.title')}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-base-800 bg-base-900/40 p-5">
              <h4 className="mb-2 font-semibold text-base-100">
                {t('caseStudy.section2.sub2.role1.title')}
              </h4>
              <p className="text-sm text-base-300">{t('caseStudy.section2.sub2.role1.content')}</p>
            </div>
            <div className="rounded-lg border border-base-800 bg-base-900/40 p-5">
              <h4 className="mb-2 font-semibold text-base-100">
                {t('caseStudy.section2.sub2.role2.title')}
              </h4>
              <p className="text-sm text-base-300">{t('caseStudy.section2.sub2.role2.content')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION III: SYSTEMIC ESCALATION */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-serif text-3xl font-bold text-base-50">
            {t('caseStudy.section3.title')}
          </h2>
          <p className="text-lg leading-relaxed text-base-200">{t('caseStudy.section3.intro')}</p>
        </div>

        {/* Subsections 3.1, 3.2, 3.3 */}
        <div className="space-y-6">
          <div className="rounded-xl border border-base-800 bg-base-900/60 p-6">
            <h3 className="mb-3 text-xl font-bold text-accent-300">
              {t('caseStudy.section3.sub1.title')}
            </h3>
            <p className="leading-relaxed text-base-200">{t('caseStudy.section3.sub1.content')}</p>
          </div>

          <div className="rounded-xl border border-base-800 bg-base-900/60 p-6">
            <h3 className="mb-3 text-xl font-bold text-accent-300">
              {t('caseStudy.section3.sub2.title')}
            </h3>
            <div className="space-y-3">
              <div className="rounded border-l-4 border-danger-500 bg-base-900/40 p-4">
                <h4 className="mb-2 font-semibold text-base-100">
                  {t('caseStudy.section3.sub2.betrayal1.title')}
                </h4>
                <p className="text-sm text-base-200">
                  {t('caseStudy.section3.sub2.betrayal1.content')}
                </p>
              </div>
              <div className="rounded border-l-4 border-danger-500 bg-base-900/40 p-4">
                <h4 className="mb-2 font-semibold text-base-100">
                  {t('caseStudy.section3.sub2.betrayal2.title')}
                </h4>
                <p className="text-sm text-base-200">
                  {t('caseStudy.section3.sub2.betrayal2.content')}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-base-800 bg-base-900/60 p-6">
            <h3 className="mb-3 text-xl font-bold text-accent-300">
              {t('caseStudy.section3.sub3.title')}
            </h3>
            <ol className="ml-6 list-decimal space-y-2 text-base-200">
              <li>{t('caseStudy.section3.sub3.error1')}</li>
              <li>{t('caseStudy.section3.sub3.error2')}</li>
            </ol>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION IV: VICTIM'S TRAJECTORY */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-serif text-3xl font-bold text-base-50">
            {t('caseStudy.section4.title')}
          </h2>
          <p className="text-lg leading-relaxed text-base-200">{t('caseStudy.section4.intro')}</p>
        </div>

        <div className="space-y-6">
          {/* 4.1 */}
          <div className="rounded-xl border border-base-800 bg-base-900/60 p-6">
            <h3 className="mb-4 text-xl font-bold text-accent-300">
              {t('caseStudy.section4.sub1.title')}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded bg-base-900/80 p-4">
                <div className="mb-2 font-mono text-xs uppercase tracking-wide text-accent-400">
                  {t('caseStudy.section4.sub1.financial.label')}
                </div>
                <p className="text-base-200">{t('caseStudy.section4.sub1.financial.content')}</p>
              </div>
              <div className="rounded bg-base-900/80 p-4">
                <div className="mb-2 font-mono text-xs uppercase tracking-wide text-accent-400">
                  {t('caseStudy.section4.sub1.care.label')}
                </div>
                <p className="text-base-200">{t('caseStudy.section4.sub1.care.content')}</p>
              </div>
            </div>
          </div>

          {/* 4.2 - Defense Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-accent-300">
              {t('caseStudy.section4.sub2.title')}
            </h3>
            <div className="overflow-hidden rounded-xl border border-base-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-base-900/80">
                    <tr>
                      <th className="p-4 text-left font-mono text-sm uppercase tracking-wide text-accent-400">
                        {t('caseStudy.section4.sub2.table.action')}
                      </th>
                      <th className="p-4 text-left font-mono text-sm uppercase tracking-wide text-accent-400">
                        {t('caseStudy.section4.sub2.table.reality')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-800">
                    <tr className="transition-colors hover:bg-base-900/40">
                      <td className="p-4 font-semibold text-base-100">
                        {t('caseStudy.section4.sub2.actions.cameras.action')}
                      </td>
                      <td className="p-4 text-base-200">
                        {t('caseStudy.section4.sub2.actions.cameras.reality')}
                      </td>
                    </tr>
                    <tr className="transition-colors hover:bg-base-900/40">
                      <td className="p-4 font-semibold text-base-100">
                        {t('caseStudy.section4.sub2.actions.avoidance.action')}
                      </td>
                      <td className="p-4 text-base-200">
                        {t('caseStudy.section4.sub2.actions.avoidance.reality')}
                      </td>
                    </tr>
                    <tr className="transition-colors hover:bg-base-900/40">
                      <td className="p-4 font-semibold text-base-100">
                        {t('caseStudy.section4.sub2.actions.destruction.action')}
                      </td>
                      <td className="p-4 text-base-200">
                        {t('caseStudy.section4.sub2.actions.destruction.reality')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4.3 */}
          <div className="rounded-xl border border-base-800 bg-base-900/60 p-6">
            <h3 className="mb-4 text-xl font-bold text-accent-300">
              {t('caseStudy.section4.sub3.title')}
            </h3>
            <div className="space-y-3">
              <div className="rounded bg-base-900/80 p-4">
                <div className="mb-2 font-mono text-xs uppercase tracking-wide text-accent-400">
                  {t('caseStudy.section4.sub3.diagnosis.label')}
                </div>
                <p className="text-base-200">{t('caseStudy.section4.sub3.diagnosis.content')}</p>
              </div>
              <div className="rounded bg-base-900/80 p-4">
                <div className="mb-2 font-mono text-xs uppercase tracking-wide text-accent-400">
                  {t('caseStudy.section4.sub3.capitulation.label')}
                </div>
                <p className="text-base-200">
                  {t('caseStudy.section4.sub3.capitulation.content')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION V: CONCLUSIONS (HIGHLIGHTED) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-8 rounded-2xl border-2 border-accent-500 bg-gradient-to-br from-accent-500/10 to-accent-600/5 p-8 shadow-lg shadow-accent-500/20 md:p-12">
        <div className="space-y-3">
          <div className="inline-block rounded-full bg-accent-500/20 px-4 py-2 font-mono text-sm font-semibold uppercase tracking-wide text-accent-300">
            {t('caseStudy.section5.label')}
          </div>
          <h2 className="font-serif text-3xl font-bold text-accent-200">
            {t('caseStudy.section5.title')}
          </h2>
        </div>

        {/* 5.1 - Analysis */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-base-50">{t('caseStudy.section5.sub1.title')}</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-base-700 bg-base-900/60 p-6">
              <h4 className="mb-3 flex items-center gap-2 text-lg font-bold text-danger-300">
                <span>💔</span>
                <span>{t('caseStudy.section5.sub1.barbara.title')}</span>
              </h4>
              <p className="text-base-200">{t('caseStudy.section5.sub1.barbara.content')}</p>
            </div>
            <div className="rounded-xl border border-base-700 bg-base-900/60 p-6">
              <h4 className="mb-3 flex items-center gap-2 text-lg font-bold text-green-300">
                <span>🕊️</span>
                <span>{t('caseStudy.section5.sub1.dariusz.title')}</span>
              </h4>
              <p className="text-base-200">{t('caseStudy.section5.sub1.dariusz.content')}</p>
            </div>
          </div>
        </div>

        {/* 5.2 - Recommendations */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-base-50">{t('caseStudy.section5.sub2.title')}</h3>
          <ol className="ml-6 space-y-3 text-lg">
            <li className="text-base-200">
              <span className="font-mono font-semibold text-accent-300">1.</span>{' '}
              {t('caseStudy.section5.sub2.rec1')}
            </li>
            <li className="text-base-200">
              <span className="font-mono font-semibold text-accent-300">2.</span>{' '}
              {t('caseStudy.section5.sub2.rec2')}
            </li>
            <li className="text-base-200">
              <span className="font-mono font-semibold text-accent-300">3.</span>{' '}
              {t('caseStudy.section5.sub2.rec3')}
            </li>
          </ol>
        </div>
      </section>

      {/* Footer Attribution */}
      <footer className="border-t border-base-800 pt-8 text-center">
        <p className="font-mono text-sm text-base-500">
          {t('caseStudy.footer', 'Analytisch Rapport – Radio Adamowo Research')}
        </p>
      </footer>
    </article>
  );
}
