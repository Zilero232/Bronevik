import type { Competition } from '@otmetki/schemas';

export type CompetitionToastKey = 'joined' | 'left';

export type UseCompetitionMutationInput<TInput> = {
  mutationFn: (input: TInput) => Promise<Competition>;
  successKey: CompetitionToastKey;
};
