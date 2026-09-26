'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { UpsertCoach } from '@/entities/coaching/coach';

import { getCoach } from '@/entities/coaching/coach';
import { communityErrorKind } from '@/features/community/api-error';
import { useCommunityViewer } from '@/features/community/viewer';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import type { CoachFormOutput, CoachFormValues } from '../../../lib/coach-form';

import { saveCoachProfile } from '../../../api';
import { coachFormSchema, toCoachFormValues, toUpsertCoach } from '../../../lib/coach-form';

export const useCoachProfileForm = () => {
  const t = useTranslations('coaching');
  const queryClient = useQueryClient();
  const [isOpen, setOpen] = useBoolean(false);
  const { userId, accounts } = useCommunityViewer();
  const own = useQuery({
    queryKey: QUERY_KEYS.coaching.coach(userId ?? ''),
    queryFn: ({ signal }) => getCoach({ userId: userId ?? '', signal }),
    retry: (count, failure) => !isNotFoundError(failure) && count < 2,
    enabled: userId !== null
  });

  const form = useForm<CoachFormValues, unknown, CoachFormOutput>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: toCoachFormValues({ coach: null, fallbackAccountId: null }),
    mode: 'onTouched'
  });

  const save = useMutation({
    mutationFn: (body: UpsertCoach) => saveCoachProfile(body),
    onSuccess: async () => {
      toast.success(t('profile.saved'));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.coaching.all });
    },
    onError: (error) => toast.error(t(`errors.${communityErrorKind(error)}`))
  });

  const hasProfile = Boolean(own.data);

  const onOpenChange = (next: boolean) => {
    setOpen(next);

    if (next) {
      form.reset(toCoachFormValues({ coach: own.data ?? null, fallbackAccountId: accounts[0]?.accountId ?? null }));
    }
  };

  const onSubmit = form.handleSubmit((values) => save.mutate(toUpsertCoach(values), { onSuccess: () => onOpenChange(false) }));

  return {
    form,
    accounts,
    hasProfile,
    isOpen,
    isLoading: userId !== null && (own.isPending || (own.isError && !isNotFoundError(own.error))),
    isPending: save.isPending,
    onOpenChange,
    onSubmit
  };
};
