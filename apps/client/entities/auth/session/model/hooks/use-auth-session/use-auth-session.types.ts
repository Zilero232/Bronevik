import type { UseQueryResult } from '@tanstack/react-query';

import type { AuthSession } from '../../../api';

export type AuthSessionQuery = Pick<UseQueryResult<AuthSession>, 'data' | 'error' | 'isFetching' | 'isPending' | 'refetch'>;
