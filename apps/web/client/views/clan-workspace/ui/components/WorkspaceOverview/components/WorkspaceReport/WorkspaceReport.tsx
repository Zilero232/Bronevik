'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useId } from 'react';

import { KeyFigure, KeyFigures, QueryState, SectionHeader, Skeleton } from '@/ui-kit';

import type { WorkspaceReportProps } from './WorkspaceReport.types';

import { attendanceTone } from '../../../../../lib/attendance';
import { useWorkspaceReport } from '../../../../../model/hooks';

import s from './WorkspaceReport.module.scss';

export const WorkspaceReport = ({ clanId }: WorkspaceReportProps) => {
  const t = useTranslations('clanWorkspace.report');
  const format = useFormatter();
  const titleId = useId();
  const query = useWorkspaceReport({ clanId, isEnabled: true });

  return (
    <section aria-labelledby={titleId} className={s.root}>
      <QueryState isCompact errorTitle={t('error')} query={query} skeleton={<Skeleton height={96} shape='block' />}>
        {(report) => (
          <>
            <SectionHeader
              id={titleId}
              meta={t('period', { from: format.dateTime(new Date(report.from), 'date'), to: format.dateTime(new Date(report.to), 'date') })}
              title={t('title')}
            />
            <KeyFigures isFramed>
              <KeyFigure label={t('events')} tone='steel' value={report.events} />
              <KeyFigure
                format={{ style: 'percent', maximumFractionDigits: 0 }}
                hint={t('attendanceHint')}
                label={t('attendance')}
                tone={attendanceTone(report.attendanceRate)}
                value={report.attendanceRate}
              />
              <KeyFigure label={t('newCandidates')} value={report.newCandidates} />
              <KeyFigure
                hint={t('inactiveHint')}
                label={t('inactive')}
                tone={report.inactiveMembers > 0 ? 'bad' : 'good'}
                value={report.inactiveMembers}
              />
            </KeyFigures>
          </>
        )}
      </QueryState>
    </section>
  );
};
