import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { AnswerValue, Question } from './guide.schema';

type Props = {
  moduleId: string;
  question: Question;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
};

export const SinQuestion = ({ moduleId, question, value, onChange }: Props): JSX.Element => {
  const { t } = useTranslation();
  const elementId = `${moduleId}-${question.id}`;
  const helpId = question.helpKey ? `${elementId}-help` : undefined;

  const renderYesNo = () => {
    const currentValue = typeof value === 'boolean' ? value : undefined;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value === 'yes');
    };

    return (
      <div role="radiogroup" aria-labelledby={`${elementId}-label`} aria-describedby={helpId}>
        {['yes', 'no'].map((option) => (
          <label
            key={option}
            htmlFor={`${elementId}-${option}`}
            className="mr-4 inline-flex items-center gap-2 rounded-lg border border-base-600 bg-base-900/40 px-3 py-2 text-sm text-base-100 focus-within:ring-2 focus-within:ring-accent-400"
          >
            <input
              id={`${elementId}-${option}`}
              type="radio"
              name={`${elementId}-yn`}
              value={option}
              checked={option === 'yes' ? currentValue === true : currentValue === false}
              onChange={handleChange}
              className="h-4 w-4 accent-accent-400"
            />
            <span>{t(`guide.answer.${option}`)}</span>
          </label>
        ))}
      </div>
    );
  };

  const renderScale = () => {
    const currentValue = typeof value === 'number' ? value : undefined;
    const scaleMax = question.scaleMax ?? 5;
    const scaleValues = Array.from({ length: scaleMax }, (_, index) => index + 1);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.target.value));
    };

    return (
      <div
        role="radiogroup"
        aria-labelledby={`${elementId}-label`}
        aria-describedby={helpId}
        className="flex flex-wrap items-center gap-2"
      >
        {scaleValues.map((scaleValue) => (
          <label
            key={scaleValue}
            htmlFor={`${elementId}-scale-${scaleValue}`}
            className="inline-flex min-w-[2.5rem] cursor-pointer flex-col items-center gap-1 rounded-lg border border-base-600 bg-base-900/40 px-3 py-2 text-xs text-base-100 focus-within:ring-2 focus-within:ring-accent-400"
          >
            <input
              id={`${elementId}-scale-${scaleValue}`}
              type="radio"
              name={`${elementId}-scale`}
              value={scaleValue}
              checked={currentValue === scaleValue}
              onChange={handleChange}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                currentValue === scaleValue
                  ? 'border-accent-300 bg-accent-500 text-base-900'
                  : 'border-base-600 bg-base-800 text-base-100'
              }`}
            >
              {scaleValue}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wide text-base-300">
              {scaleValue === 1 ? t('guide.scale.never') : scaleValue === scaleMax ? t('guide.scale.always') : t('guide.scale.sometimes')}
            </span>
          </label>
        ))}
      </div>
    );
  };

  const renderMulti = () => {
    const selectedOptions = Array.isArray(value) ? value : [];

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const optionKey = event.target.value;
      const isChecked = event.target.checked;

      if (isChecked) {
        onChange([...new Set([...selectedOptions, optionKey])]);
      } else {
        onChange(selectedOptions.filter((item) => item !== optionKey));
      }
    };

    return (
      <div aria-labelledby={`${elementId}-label`} aria-describedby={helpId}>
        {question.options?.map((option) => (
          <label
            key={option.key}
            htmlFor={`${elementId}-${option.key}`}
            className="mb-2 flex items-start gap-3 rounded-lg border border-base-600 bg-base-900/40 px-3 py-2 text-sm text-base-100 focus-within:ring-2 focus-within:ring-accent-400"
          >
            <input
              id={`${elementId}-${option.key}`}
              type="checkbox"
              name={`${elementId}-multi`}
              value={option.key}
              checked={selectedOptions.includes(option.key)}
              onChange={handleChange}
              className="mt-1 h-4 w-4 accent-accent-400"
            />
            <span>{t(option.key)}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-base-700 bg-base-900/60 p-4 shadow-sm">
      <h3 id={`${elementId}-label`} className="text-base font-semibold text-base-50">
        {t(question.textKey)}
      </h3>
      {question.helpKey ? (
        <p id={helpId} className="mt-2 text-sm text-base-300">
          {t(question.helpKey)}
        </p>
      ) : null}
      <div className="mt-3 flex flex-col gap-3">
        {question.type === 'yn' && renderYesNo()}
        {question.type === 'scale' && renderScale()}
        {question.type === 'multi' && renderMulti()}
      </div>
    </div>
  );
};
