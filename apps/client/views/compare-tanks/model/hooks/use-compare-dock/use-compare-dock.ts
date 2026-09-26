'use client';

import type { VehicleSummary } from '@bronevik/schemas';

import { useCopy } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useCompareIds } from '../use-compare-ids';

export const useCompareDock = () => {
  const t = useTranslations('tanks.compare.dock');
  const { ids, isFull, add, clear } = useCompareIds();
  const { copy } = useCopy();

  const onPick = (vehicle: VehicleSummary | null) => {
    if (vehicle) {
      add(vehicle.tankId);
    }
  };

  const onCopy = async () => {
    try {
      await copy(window.location.href);
      toast.success(t('copied'));
    } catch {
      toast.error(t('copyFailed'));
    }
  };

  return { ids, count: ids.length, isFull, isEmpty: ids.length === 0, onPick, onCopy: () => void onCopy(), onClear: clear };
};
