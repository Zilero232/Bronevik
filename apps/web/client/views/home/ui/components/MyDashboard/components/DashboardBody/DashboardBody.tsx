'use client';

import type { DashboardBodyProps } from './DashboardBody.types';

import { DashboardFigures } from '../DashboardFigures';
import { DashboardHead } from '../DashboardHead';
import { DashboardLinks } from '../DashboardLinks';
import { DashboardMarks } from '../DashboardMarks';
import { DashboardSession } from '../DashboardSession';

import s from './DashboardBody.module.scss';

export const DashboardBody = ({ nickname, profile, week, session, marks, onForget }: DashboardBodyProps) => (
  <div className={s.root}>
    <DashboardHead key={profile.summary.accountId} summary={profile.summary} onForget={onForget} />
    <DashboardFigures overall={profile.summary.overall} week={week} />
    <DashboardMarks marks={marks} nickname={nickname} />
    <DashboardSession nickname={nickname} session={session} />
    <DashboardLinks accountId={profile.summary.accountId} nickname={nickname} />
  </div>
);
