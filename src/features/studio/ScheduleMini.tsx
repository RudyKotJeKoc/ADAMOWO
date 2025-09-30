import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import type { ScheduleEntry } from './studio.schema';

const WEEKDAY_KEYS = [
  'studio.schedule.weekdays.0',
  'studio.schedule.weekdays.1',
  'studio.schedule.weekdays.2',
  'studio.schedule.weekdays.3',
  'studio.schedule.weekdays.4',
  'studio.schedule.weekdays.5',
  'studio.schedule.weekdays.6'
] as const;

type ScheduleMiniProps = {
  entries?: ScheduleEntry[];
};

function formatTimeRange(entry: ScheduleEntry): string {
  return `${entry.start}–${entry.end}`;
}

export function ScheduleMini({ entries }: ScheduleMiniProps) {
  const { t } = useTranslation();
  const headingId = useId();

  if (!entries || entries.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3" aria-labelledby={headingId} role="region">
      <div className="flex items-center gap-2">
        <h2 id={headingId} className="text-xl font-semibold text-base-100">
          {t('studio.schedule.title')}
        </h2>
        <span className="rounded-full border border-base-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-base-400">
          {t('studio.schedule.weeklyLabel')}
        </span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-base-800 bg-base-900/70 shadow-lg">
        <table className="min-w-full divide-y divide-base-800 text-sm text-base-200">
          <thead className="bg-base-900/80 text-xs uppercase tracking-wide text-base-400">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">
                {t('studio.schedule.headers.day')}
              </th>
              <th scope="col" className="px-4 py-3 text-left">
                {t('studio.schedule.headers.time')}
              </th>
              <th scope="col" className="px-4 py-3 text-left">
                {t('studio.schedule.headers.note')}
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={`${entry.weekday}-${entry.start}`} className="divide-x divide-base-800/60">
                <th scope="row" className="px-4 py-3 text-left font-medium text-base-100">
                  <abbr title={t(WEEKDAY_KEYS[entry.weekday])} className="no-underline">
                    {t(`studio.schedule.weekdaysShort.${entry.weekday}`)}
                  </abbr>
                </th>
                <td className="px-4 py-3">{formatTimeRange(entry)}</td>
                <td className="px-4 py-3 text-base-300">
                  {entry.noteKey ? t(entry.noteKey) : t('studio.schedule.defaultNote')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
