import type { sessionQueries } from '../../../api';

export type UseLinkedAccountsInput = Pick<ReturnType<typeof sessionQueries.linkedAccounts>, 'enabled'>;
