import type { BattleAnalysis } from '@otmetki/schemas';

import type { useBattleAnalysis } from '../../../../../model/hooks';

export type ReferenceCardProps = Pick<BattleAnalysis, 'reference'> & Pick<ReturnType<typeof useBattleAnalysis>, 'efficiency'>;
