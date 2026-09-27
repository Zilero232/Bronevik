import type { MyBattle } from '@otmetki/schemas';

export type MoeCellProps = {
  percent: MyBattle['moePercent'];
  delta: MyBattle['moePercentDelta'];
};
