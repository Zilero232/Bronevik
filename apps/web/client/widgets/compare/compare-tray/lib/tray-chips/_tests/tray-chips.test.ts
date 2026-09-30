import { describe, expect, it } from 'vitest';

import { NO_COMPARE_SELECTION } from '@/features/compare/compare-selection';
import { ROUTES } from '@/shared/constants';

import { trayChips } from '../tray-chips';

const SELECTION = {
  ...NO_COMPARE_SELECTION,
  tank: [
    {
      tankId: 1,
      name: 'Object 140',
      shortName: '',
      slug: 'object-140',
      nation: 'ussr',
      type: 'mediumTank' as const,
      tier: 10,
      isPremium: false,
      images: { small: null, contour: null, big: null }
    }
  ],
  player: [{ accountId: 9, nickname: 'Nine' }]
};

describe('trayChips', () => {
  it('turns the active kind into links, falling back to the full tank name', () => {
    expect(trayChips({ selection: SELECTION, kind: 'tank' })).toEqual([
      expect.objectContaining({ id: 1, name: 'Object 140', href: ROUTES.tanks.detail('object-140') })
    ]);

    expect(trayChips({ selection: SELECTION, kind: 'player' })).toEqual([{ id: 9, name: 'Nine', href: ROUTES.players.profile('Nine'), tank: null }]);
  });
});
