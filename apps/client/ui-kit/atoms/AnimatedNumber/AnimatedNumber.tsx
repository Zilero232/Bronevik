'use client';

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { useLocale } from 'next-intl';
import { useEffect, useRef } from 'react';

import { EASE_OUT } from '@/shared/lib';

import type { AnimatedNumberProps } from './AnimatedNumber.types';

import s from './AnimatedNumber.module.scss';

const DEFAULT_FORMAT: Intl.NumberFormatOptions = { maximumFractionDigits: 0 };

export const AnimatedNumber = ({ value, from = 0, duration = 1.6, format, prefix, suffix, className }: AnimatedNumberProps) => {
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const isReduced = useReducedMotion();
  const motionValue = useMotionValue(from);

  const formatter = new Intl.NumberFormat(locale, format ?? DEFAULT_FORMAT);
  const display = useTransform(motionValue, (latest) => formatter.format(latest));

  useEffect(() => {
    if (!isInView) {
      return;
    }

    if (isReduced) {
      motionValue.set(value);

      return;
    }

    const controls = animate(motionValue, value, { duration, ease: EASE_OUT });

    return () => controls.stop();
  }, [duration, isInView, isReduced, motionValue, value]);

  return (
    <span ref={ref} className={className}>
      <span className={s.srOnly}>{`${prefix ?? ''}${formatter.format(value)}${suffix ?? ''}`}</span>
      <span aria-hidden className={s.value}>
        {prefix}
        <motion.span>{display}</motion.span>
        {suffix}
      </span>
    </span>
  );
};
