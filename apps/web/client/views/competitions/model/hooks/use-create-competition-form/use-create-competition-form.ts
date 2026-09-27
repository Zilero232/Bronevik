'use client';

import { COMPETITION } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { useWatch } from 'react-hook-form';

import { useCompetitionsCache } from '@/entities/competition/competition';
import { communityErrorKind } from '@/features/community/api-error';
import { useFormDialog } from '@/features/community/form-dialog';
import { usePlus } from '@/features/plus/plus-gate';
import { isPlusRequiredError } from '@/shared/api/source';
import { ROUTES } from '@/shared/constants';

import { createCompetition } from '../../../api';
import { COMPETITION_FORM_DEFAULTS } from '../../../config';
import { competitionFormSchema } from '../../../lib/competition-form';

export const useCreateCompetitionForm = () => {
  const t = useTranslations('competitions');
  const { isPlus } = usePlus();
  const { invalidateLists, storeDetail } = useCompetitionsCache();
  const dialog = useFormDialog({
    schema: competitionFormSchema,
    defaults: COMPETITION_FORM_DEFAULTS,
    mutationFn: createCompetition,
    onSuccess: async (competition) => {
      storeDetail(competition);
      await invalidateLists();
    },
    successMessage: t('toast.created'),
    errorMessage: (error) => t(isPlusRequiredError(error) ? 'errors.plus' : `errors.${communityErrorKind(error)}`),
    redirect: (competition) => ROUTES.competitions.detail(competition.slug)
  });

  const visibility = useWatch({ control: dialog.form.control, name: 'visibility' });

  return {
    dialog,
    isPrivateLocked: visibility === 'private' && !isPlus,
    onResetScoring: () => dialog.form.setValue('scoring', { ...COMPETITION.defaultScoring }, { shouldDirty: true })
  };
};
