'use client';

import { useTranslations } from 'next-intl';

import { communityErrorKind } from '@/features/community/api-error';
import { useFormDialog } from '@/features/community/form-dialog';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseCandidateActionsInput } from '../use-candidate-actions';

import { updateCandidate } from '../../../api';
import { candidateNotesSchema, toCandidateNotesValues } from '../../../lib/candidate-notes';

export const useCandidateNotesForm = ({ clanId, candidate }: UseCandidateActionsInput) => {
  const t = useTranslations('clanWorkspace');

  return useFormDialog({
    schema: candidateNotesSchema,
    defaults: toCandidateNotesValues(candidate),
    mutationFn: (patch) => updateCandidate({ clanId, id: candidate.id, patch }),
    successMessage: t('recruits.saved'),
    errorMessage: (error) => t(`errors.${communityErrorKind(error)}`),
    invalidate: QUERY_KEYS.clanWorkspace.all(clanId)
  });
};
