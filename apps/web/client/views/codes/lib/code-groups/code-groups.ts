import type { BonusCode } from '@otmetki/schemas';

import { partition, sortBy } from 'remeda';

import type { CodeGroups } from './code-groups.types';

export const codeGroups = (codes: readonly BonusCode[]): CodeGroups => {
  const [expired, active] = partition(codes, (code) => code.status === 'expired');

  return {
    active: sortBy(active, [(code) => code.status === 'working', 'desc'], [(code) => code.discoveredAt, 'desc']),
    expired: sortBy(expired, [(code) => code.discoveredAt, 'desc'])
  };
};
