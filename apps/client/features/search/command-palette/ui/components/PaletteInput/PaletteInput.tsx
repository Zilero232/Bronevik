import { AnimatedCrosshair, CrosshairIcon } from '@bronevik/icons';
import { Command } from 'cmdk';
import { useTranslations } from 'next-intl';

import { Kbd } from '@/ui-kit';

import type { PaletteInputProps } from './PaletteInput.types';

import s from './PaletteInput.module.scss';

export const PaletteInput = ({ value, isFetching, onValueChange }: PaletteInputProps) => {
  const t = useTranslations('search');

  return (
    <div className={s.root}>
      <span aria-hidden className={s.icon} data-busy={isFetching}>
        {isFetching ? <AnimatedCrosshair size={22} /> : <CrosshairIcon size={22} />}
      </span>
      <Command.Input className={s.input} placeholder={t('placeholder')} value={value} onValueChange={onValueChange} />
      <Kbd>Esc</Kbd>
    </div>
  );
};
