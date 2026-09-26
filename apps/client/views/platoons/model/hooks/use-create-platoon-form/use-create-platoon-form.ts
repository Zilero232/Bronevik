'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { communityErrorKind } from '@/features/community/api-error';
import { QUERY_KEYS } from '@/shared/constants';

import type { CreatePlatoon } from '../../../api';
import type { PlatoonFormOutput, PlatoonFormValues } from '../../../lib/platoon-form';

import { createPlatoon } from '../../../api';
import { PLATOON_FORM_DEFAULTS } from '../../../config';
import { platoonFormSchema, toCreatePlatoon } from '../../../lib/platoon-form';

export const useCreatePlatoonForm = () => {
  const t = useTranslations('platoons');
  const queryClient = useQueryClient();
  const [isOpen, setOpen] = useBoolean(false);
  const form = useForm<PlatoonFormValues, unknown, PlatoonFormOutput>({
    resolver: zodResolver(platoonFormSchema),
    defaultValues: PLATOON_FORM_DEFAULTS,
    mode: 'onTouched'
  });

  const create = useMutation({
    mutationFn: (body: CreatePlatoon) => createPlatoon(body),
    onSuccess: async () => {
      toast.success(t('toast.created'));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.platoons.all });
    },
    onError: (error) => toast.error(t(`errors.${communityErrorKind(error)}`))
  });

  const onOpenChange = (next: boolean) => {
    setOpen(next);

    if (!next) {
      form.reset(PLATOON_FORM_DEFAULTS);
    }
  };

  const onSubmit = form.handleSubmit((values) => create.mutate(toCreatePlatoon(values), { onSuccess: () => onOpenChange(false) }));

  return { form, isOpen, isPending: create.isPending, onOpenChange, onSubmit };
};
