import { useFormatter, useLocale, useTranslations } from 'use-intl';

import { useSelectedClient } from '@/entities/client';
import { useInstallation } from '@/entities/installation';
import { statusMessageValues, statusView, usePatchReport } from '@/entities/patch-report';
import { pickLocalized } from '@/shared/lib';

export const usePatchStatus = () => {
  const t = useTranslations('patch');
  const format = useFormatter();
  const locale = useLocale();
  const { clientPath } = useSelectedClient();
  const reportQuery = usePatchReport();
  const { data: installation } = useInstallation(clientPath);
  const status = reportQuery.data?.status ?? { kind: 'idle' as const };
  const view = statusView({ status, needsMigration: installation?.needsMigration ?? false });
  const checkedAt = reportQuery.data?.checkedAt ? new Date(reportQuery.data.checkedAt) : null;
  const values = statusMessageValues({ status, modpackVersion: installation?.modpackVersion ?? null });
  const notes = status.kind === 'update_available' && status.notes ? pickLocalized({ text: status.notes, locale }) : null;

  return {
    clientPath,
    tone: view.tone,
    action: view.action,
    title: t(`status.${view.kind}`, values),
    hint: t(`hint.${view.kind}`, values),
    notes,
    checkedAt: checkedAt ? t('checkedAt', { date: format.dateTime(checkedAt, { dateStyle: 'medium', timeStyle: 'short' }) }) : t('neverChecked')
  };
};
