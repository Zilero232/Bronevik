import { toRoman } from '@otmetki/icons';

import type { NextTierSelectionInput, SpanBetweenInput, TierRun, TierRunsInput, TierSpan, TierSummaryInput } from './tier-selection.types';

const spanBetween = ({ options, from, to }: SpanBetweenInput): number[] => {
  const low = Math.min(from, to);
  const high = Math.max(from, to);

  return options.filter((option) => option >= low && option <= high);
};

export const tierRuns = ({ options, value }: TierRunsInput): Map<number, TierRun> => {
  const picked = new Set(value);
  const runs = new Map<number, TierRun>();

  options.forEach((option, index) => {
    if (!picked.has(option)) {
      return;
    }

    const hasPrevious = index > 0 && picked.has(options[index - 1]);
    const hasNext = index < options.length - 1 && picked.has(options[index + 1]);

    runs.set(option, hasPrevious ? (hasNext ? 'middle' : 'end') : hasNext ? 'start' : 'single');
  });

  return runs;
};

export const nextTierSelection = ({ options, value, tier, anchor, isRange, mode, isRequired }: NextTierSelectionInput): number[] => {
  const isPicked = value.includes(tier);

  if (mode === 'single') {
    return isPicked && !isRequired ? [] : [tier];
  }

  if (isRange && anchor !== null && anchor !== tier) {
    const span = spanBetween({ options, from: anchor, to: tier });

    return options.filter((option) => value.includes(option) || span.includes(option));
  }

  if (isPicked) {
    return isRequired && value.length === 1 ? [...value] : value.filter((option) => option !== tier);
  }

  return options.filter((option) => option === tier || value.includes(option));
};

export const tierSpans = ({ options, value }: TierSummaryInput): TierSpan[] => {
  const spans: TierSpan[] = [];

  tierRuns({ options, value }).forEach((run, tier) => {
    if (run === 'single') {
      spans.push({ from: tier, to: tier });
    }

    if (run === 'start') {
      spans.push({ from: tier, to: tier });
    }

    if (run === 'end') {
      spans[spans.length - 1].to = tier;
    }
  });

  return spans;
};

export const tierSpanText = ({ options, value }: TierSummaryInput): string =>
  tierSpans({ options, value })
    .map(({ from, to }) => (from === to ? toRoman(from) : `${toRoman(from)}–${toRoman(to)}`))
    .join(', ');
