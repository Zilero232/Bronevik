import type { QueryKey } from '@tanstack/react-query';

export type StudioToastKey =
  | 'challengeActivated'
  | 'challengeCancelled'
  | 'challengeCreated'
  | 'disconnected'
  | 'overlayRemoved'
  | 'overlaySaved'
  | 'predictionsSaved'
  | 'saved';

export type UseStudioMutationInput<TInput, TOutput> = {
  mutationFn: (input: TInput) => Promise<TOutput>;
  queryKey: QueryKey;
  successKey: StudioToastKey;
};
