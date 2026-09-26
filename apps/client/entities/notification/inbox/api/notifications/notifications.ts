import type { InboxPage, MarkReadInput, MarkReadResult } from '@otmetki/schemas';

import { notificationsControllerList, notificationsControllerMarkRead } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { InboxPageInput } from './notifications.types';

export const getInbox = ({ limit, before, signal }: InboxPageInput = {}): Promise<InboxPage> =>
  fromSdk(() => notificationsControllerList({ ...SESSION_REQUEST, query: { limit, before }, signal }));

export const markInboxRead = (input: MarkReadInput = {}): Promise<MarkReadResult> =>
  fromSdk(() => notificationsControllerMarkRead({ ...SESSION_REQUEST, body: input }));
