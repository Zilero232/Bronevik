import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useSelectedClient } from '@/entities/client';
import { QUERY_KEYS } from '@/shared/config';
import { useDisplayFormat, useErrorToast } from '@/shared/lib';

import { clearCache, scanCache } from '../../../api';

export const useClearCache = () => {
  const t = useTranslations('settings.cache');
  const { megabytes } = useDisplayFormat();
  const showError = useErrorToast();
  const { clientPath } = useSelectedClient();
  const [unchecked, setUnchecked] = useState<Set<string>>(() => new Set());
  const planQuery = useQuery({ queryKey: QUERY_KEYS.cachePlan(clientPath), queryFn: () => scanCache(clientPath), enabled: false });
  const targets = planQuery.data?.targets ?? [];
  const chosen = targets.filter((target) => !unchecked.has(target.id));

  const rescan = async () => {
    const { error } = await planQuery.refetch();

    if (error) {
      showError(error);
    }
  };

  const clear = useMutation({
    mutationFn: () => clearCache({ clientPath, ids: chosen.map((target) => target.id) }),
    onSuccess: async (result) => {
      if (result.failed.length > 0) {
        toast.warning(t('partly', { size: megabytes(result.freedBytes), count: result.failed.length }));
      } else {
        toast.success(t('cleared', { size: megabytes(result.freedBytes) }));
      }

      await rescan();
    },
    onError: showError
  });

  return {
    isScanned: planQuery.data !== undefined,
    isScanning: planQuery.isFetching,
    isClearing: clear.isPending,
    rows: targets.map((target) => ({
      id: target.id,
      name: target.name,
      location: target.location,
      path: target.path,
      size: megabytes(target.sizeBytes),
      files: target.files,
      checked: !unchecked.has(target.id)
    })),
    chosenCount: chosen.length,
    chosenSize: megabytes(chosen.reduce((sum, target) => sum + target.sizeBytes, 0)),
    canClear: clientPath !== null && chosen.length > 0,
    canScan: clientPath !== null,
    onScan: () => {
      setUnchecked(new Set());
      void rescan();
    },
    onToggle: (id: string, checked: boolean) =>
      setUnchecked((current) => (checked ? new Set([...current].filter((item) => item !== id)) : new Set([...current, id]))),
    onClear: () => clear.mutate()
  };
};
