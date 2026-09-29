'use client';

import { useArmorAttack } from '@/features/armor/armor-inspect';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

export const useAttackerPicker = () => {
  const { data: vehicles } = useVehicleCatalog();
  const { attackerSlug, isAttackerError, setAttacker } = useArmorAttack();

  return {
    vehicle: vehicles?.find(({ slug }) => slug === attackerSlug) ?? null,
    isOwn: attackerSlug === null,
    isAttackerError,
    onPick: setAttacker,
    onReset: () => setAttacker(null)
  };
};
