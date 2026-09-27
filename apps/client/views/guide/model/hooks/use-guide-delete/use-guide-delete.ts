'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { removeGuide } from '../../../api';
import { useGuide } from '../../context';

export const useGuideDelete = () => {
  const guide = useGuide();
  const t = useTranslations('guides.detail');
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isOpen, setOpen] = useBoolean(false);

  const remove = useMutation({
    mutationFn: () => removeGuide(guide.id),
    onSuccess: () => {
      toast.success(t('deleted'));
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.guides.all, refetchType: 'none' });
      router.replace(ROUTES.guides.list);
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
