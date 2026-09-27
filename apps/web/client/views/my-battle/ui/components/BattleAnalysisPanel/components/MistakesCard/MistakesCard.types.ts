import type { useBattleAnalysis } from '../../../../../model/hooks';

export type MistakesCardProps = Pick<ReturnType<typeof useBattleAnalysis>, 'mistakes'>;
