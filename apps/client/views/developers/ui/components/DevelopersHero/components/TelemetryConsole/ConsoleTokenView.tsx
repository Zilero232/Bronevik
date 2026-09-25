'use client';

import { ratingTone } from '@/shared/lib';
import { AnimatedNumber } from '@/ui-kit';

import type { ConsoleTokenViewProps } from './TelemetryConsole.types';

import s from './TelemetryConsole.module.scss';

const PLAIN_NUMBER = { useGrouping: false, maximumFractionDigits: 0 } as const;

export const ConsoleTokenView = ({ token, isVisible }: ConsoleTokenViewProps) => {
  if (token.kind !== 'wn8') {
    return <span className={s[token.kind]}>{token.text}</span>;
  }

  const value = Number(token.text);

  return (
    <span className={s.wn8} data-tone={ratingTone({ scale: 'wn8', value })}>
      {isVisible ? <AnimatedNumber duration={1.2} format={PLAIN_NUMBER} value={value} /> : token.text}
    </span>
  );
};
