'use client';

import { ShellApIcon, ShellHeatIcon, ShellHeIcon } from '@bronevik/icons';
import { useTranslations } from 'next-intl';

import { NumberField } from '@/ui-kit';

import type { EconomyShellsProps } from '../../EconomyCalculator.types';

import { ECONOMY, SHELL_KINDS } from '../../../../../config';

import s from './EconomyShells.module.scss';

const SHELL_ICONS = { ap: ShellApIcon, heat: ShellHeatIcon, he: ShellHeIcon } as const;

export const EconomyShells = ({ values, onChange }: EconomyShellsProps) => {
  const t = useTranslations('tools.economy');

  return (
    <fieldset className={s.root}>
      <legend className={s.legend}>{t('shells')}</legend>
      {SHELL_KINDS.map((kind) => {
        const Icon = SHELL_ICONS[kind];

        return (
          <div key={kind} className={s.row}>
            <span className={s.kind}>
              <Icon aria-hidden size={20} />
              {t(`shellKinds.${kind}`)}
            </span>
            <NumberField
              {...ECONOMY.shellRange}
              label={t('shellCount')}
              value={values[kind]}
              onValueChange={(value) => onChange({ key: kind, value })}
            />
            <NumberField
              {...ECONOMY.priceRange}
              label={t('shellPrice')}
              value={values[`${kind}Price`]}
              onValueChange={(value) => onChange({ key: `${kind}Price`, value })}
            />
          </div>
        );
      })}
    </fieldset>
  );
};
