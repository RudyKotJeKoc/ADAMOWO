import { FormEvent, type JSX } from 'react';
import { useTranslation } from 'react-i18next';

export type UserInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onReset: () => void;
  disabled?: boolean;
};

export function UserInput({ value, onChange, onSubmit, onReset, disabled }: UserInputProps): JSX.Element {
  const { t } = useTranslation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit} aria-label={t('sim.input.label')}>
      <label htmlFor="simulator-input" className="sr-only">
        {t('sim.input.placeholder')}
      </label>
      <textarea
        id="simulator-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('sim.input.placeholder') ?? ''}
        className="h-24 w-full resize-y rounded-md border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
        aria-label={t('sim.input.placeholder') ?? ''}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-base-950 transition-colors hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t('sim.send')}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-md border border-base-700 px-4 py-2 text-sm font-semibold text-base-100 transition-colors hover:bg-base-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
        >
          {t('sim.reset')}
        </button>
      </div>
    </form>
  );
}
