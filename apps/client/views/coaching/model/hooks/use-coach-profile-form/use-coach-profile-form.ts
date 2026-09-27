'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { coachQueries } from '@/entities/coaching/coach';
import { communityErrorKind } from '@/features/community/api-error';
import { useFormDialog } from '@/features/community/form-dialog';
import { useCommunityViewer } from '@/features/community/viewer';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { saveCoachProfile } from '../../../api';
import { coachFormSchema, toCoachFormValues, toUpsertCoach } from '../../../lib/coach-form';

export const useCoachProfileForm = () => {
  const t = useTranslations('coaching');
  const { userId, accounts } = useCommunityViewer();
  const own = useQuery({ ...coachQueries.detail(userId ?? ''), enabled: userId !== null });
  const dialog = useFormDialog({
    schema: coachFormSchema,
    defaults: toCoachFormValues({ coach: own.data ?? null, fallbackAccountId: accounts[0]?.accountId ?? null }),
    mutationFn: (values) => saveCoachProfile(toUpsertCoach(values)),
    successMessage: t('profile.saved'),
    errorMessage: (error) => t(`errors.${communityErrorKind(error)}`),
    invalidate: QUERY_KEYS.coaching.all
  });

  return {
    dialog,
    accounts,
    hasProfile: Boolean(own.data),
    isLoading: userId !== null && (own.isPending || (own.isError && !isNotFoundError(own.error)))
  };
};
