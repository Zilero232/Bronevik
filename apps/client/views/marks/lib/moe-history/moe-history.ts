import type { MoeHistory } from '@otmetki/schemas';

import type { MoeHistorySeries } from './moe-history.types';

export const historySeries = (history: MoeHistory): MoeHistorySeries => ({
  dates: history.map(({ date }) => date),
  p65: history.map(({ p65 }) => p65),
  p85: history.map(({ p85 }) => p85),
  p95: history.map(({ p95 }) => p95),
  p100: history.flatMap(({ p100 }) => (p100 === null ? [] : [p100]))
});
