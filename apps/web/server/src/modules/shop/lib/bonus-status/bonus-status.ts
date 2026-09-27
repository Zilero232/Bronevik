import type { BonusCodeStatus } from '../../../../../generated';
import type { BonusStatusInput } from './bonus-status.types';

import { BONUS_CODE } from '../../config';

export const bonusCodeStatus = ({ working, expired, expiresAt, now }: BonusStatusInput): BonusCodeStatus => {
  if (expiresAt && expiresAt.getTime() <= now.getTime()) {
    return 'expired';
  }

  const total = working + expired;

  if (total < BONUS_CODE.minReports) {
    return 'unknown';
  }

  if (expired / total >= BONUS_CODE.verdictShare) {
    return 'expired';
  }

  return working / total >= BONUS_CODE.verdictShare ? 'working' : 'unknown';
};
