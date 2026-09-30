import { ROUTES } from '@/shared/constants';

import type { TrayChipData, TrayChipsInput } from './tray-chips.types';

export const trayChips = ({ selection, kind }: TrayChipsInput): TrayChipData[] =>
  kind === 'tank'
    ? selection.tank.map(({ tankId, name, shortName, slug, nation, type, tier, isPremium, images }) => ({
        id: tankId,
        name: shortName || name,
        href: ROUTES.tanks.detail(slug),
        tank: { name: shortName || name, nation, type, tier, isPremium, images }
      }))
    : selection.player.map(({ accountId, nickname }) => ({ id: accountId, name: nickname, href: ROUTES.players.profile(nickname), tank: null }));
