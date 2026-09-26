'use client';

import type { CreateCompetition } from '@otmetki/schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { COMPETITION } from '@otmetki/schemas';
import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { useCompetitionsCache } from '@/entities/competition/competition';
import { communityErrorKind } from '@/features/community/api-error';
import { usePlus } from '@/features/plus/plus-gate';
import { createCompetition } from '../../../api';
import { isPlusRequiredError } from '@/shared/api/source';
import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import type { CompetitionFormOutput, CompetitionFormValues } from '../../../lib/competition-form';

import { COMPETITION_FORM_DEFAULTS } from '../../../config';
import { competitionFormSchema } from '../../../lib/competition-form';

export const useCreateCompetitionForm = () => {
  const t = useTranslations('competitions');
  const router = useRouter();
  const { isPlus } = usePlus();
  const { invalidateLists, storeDetail } = useCompetitionsCache();
  const [isOpen, setOpen] = useBoolean(false);
  const form = useForm<CompetitionFormValues, unknown, CompetitionFormOutput>({
    resolver: zodResolver(competitionFormSchema),
    defaultValues: COMPETITION_FORM_DEFAULTS,
    mode: 'onTouched'
  });

  const visibility = useWatch({ control: form.control, name: 'visibility' });

  const create = useMutation({
    mutationFn: (body: CreateCompetition) => createCompetition(body),
    onSuccess: async (competition) => {
      toast.success(t('toast.created'));
      storeDetail(competition);
      await invalidateLists();
      router.push(ROUTES.competitions.detail(competition.slug));
    },
    onError: (error) => toast.error(t(isPlusRequiredError(error) ? 'errors.plus' : `errors.${communityErrorKind(error)}`))
  });

  const isPrivateLocked = visibility === 'private' && !isPlus;

  const onOpenChange = (next: boolean) => {
    setOpen(next);

    if (!next) {
      form.reset(COMPETITION_FORM_DEFAULTS);
    }
  };

  const onResetScoring = () => form.setValue('scoring', { ...COMPETITION.defaultScoring }, { shouldDirty: true });

  const onSubmit = form.handleSubmit((body) => create.mutate(body, { onSuccess: () => onOpenChange(false) }));

  return {
    form,
    isOpen,
    isPending: create.isPending,
    isPrivateLocked,
    onOpenChange,
    onResetScoring,
    onSubmit
  };
};
