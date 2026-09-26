import type { SpottingDuel } from '@otmetki/gamedata';

import type { TankMath, TankMathConfig } from '../../api';
import type { SpottingSideValues } from '../spotting-form';

export type SpottingParty = {
  config: Pick<TankMathConfig, 'camouflage' | 'vision'>;
  camoSkillRate: TankMath['camoSkillRate'];
  values: SpottingSideValues;
};

export type SpottingPartyView = {
  viewRange: number;
  camouflage: number;
};

export type SpottingViewInput = {
  mine: SpottingParty;
  theirs: SpottingParty;
};

export type SpottingView = {
  duel: SpottingDuel;
  mine: SpottingPartyView;
  theirs: SpottingPartyView;
};
