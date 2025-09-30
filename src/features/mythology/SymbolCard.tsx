import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import type { MythSymbol } from './mythology.schema';
import { EightIcon } from './icons/EightIcon';
import { FourIcon } from './icons/FourIcon';
import { SevenIcon } from './icons/SevenIcon';
import { ThirteenIcon } from './icons/ThirteenIcon';

type SymbolCardProps = {
  symbol: MythSymbol;
  isActive: boolean;
  onSelect: (symbol: MythSymbol) => void;
};

const ICON_MAP = {
  seven: SevenIcon,
  four: FourIcon,
  eight: EightIcon,
  thirteen: ThirteenIcon
} satisfies Record<MythSymbol['icon'], (props: ComponentProps<'svg'>) => JSX.Element>;

export function SymbolCard({ symbol, isActive, onSelect }: SymbolCardProps): JSX.Element {
  const { t } = useTranslation();
  const Icon = ICON_MAP[symbol.icon];

  return (
    <button
      type="button"
      onClick={() => onSelect(symbol)}
      className={clsx(
        'relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl border p-6 text-left transition',
        'focus-visible:shadow-focus focus-visible:outline-none',
        isActive
          ? 'border-accent-400/80 bg-base-925'
          : 'border-base-850/80 bg-base-950/60 hover:border-accent-500/50'
      )}
      aria-pressed={isActive}
      aria-label={`${t(symbol.titleKey)} — ${t('mythology.viewSymbol')}`}
    >
      <motion.span
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-500/15 via-transparent to-accent-500/5"
        animate={{ opacity: isActive ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-base-900/90 shadow-[0_0_22px_rgba(255,107,53,0.35)]">
          <Icon className="h-10 w-10" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.4em] text-accent-200">{t('mythology.symbolCode', { code: symbol.id })}</p>
          <h3 className="font-display text-xl font-semibold text-base-50">{t(symbol.titleKey)}</h3>
          <p className="text-sm text-base-200">{t(symbol.subtitleKey)}</p>
        </div>
      </div>
    </button>
  );
}
