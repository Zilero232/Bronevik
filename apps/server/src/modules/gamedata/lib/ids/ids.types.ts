import type { Nation } from '@otmetki/gamedata';

import type { ITEM_TYPE } from './ids.constants';

export type ItemType = keyof typeof ITEM_TYPE;

export type MakeCompactDescrInput = {
  itemType: ItemType;
  nationId: number;
  id: number;
};

export type CompactDescr = {
  itemType: ItemType;
  nationId: number;
  id: number;
};

export type TankIdInput = {
  nation: Nation;
  id: number;
};

export type ProvisionIdInput = {
  itemType: 'equipment' | 'optionalDevice';
  id: number;
};
