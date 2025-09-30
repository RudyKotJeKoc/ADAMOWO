import { FormEvent, useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { useRedFlagsStore } from './redflags.store';
import type { RedFlagCategory } from './redflags.schema';

const MAX_NOTE = 500;

const categories: RedFlagCategory[] = [
  'gaslighting',
  'financial_abuse',
  'stalking',
  'legal_weaponization',
  'emotional_blackmail',
  'devaluation',
  'discard',
  'hoovering'
];

export function RedFlagForm(): JSX.Element {
  const { t } = useTranslation();
  const addEntry = useRedFlagsStore((state) => state.addEntry);
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<RedFlagCategory>('gaslighting');
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');

    if (!date) {
      setError(t('rf.form.dateError'));
      return;
    }

    if (note.length > MAX_NOTE) {
      setError(t('rf.form.limitError'));
      return;
    }

    const created = addEntry({ date, category, intensity, note: note.trim() || undefined });
    if (!created) {
      setError(t('rf.form.submitError'));
      return;
    }

    setError(null);
    setStatus('success');
    setNote('');
  };

  return (
    <form
      className="space-y-4 rounded-xl border border-base-800 bg-base-900/70 p-6"
      aria-labelledby="redflag-form-title"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between">
        <h3 id="redflag-form-title" className="text-lg font-semibold text-base-50">
          {t('rf.add')}
        </h3>
        {status === 'success' ? (
          <span className="text-sm text-accent-400" role="status">
            {t('rf.form.success')}
          </span>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="redflag-date" className="block text-sm font-medium text-base-100">
            {t('rf.date')}
          </label>
          <input
            id="redflag-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-md border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
            aria-describedby="redflag-note-limit"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="redflag-category" className="block text-sm font-medium text-base-100">
            {t('rf.category')}
          </label>
          <select
            id="redflag-category"
            value={category}
            onChange={(event) => setCategory(event.target.value as RedFlagCategory)}
            className="w-full rounded-md border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
          >
            {categories.map((option) => (
              <option key={option} value={option}>
                {t(`rf.categories.${option}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="redflag-intensity" className="block text-sm font-medium text-base-100">
            {t('rf.intensity')}
          </label>
          <input
            id="redflag-intensity"
            type="range"
            min={1}
            max={5}
            value={intensity}
            onChange={(event) => setIntensity(Number(event.target.value) as 1 | 2 | 3 | 4 | 5)}
            className="w-full"
          />
          <span className="text-xs text-base-300" aria-live="polite">
            {t('rf.form.intensityValue', { value: intensity })}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="redflag-note" className="block text-sm font-medium text-base-100">
          {t('rf.note')}
        </label>
        <textarea
          id="redflag-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={MAX_NOTE}
          className="h-32 w-full resize-y rounded-md border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
          aria-describedby="redflag-note-limit"
        />
        <div className="flex justify-between text-xs text-base-300" aria-live="polite">
          <span id="redflag-note-limit">{t('rf.form.limit', { max: MAX_NOTE })}</span>
          {error ? (
            <span className="text-accent-400" role="alert">
              {error}
            </span>
          ) : null}
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-base-950 transition-colors hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
      >
        {t('rf.form.submit')}
      </button>
    </form>
  );
}
