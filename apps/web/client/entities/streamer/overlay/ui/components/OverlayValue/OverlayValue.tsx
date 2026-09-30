'use client';

import { clsx } from 'clsx';
import * as m from 'motion/react-m';
import { useLocale } from 'next-intl';

import { AnimatedNumber } from '@/ui-kit';

import type { OverlayValueProps } from './OverlayValue.types';

import { formatOverlayValue, OVERLAY_VALUE } from '../../../lib/overlay-metric';
import { OVERLAY_FLASH } from './OverlayValue.motion';

import s from './OverlayValue.module.scss';

export const OverlayValue = ({ value, kind, animate, className }: OverlayValueProps) => {
  const locale = useLocale();

  return (
    <span className={clsx(s.root, className)}>
      {animate && value !== null ? (
        <>
          <m.span aria-hidden key={value} {...OVERLAY_FLASH} className={s.flash} />
          <AnimatedNumber format={OVERLAY_VALUE.format[kind]} suffix={OVERLAY_VALUE.suffix[kind]} value={value} />
        </>
      ) : (
        formatOverlayValue({ value, kind, locale })
      )}
    </span>
  );
};
