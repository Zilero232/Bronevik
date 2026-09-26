'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { communityErrorKind } from '@/features/community/api-error';
import { QUERY_KEYS } from '@/shared/constants';

import type { CreateRecruiting, RecruitingKind } from '../../../api';
import type { RecruitingFormOutput, RecruitingFormValues } from '../../../lib/recruiting-form';

import { createRecruiting } from '../../../api';
import { RECRUITING_FORM_DEFAULTS } from '../../../config';
import { recruitingFormSchema, toCreateRecruiting } from '../../../lib/recruiting-form';
import { useViewerClans } from '../use-viewer-clans';

export const useCreateRecruitingForm = (kind: RecruitingKind) => {
  const t = useTranslations('recruiting');
  const queryClient = useQueryClient();
  const [isOpen, setOpen] = useBoolean(false);
  const { officers, isPending: isClansPending } = useViewerClans();
  const form = useForm<RecruitingFormValues, unknown, RecruitingFormOutput>({
    resolver: zodResolver(recruitingFormSchema),
    defaultValues: RECRUITING_FORM_DEFAULTS,
    mode: 'onTouched'
  });

  const accountId = useWatch({ control: form.control, name: 'accountId' });
  const create = useMutation({
    mutationFn: (body: CreateRecruiting) => createRecruiting(body),
    onSuccess: async () => {
      toast.success(t('toast.created'));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recruiting.all });
    },
    onError: (error) => {
      const kindOfError = communityErrorKind(error);

      toast.error(kind === 'clan_seeks_player' && kindOfError === 'forbidden' ? t('errors.notOfficer') : t(`errors.${kindOfError}`));
    }
  });

  const isClan = kind === 'clan_seeks_player';
  const clan = officers.find((officer) => String(officer.accountId) === accountId) ?? null;

  const onOpenChange = (next: boolean) => {
    setOpen(next);

    form.reset({
      ...RECRUITING_FORM_DEFAULTS,
      accountId: isClan && officers[0] ? String(officers[0].accountId) : RECRUITING_FORM_DEFAULTS.accountId
    });
  };

  const onSubmit = form.handleSubmit((values) =>
    create.mutate(toCreateRecruiting({ values, kind, clanId: clan?.clanId ?? null }), { onSuccess: () => onOpenChange(false) })
  );

  return {
    form,
    isClan,
    isOpen,
    officers,
    clan,
    canSubmit: !isClan || clan !== null,
    isClansPending,
    isPending: create.isPending,
    onOpenChange,
    onSubmit
  };
};
