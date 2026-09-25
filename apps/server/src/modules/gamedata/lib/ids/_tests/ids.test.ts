import { NATIONS } from '@bronevik/gamedata';
import { describe, expect, it } from 'vitest';

import type { ItemType } from '../ids.types';

import { fieldModificationIdOf, makeCompactDescr, nationId, parseCompactDescr, provisionIdOf, tankIdOf } from '../ids';
import { ITEM_TYPE, NATION_NONE } from '../ids.constants';

describe('compact descriptors', () => {
  it('round-trips every item type and nation', () => {
    for (const itemType of Object.keys(ITEM_TYPE).filter((key): key is ItemType => key in ITEM_TYPE)) {
      for (const nation of NATIONS) {
        const descr = makeCompactDescr({ itemType, nationId: nationId(nation), id: 321 });

        expect(parseCompactDescr(descr)).toEqual({ itemType, nationId: nationId(nation), id: 321 });
      }
    }
  });

  it('matches the Lesta API tank_id layout', () => {
    expect(tankIdOf({ nation: 'ussr', id: 2 })).toBe(2 * 256 + ITEM_TYPE.vehicle);
    expect(tankIdOf({ nation: 'germany', id: 2 })).toBe(2 * 256 + 16 + ITEM_TYPE.vehicle);
  });

  it('keeps provisions and field modifications in disjoint id spaces', () => {
    const device = parseCompactDescr(provisionIdOf({ itemType: 'optionalDevice', id: 7 }));
    const modification = parseCompactDescr(fieldModificationIdOf(7));

    expect(device.nationId).toBe(NATION_NONE);
    expect(device.itemType).toBe('optionalDevice');
    expect(modification.itemType).toBe('reserved');
    expect(provisionIdOf({ itemType: 'optionalDevice', id: 7 })).not.toBe(fieldModificationIdOf(7));
  });
});
