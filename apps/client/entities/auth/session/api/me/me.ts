import type { LinkedAccounts } from '@otmetki/schemas';
import { meControllerLinkedAccounts } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getLinkedAccounts = (): Promise<LinkedAccounts> => fromSdk(() => meControllerLinkedAccounts(SESSION_REQUEST));
