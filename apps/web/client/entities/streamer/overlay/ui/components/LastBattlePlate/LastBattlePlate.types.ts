import type { OverlayData } from '@otmetki/schemas';

export type LastBattlePlateProps = {
  battle: NonNullable<NonNullable<OverlayData['session']>['lastBattle']>;
  animate: boolean;
  showTank: boolean;
};
