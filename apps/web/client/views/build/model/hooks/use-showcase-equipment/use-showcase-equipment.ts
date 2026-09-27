'use client';

import { equipmentMatrix } from '../../../lib/showcase';
import { useBuildContext } from '../../context';
import { useShowcaseSource } from '../use-showcase-source';
import { useShowcaseUsage } from '../use-showcase-usage';

export const useShowcaseEquipment = () => {
  const { options } = useBuildContext();
  const { isShares } = useShowcaseSource();
  const usage = useShowcaseUsage();

  return {
    columns: usage ? equipmentMatrix({ usage, devices: options.optionalDevices, slots: options.slots.optionalDevices }) : [],
    isShares
  };
};
