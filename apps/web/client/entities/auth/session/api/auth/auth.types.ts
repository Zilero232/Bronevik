import type { SessionExtras } from '@otmetki/schemas';

import type { authClient } from '@/shared/api/auth';

export type AuthUser = (typeof authClient.$Infer.Session)['user'];

export type AuthSession = (Pick<SessionExtras, 'lestaAccountId'> & { user: AuthUser }) | null;

export type DeleteAccountOutcome = 'deleted' | 'reauthenticate';
