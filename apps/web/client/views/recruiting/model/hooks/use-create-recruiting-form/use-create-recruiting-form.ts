'use client';

import { useTranslations } from 'next-intl';
import { useWatch } from 'react-hook-form';

import { communityErrorKind } from '@/features/community/api-error';
import { useFormDialog } from '@/features/community/form-dialog';
import { QUERY_KEYS } from '@/shared/constants';

import type { RecruitingKind } from '../../../api';

import { createRecruiting } from '../../../api';
import { RECRUITING_FORM_DEFAULTS } from '../../../config';
import { recruitingFormSchema, toCreateRecruiting } from '../../../lib/recruiting-form';
import { useViewerClans } from '../use-viewer-clans';

export const useCreateRecruitingForm = (kind: RecruitingKind) => {
  const t = useTranslations('recruiting');
  const { officers, isPending: isClansPending } = useViewerClans();
  const isClan = kind === 'clan_seeks_player';
  const officerOf = (accountId: string) => officers.find((officer) => String(officer.accountId) === accountId) ?? null;
  const dialog = useFormDialog({
    schema: recruitingFormSchema,
    defaults: {
      ...RECRUITING_FORM_DEFAULTS,
      accountId: isClan && officers[0] ? String(officers[0].accountId) : RECRUITING_FORM_DEFAULTS.accountId
    },
    mutationFn: (values) => createRecruiting(toCreateRecruiting({ values, kind, clanId: officerOf(values.accountId)?.clanId ?? null })),
    successMessage: t('toast.created'),
    errorMessage: (error) => {
      const errorKind = communityErrorKind(error);

      return isClan && errorKind === 'forbidden' ? t('errors.notOfficer') : t(`errors.${errorKind}`);
    },
    invalidate: QUERY_KEYS.recruiting.all
  });

  const accountId = useWatch({ control: dialog.form.control, name: 'accountId' });

  return {
    dialog,
    isClan,
    officers,
    isClansPending,
    canSubmit: !isClan || officerOf(accountId) !== null
  };
};
