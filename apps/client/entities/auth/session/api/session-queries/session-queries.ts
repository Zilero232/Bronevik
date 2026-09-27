import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getLinkedAccounts } from '../me';

export const sessionQueries = {
  linkedAccounts: () => queryOptions({ queryKey: QUERY_KEYS.me.section('accounts'), queryFn: getLinkedAccounts })
};
