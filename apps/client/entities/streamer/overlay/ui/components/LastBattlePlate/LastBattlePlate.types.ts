import type { OverlayData } from '@/shared/api/streamers';

export type LastBattlePlateProps = {
  battle: NonNullable<NonNullable<OverlayData['session']>['lastBattle']>;
  animate: boolean;
  showTank: boolean;
};
