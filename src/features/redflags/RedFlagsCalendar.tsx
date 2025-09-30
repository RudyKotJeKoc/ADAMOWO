import { useMemo, useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { useRedFlagsStore } from './redflags.store';

const WEEK_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const addDays = (date: Date, amount: number) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
};

const toKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function RedFlagsCalendar(): JSX.Element {
  const { t, i18n } = useTranslation();
  const entries = useRedFlagsStore((state) => state.entries);
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [focusedDate, setFocusedDate] = useState<Date>(today);

  const entriesByDate = useMemo(() => {
    return entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.date] = (acc[entry.date] ?? 0) + 1;
      return acc;
    }, {});
  }, [entries]);

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const startWeekDay = (firstDayOfMonth.getDay() + 6) % 7; // 0=Monday
  const firstVisibleDate = addDays(firstDayOfMonth, -startWeekDay);
  const days = Array.from({ length: 42 }, (_, index) => addDays(firstVisibleDate, index));

  const isToday = (date: Date) => toKey(date) === toKey(today);
  const monthLabel = new Intl.DateTimeFormat(i18n.language, {
    month: 'long',
    year: 'numeric'
  }).format(currentMonth);

  const handleArrowNavigation = (date: Date, key: string) => {
    const map: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowUp: -7,
      ArrowDown: 7
    };
    const delta = map[key];
    if (!delta) return;
    const nextDate = addDays(date, delta);
    setFocusedDate(nextDate);
    setCurrentMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
  };

  return (
    <section
      aria-labelledby="redflags-calendar-title"
      className="space-y-4 rounded-xl border border-base-800 bg-base-900/70 p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 id="redflags-calendar-title" className="text-lg font-semibold text-base-50">
            {t('rf.calendar.title')}
          </h3>
          <p className="text-sm text-base-200">{t('rf.calendar.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setCurrentMonth(
                (value) => new Date(value.getFullYear(), value.getMonth() - 1, 1)
              )
            }
            className="rounded-md border border-base-700 px-3 py-2 text-sm text-base-100 hover:bg-base-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
            aria-label={t('rf.calendar.prevMonth') ?? 'Previous month'}
          >
            {t('rf.calendar.prevShort')}
          </button>
          <p className="min-w-[8rem] text-center text-sm font-semibold text-base-100" aria-live="polite">
            {monthLabel}
          </p>
          <button
            type="button"
            onClick={() =>
              setCurrentMonth(
                (value) => new Date(value.getFullYear(), value.getMonth() + 1, 1)
              )
            }
            className="rounded-md border border-base-700 px-3 py-2 text-sm text-base-100 hover:bg-base-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
            aria-label={t('rf.calendar.nextMonth') ?? 'Next month'}
          >
            {t('rf.calendar.nextShort')}
          </button>
        </div>
      </div>
      <div role="grid" aria-label={t('rf.calendar.ariaLabel')} className="grid grid-cols-7 gap-2 text-sm">
        {WEEK_DAYS.map((dayKey) => (
          <div
            key={dayKey}
            role="columnheader"
            className="text-center text-xs font-semibold uppercase tracking-wide text-base-300"
            aria-label={t(`rf.calendar.week.${dayKey}`)}
          >
            {t(`rf.calendar.week.${dayKey}Short`)}
          </div>
        ))}
        {days.map((date) => {
          const key = toKey(date);
          const inCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const count = entriesByDate[key] ?? 0;
          const isFocused = toKey(focusedDate) === key;
          return (
            <button
              key={key}
              role="gridcell"
              type="button"
              tabIndex={isFocused ? 0 : -1}
              onFocus={() => setFocusedDate(date)}
              onKeyDown={(event) => handleArrowNavigation(date, event.key)}
              onClick={() => setFocusedDate(date)}
              className={`flex h-20 flex-col items-start justify-between rounded-lg border p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950 ${
                inCurrentMonth ? 'border-base-800 bg-base-900/60 text-base-100' : 'border-base-900 bg-base-900/30 text-base-500'
              } ${count > 0 ? 'shadow-[0_0_0_1px_rgba(255,107,53,0.4)]' : ''}`}
              aria-selected={isFocused}
              aria-current={isToday(date) ? 'date' : undefined}
              aria-label={t('rf.calendar.dayAria', {
                date: new Intl.DateTimeFormat(i18n.language, {
                  dateStyle: 'full'
                }).format(date),
                count
              })}
            >
              <span className="text-sm font-semibold">{date.getDate()}</span>
              {count > 0 ? (
                <span className="rounded-full bg-accent-500/20 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-accent-300">
                  {t('rf.calendar.count', { count })}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
