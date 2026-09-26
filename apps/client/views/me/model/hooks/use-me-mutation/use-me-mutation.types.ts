import type { MeSection } from '@/shared/constants';

export type MeToastKey = 'deviceRevoked' | 'favoriteRemoved' | 'goalAdded' | 'goalRemoved';

export type UseMeMutationInput<TInput, TOutput> = {
  section: MeSection;
  mutationFn: (input: TInput) => Promise<TOutput>;
  successKey?: MeToastKey;
};
