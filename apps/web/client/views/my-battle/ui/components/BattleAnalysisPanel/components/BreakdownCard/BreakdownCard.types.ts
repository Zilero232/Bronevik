import type { useBattleAnalysis } from '../../../../../model/hooks';

export type BreakdownCardProps = Pick<ReturnType<typeof useBattleAnalysis>, 'breakdown'>;
