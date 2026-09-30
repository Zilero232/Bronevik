import type { EquipmentItem } from '../../model/schemas';
import type { LoadoutEntry } from './loadout-view.types';

import { BATTLE_LOADOUT } from '../../config';

const isDirective = (item: EquipmentItem): boolean => item.overlay?.includes(BATTLE_LOADOUT.directiveOverlay) ?? false;

export const loadoutEntries = (items: EquipmentItem[]): LoadoutEntry[] =>
  items.flatMap((item, index) => {
    const slot: LoadoutEntry = { kind: 'slot', key: `${String(index)}-${item.name}`, index, item };
    const previous = items[index - 1];
    const startsDirectives = previous !== undefined && isDirective(item) && !isDirective(previous);

    return startsDirectives ? [{ kind: 'divider', key: `divider-${String(index)}` }, slot] : [slot];
  });
