import type { RngBucket } from '@otmetki/schemas';

import { round } from 'remeda';

import { HONEST_RNG_VIEW, RNG_SHELLS } from '../../config';

export const bucketMidpoints = (buckets: readonly Pick<RngBucket, 'from' | 'to'>[]): number[] =>
  buckets.map(({ from, to }) => round(((from + to) / 2) * HONEST_RNG_VIEW.percentScale, HONEST_RNG_VIEW.labelDigits));

export const bucketShares = (buckets: readonly Pick<RngBucket, 'share'>[]): number[] => buckets.map((bucket) => bucket.share ?? 0);

export const rollPercent = (value: number | null | undefined): number | null =>
  value === null || value === undefined ? null : value * HONEST_RNG_VIEW.percentScale;

const SHELL_KEYS: ReadonlySet<string> = new Set(RNG_SHELLS);

const isShellKey = (shell: string): shell is (typeof RNG_SHELLS)[number] => SHELL_KEYS.has(shell);

export const toShellKey = (shell: string): (typeof RNG_SHELLS)[number] => (isShellKey(shell) ? shell : 'unknown');
