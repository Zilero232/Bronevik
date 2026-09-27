import type { CosmeticsInventory, EquipCosmeticsInput } from '@otmetki/schemas';

import { cosmeticsControllerEquip, cosmeticsControllerPurchase } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const purchaseCosmetic = (code: string): Promise<CosmeticsInventory> =>
  fromSdk(() => cosmeticsControllerPurchase({ ...SESSION_REQUEST, path: { code } }));

export const equipCosmetics = (input: EquipCosmeticsInput): Promise<CosmeticsInventory> =>
  fromSdk(() => cosmeticsControllerEquip({ ...SESSION_REQUEST, body: input }));
