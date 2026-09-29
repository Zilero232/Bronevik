'use client';

import { equipmentMatrix } from '../../../lib/showcase';
import { useBuildContext } from '../../context';
import { useShowcaseSource } from '../use-showcase-source';
import { useShowcaseUsage } from '../use-showcase-usage';

export const useShowcaseEquipment = () => {
  const { options } = useBuildContext();
  const { isShares } = useShowcaseSource();
  const usage = useShowcaseUsage();

  const matrix = usage ? equipmentMatrix({ usage, devices: options.optionalDevices, slots: options.slots.optionalDevices }) : [];
  const columns = matrix.map((column) => ({
    category: column.category,
    sets: [
      { id: 'primary' as const, slots: column.primary, directive: column.directive },
      { id: 'alternative' as const, slots: column.alternative, directive: column.directiveAlternative }
    ].flatMap(({ slots, ...set }) => (slots ? [{ ...set, slots }] : []))
  }));

  return { columns, isShares };
};
