import { COMMUNITY_ACCOUNT } from '../../config';

export const chosenAccountId = (value: string): number | undefined => {
  if (value === COMMUNITY_ACCOUNT.primary || value.trim() === '') {
    return undefined;
  }

  const accountId = Number(value);

  return Number.isInteger(accountId) && accountId > 0 ? accountId : undefined;
};
