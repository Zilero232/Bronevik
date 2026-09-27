import type { BattleAnalysis } from '@otmetki/schemas';

import type { useBattleAnalysis } from '../../../../../model/hooks';

export type AccuracyCardProps = Pick<BattleAnalysis, 'accuracy'> & Pick<ReturnType<typeof useBattleAnalysis>, 'rolls'>;
