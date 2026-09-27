import { z } from 'zod';

import type { OwnedProvince } from './clan-provinces.types';

import { clanProvinceSchema } from '../../../../../lib/lesta';

const payloadSchema = z.array(clanProvinceSchema).nullable();

export const ownedProvinces = (value: unknown): OwnedProvince[] | null => {
  const parsed = payloadSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  return (parsed.data ?? []).map((province) => ({
    provinceId: province.province_id,
    frontId: province.front_id,
    name: province.province_name,
    arenaId: province.arena_id ?? null,
    primeTime: province.prime_time ?? null,
    dailyRevenue: province.daily_revenue ?? null
  }));
};
