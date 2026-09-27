'use client';

import { useTranslations } from 'next-intl';

import { communityErrorKind } from '@/features/community/api-error';
import { useFormDialog } from '@/features/community/form-dialog';
import { QUERY_KEYS } from '@/shared/constants';

import type { WorkspaceScope } from '../../../api';

import { createWorkspaceEvent } from '../../../api';
import { EVENT_FORM_DEFAULTS } from '../../../config';
import { eventFormSchema } from '../../../lib/event-form';

export const useCreateEventForm = ({ clanId }: WorkspaceScope) => {
  const t = useTranslations('clanWorkspace');

  return useFormDialog({
    schema: eventFormSchema,
    defaults: EVENT_FORM_DEFAULTS,
    mutationFn: (event) => createWorkspaceEvent({ clanId, event }),
    successMessage: t('events.created'),
    errorMessage: (error) => t(`errors.${communityErrorKind(error)}`),
    invalidate: QUERY_KEYS.clanWorkspace.all(clanId)
  });
};
