'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuthSession } from '@/entities/auth/session';
import { createReport } from '../../../api';

import type { ReportFormOutput, ReportFormValues, ReportTarget } from '../../../lib/report-form';

import { REPORT_DETAILS_MAX_LENGTH, REPORT_FORM_DEFAULT_VALUES, REPORT_REASONS } from '../../../config';
import { reportFormSchema, toCreateReport } from '../../../lib/report-form';

export const useReportForm = ({ targetType, targetId }: ReportTarget) => {
  const t = useTranslations('community.report');
  const { data: session } = useAuthSession();
  const [isOpen, setOpen] = useBoolean(false);
  const form = useForm<ReportFormValues, unknown, ReportFormOutput>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: REPORT_FORM_DEFAULT_VALUES
  });

  const details = useWatch({ control: form.control, name: 'details' });

  const report = useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      toast.success(t('sent'));
      setOpen(false);
      form.reset(REPORT_FORM_DEFAULT_VALUES);
    },
    onError: () => toast.error(t('failed'))
  });

  const onOpenChange = (next: boolean) => {
    setOpen(next);

    if (!next) {
      form.reset(REPORT_FORM_DEFAULT_VALUES);
    }
  };

  const onSubmit = form.handleSubmit((values) => report.mutate(toCreateReport({ values, targetType, targetId })));

  return {
    form,
    isSignedIn: Boolean(session),
    isOpen,
    isPending: report.isPending,
    reasons: REPORT_REASONS.map((value) => ({ value, label: t(`reasons.${value}`) })),
    detailsLength: details.length,
    detailsMaxLength: REPORT_DETAILS_MAX_LENGTH,
    onOpenChange,
    onSubmit
  };
};
