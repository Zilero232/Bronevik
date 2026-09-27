'use client';

import { useTranslations } from 'next-intl';

import { communityErrorKind } from '@/features/community/api-error';
import { useFormDialog } from '@/features/community/form-dialog';
import { QUERY_KEYS } from '@/shared/constants';

import { createPlatoon } from '../../../api';
import { PLATOON_FORM_DEFAULTS } from '../../../config';
import { platoonFormSchema, toCreatePlatoon } from '../../../lib/platoon-form';

export const useCreatePlatoonForm = () => {
  const t = useTranslations('platoons');

  return useFormDialog({
    schema: platoonFormSchema,
    defaults: PLATOON_FORM_DEFAULTS,
    mutationFn: (values) => createPlatoon(toCreatePlatoon(values)),
    successMessage: t('toast.created'),
    errorMessage: (error) => t(`errors.${communityErrorKind(error)}`),
    invalidate: QUERY_KEYS.platoons.all
  });
};
