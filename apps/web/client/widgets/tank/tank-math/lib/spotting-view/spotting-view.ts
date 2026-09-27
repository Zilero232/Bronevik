import { camouflageFactor, effectiveViewRange, spottingDuel } from '@otmetki/gamedata';

import type { SpottingParty, SpottingPartyView, SpottingView, SpottingViewInput } from './spotting-view.types';

const partyView = ({ config, camoSkillRate, values }: SpottingParty): SpottingPartyView => ({
  viewRange: effectiveViewRange({ viewRange: config.vision.viewRange, state: values }),
  camouflage: camouflageFactor({ camouflage: config.camouflage, state: { ...values, camoSkillRate } })
});

export const spottingView = ({ mine, theirs }: SpottingViewInput): SpottingView => {
  const me = partyView(mine);
  const them = partyView(theirs);

  return { duel: spottingDuel({ mine: me, theirs: them }), mine: me, theirs: them };
};
