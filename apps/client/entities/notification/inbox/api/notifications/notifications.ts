import type { InboxPage, MarkReadInput, MarkReadResult } from '@otmetki/schemas';
import type { InboxPageInput } from './notifications.types';
import { notificationsControllerList, notificationsControllerMarkRead } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getInbox = ({ limit, before, signal }: InboxPageInput = {}): Promise<InboxPage> =>
  fromSdk(() => notificationsControllerList({ ...SESSION_REQUEST, query: { limit, before }, signal }));

export const markInboxRead = (input: MarkReadInput = {}): Promise<MarkReadResult> =>
  fromSdk(() => notificationsControllerMarkRead({ ...SESSION_REQUEST, body: input }));
