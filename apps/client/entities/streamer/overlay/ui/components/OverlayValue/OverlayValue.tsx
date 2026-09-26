'use client';

import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { useLocale } from 'next-intl';

import { AnimatedNumber } from '@/ui-kit';

import type { OverlayValueProps } from './OverlayValue.types';

import { OVERLAY_BOARD } from '../../../config';
import { formatOverlayValue, OVERLAY_VALUE } from '../../../lib/overlay-metric';

import s from './OverlayValue.module.scss';

export const OverlayValue = ({ value, kind, animate, className }: OverlayValueProps) => {
  const locale = useLocale();

  return (
    <span className={clsx(s.root, className)}>
      {animate && value !== null ? (
        <>
          <motion.span
            aria-hidden
            key={value}
            animate={{ opacity: 0, scale: 1.25 }}
            className={s.flash}
            initial={{ opacity: 0.55, scale: 1 }}
            transition={{ duration: OVERLAY_BOARD.flashSeconds }}
          />
          <AnimatedNumber format={OVERLAY_VALUE.format[kind]} suffix={OVERLAY_VALUE.suffix[kind]} value={value} />
        </>
      ) : (
        formatOverlayValue({ value, kind, locale })
      )}
    </span>
  );
};
