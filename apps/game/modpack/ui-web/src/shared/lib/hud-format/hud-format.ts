import type { FormatPercentInput, PercentSignInput } from './hud-format.types';

import { HUD_FORMAT } from './hud-format.constants';

const groups = (digits: string): string => digits.replace(/\B(?=(\d{3})+(?!\d))/g, HUD_FORMAT.thinSpace);

export const formatNumber = (value: number): string => {
  const whole = Math.round(Math.abs(value));
  const sign = value < 0 && whole > 0 ? HUD_FORMAT.minus : '';

  if (whole >= HUD_FORMAT.kiloFrom) {
    return `${sign}${groups(String(Math.round(whole / 1000)))}${HUD_FORMAT.thinSpace}${HUD_FORMAT.kiloSuffix}`;
  }

  return `${sign}${groups(String(whole))}`;
};

export const formatSigned = (value: number): string => (value > 0 ? `${HUD_FORMAT.plus}${formatNumber(value)}` : formatNumber(value));

const percentSign = ({ value, rounded, signed }: PercentSignInput): string => {
  if (rounded === 0) {
    return '';
  }

  if (value < 0) {
    return HUD_FORMAT.minus;
  }

  return signed ? HUD_FORMAT.plus : '';
};

export const formatPercent = ({ value, digits, signed = false }: FormatPercentInput): string => {
  const fixed = Math.abs(value).toFixed(digits).replace('.', HUD_FORMAT.decimalComma);
  const rounded = Number(Math.abs(value).toFixed(digits));
  const sign = percentSign({ value, rounded, signed });

  return `${sign}${fixed}${HUD_FORMAT.thinSpace}%`;
};

export const formatSeconds = (seconds: number): string => {
  const whole = Math.max(0, Math.ceil(seconds));

  if (whole < HUD_FORMAT.secondsPerMinute) {
    return String(whole);
  }

  const minutes = Math.floor(whole / HUD_FORMAT.secondsPerMinute);
  const rest = whole % HUD_FORMAT.secondsPerMinute;

  return `${minutes}:${String(rest).padStart(2, '0')}`;
};

export const formatReload = (seconds: number): string => Math.max(0, seconds).toFixed(1);
