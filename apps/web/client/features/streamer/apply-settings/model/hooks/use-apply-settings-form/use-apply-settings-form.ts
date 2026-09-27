'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuthSession, useLoginHref } from '@/entities/auth/session';
import { useSettingsFormatter } from '@/entities/streamer/settings';

import type { ApplyFormValues } from '../../../lib/apply-form';
import type { UseApplySettingsFormInput } from './use-apply-settings-form.types';

import { requestSettingsApply } from '../../../api';
import { APPLY_SETTINGS_DEFAULTS } from '../../../config';
import { applicableGroups, applyFormSchema, hardwareOptions, toApplyRequest } from '../../../lib/apply-form';

export const useApplySettingsForm = ({ slug, settings }: UseApplySettingsFormInput) => {
  const t = useTranslations('streamerSettings.apply');
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const loginHref = useLoginHref();
  const { groupLabel } = useSettingsFormatter();
  const [isOpen, setOpen] = useBoolean(false);
  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: APPLY_SETTINGS_DEFAULTS
  });

  const pickedGroups = useWatch({ control: form.control, name: 'groups' });

  const apply = useMutation({
    mutationFn: requestSettingsApply,
    onError: () => toast.error(t('failed'))
  });

  const groups = applicableGroups(settings);
  const options = hardwareOptions({ settings, groups: pickedGroups });

  const onOpenChange = (next: boolean) => {
    setOpen(next);

    if (!next) {
      form.reset(APPLY_SETTINGS_DEFAULTS);
      apply.reset();
    }
  };

  const onSubmit = form.handleSubmit((values) => apply.mutate(toApplyRequest({ slug, values, options })));

  return {
    form,
    loginHref,
    isSignedIn: Boolean(session),
    isSessionPending,
    isAvailable: groups.length > 0,
    isOpen,
    isPending: apply.isPending,
    request: apply.data ?? null,
    groupOptions: groups.map((group) => ({ value: group, label: groupLabel(group) })),
    options,
    onOpenChange,
    onSubmit
  };
};
