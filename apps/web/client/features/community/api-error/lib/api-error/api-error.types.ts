import type { ApiErrorCode } from '@otmetki/schemas';

import type { MessageKey } from '@/shared/api/query-client';
import type { Messages } from '@/shared/i18n';

export type CommunityErrorKind = 'conflict' | 'forbidden' | 'notFound' | 'rateLimited' | 'unauthorized' | 'unknown' | 'validation';

export type CommunityErrorCodeMap = Partial<Record<ApiErrorCode, CommunityErrorKind>>;

export type CommunityErrorNamespace = {
  [Namespace in keyof Messages & string]: `${Namespace}.errors.${CommunityErrorKind}` extends MessageKey ? Namespace : never;
}[keyof Messages & string];
