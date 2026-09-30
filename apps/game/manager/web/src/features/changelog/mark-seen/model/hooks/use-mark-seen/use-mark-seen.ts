import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markReleaseSeen } from '@/entities/changelog';
import { useSelectedClient } from '@/entities/client';
import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

export const useMarkSeen = (version: string) => {
  const queryClient = useQueryClient();
  const showError = useErrorToast();
  const { clientPath } = useSelectedClient();

  const mark = useMutation({
    mutationFn: () => markReleaseSeen(version),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.whatsNew(clientPath) }),
    onError: showError
  });

  return { isPending: mark.isPending, onMark: () => mark.mutate() };
};
