import { useLocale, useTranslations } from 'use-intl';

import { useSelectedClient } from '@/entities/client';
import { useInstallation } from '@/entities/installation';
import { statusMessageValues, statusView, usePatchReport } from '@/entities/patch-report';
import { pickLocalized, useDisplayFormat } from '@/shared/lib';

export const usePatchStatus = () => {
  const t = useTranslations('patch');
  const tErrors = useTranslations('errors');
  const { stamp } = useDisplayFormat();
  const locale = useLocale();
  const { clientPath } = useSelectedClient();
  const reportQuery = usePatchReport();
  const { data: installation } = useInstallation(clientPath);
  const status = reportQuery.data?.status ?? { kind: 'idle' as const };
  const view = statusView({ status, needsMigration: installation?.needsMigration ?? false });
  const checkedAt = reportQuery.data?.checkedAt ? new Date(reportQuery.data.checkedAt) : null;
  const reason = status.kind === 'failed' ? tErrors(status.code) : '';
  const values = { ...statusMessageValues({ status, modpackVersion: installation?.modpackVersion ?? null }), reason };
  const releaseNotes = status.kind === 'update_available' || status.kind === 'update_ready' ? status.notes : null;
  const notes = releaseNotes ? pickLocalized({ text: releaseNotes, locale }) : null;

  return {
    clientPath,
    tone: view.tone,
    action: view.action,
    title: t(`status.${view.kind}`, values),
    hint: t(`hint.${view.kind}`, values),
    notes,
    checkedAt: checkedAt ? t('checkedAt', { date: stamp(checkedAt) }) : t('neverChecked')
  };
};
