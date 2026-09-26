'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import type { Guide } from '@/shared/api/guides';

import { removeGuide } from '@/shared/api/guides';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

export const useGuideDelete = (guide: Guide) => {
  const t = useTranslations('guides.detail');
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isOpen, setOpen] = useBoolean(false);

  const remove = useMutation({
    mutationFn: () => removeGuide(guide.id),
    onSuccess: () => {
      toast.success(t('deleted'));
      setOpen(false);
      queryClient.removeQueries({ queryKey: QUERY_KEYS.guides.detail(guide.slug) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.guides.all });
      router.replace(ROUTES.guides);
    },
    onError: () => toast.error(t('deleteFailed'))
  });

  return {
    isOpen,
    onOpenChange: (next: boolean) => setOpen(next),
    remove: () => remove.mutate(),
    isPending: remove.isPending
  };
};
