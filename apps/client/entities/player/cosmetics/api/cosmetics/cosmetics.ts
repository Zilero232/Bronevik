import type { CosmeticsInventory, ProfileCosmetics } from '@otmetki/schemas';
import { cosmeticsControllerInventory, cosmeticsControllerProfile, cosmeticsControllerProfiles } from '@/shared/api/generated';
import { listParam, SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getCosmetics = (): Promise<CosmeticsInventory> => fromSdk(() => cosmeticsControllerInventory(SESSION_REQUEST));

export const getProfileCosmetics = (accountId: number): Promise<ProfileCosmetics> =>
  fromSdk(() => cosmeticsControllerProfile({ path: { id: accountId } }));

export const getProfilesCosmetics = async (accountIds: readonly number[]): Promise<ProfileCosmetics[]> =>
  (await fromSdk(() => cosmeticsControllerProfiles({ query: { accountIds: listParam(accountIds) ?? [] } }))).items;
