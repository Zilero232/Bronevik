import type { PlayerWrapped } from '@/entities/player/profile';

import type { WrappedChapter } from '../../../lib/wrapped-story';
import type { usePlayerWrapped } from '../../../model/hooks';

export type WrappedChaptersProps = Pick<ReturnType<typeof usePlayerWrapped>, 'bestVehicle' | 'topTanks'> & {
  wrapped: PlayerWrapped;
  chapters: readonly WrappedChapter[];
};
