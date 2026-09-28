import type { QueryKey } from '@tanstack/react-query';
import type { MessageKeys, Messages, NestedKeyOf } from 'next-intl';

export type MessageKey = MessageKeys<Messages, NestedKeyOf<Messages>>;

export type MutationFeedbackMeta = {
  successKey?: MessageKey;
  errorKey?: ((error: Error) => MessageKey) | MessageKey;
  invalidates?: readonly QueryKey[];
};
