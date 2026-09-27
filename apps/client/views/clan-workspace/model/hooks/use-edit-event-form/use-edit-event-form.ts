'use client';

import { useTranslations } from 'next-intl';

import { communityErrorKind } from '@/features/community/api-error';
import { useFormDialog } from '@/features/community/form-dialog';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseEditEventFormInput } from './use-edit-event-form.types';

import { updateWorkspaceEvent } from '../../../api';
import { eventFormSchema, toEventFormValues } from '../../../lib/event-form';

export const useEditEventForm = ({ clanId, event }: UseEditEventFormInput) => {
  const t = useTranslations('clanWorkspace');

  return useFormDialog({
    schema: eventFormSchema,
    defaults: toEventFormValues(event),
    mutationFn: (values) => updateWorkspaceEvent({ clanId, id: event.id, event: values }),
    successMessage: t('events.updated'),
    errorMessage: (error) => t(`errors.${communityErrorKind(error)}`),
    invalidate: QUERY_KEYS.clanWorkspace.all(clanId)
  });
};
