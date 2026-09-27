import type { QueryKey } from '@tanstack/react-query';

export type DeveloperToastKey = 'keyCreated' | 'keyRevoked' | 'webhookCreated' | 'webhookDeleted' | 'webhookUpdated';

export type UseDeveloperMutationInput<TInput, TOutput> = {
  mutationFn: (input: TInput) => Promise<TOutput>;
  invalidates: readonly QueryKey[];
  successKey?: DeveloperToastKey;
  isErrorToasted?: boolean;
};
