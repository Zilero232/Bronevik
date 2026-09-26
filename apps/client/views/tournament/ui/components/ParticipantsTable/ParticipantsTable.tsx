'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Card, CardHeader, EmptyState } from '@/ui-kit';

import type { ParticipantsTableProps } from './ParticipantsTable.types';

import s from './ParticipantsTable.module.scss';

export const ParticipantsTable = ({ tournament }: ParticipantsTableProps) => {
  const t = useTranslations('tournaments.participants');

  return (
    <Card padding='none'>
      <CardHeader meta={`${tournament.participants.length} / ${tournament.maxParticipants}`} title={t('title')} />
      {tournament.participants.length === 0 ? (
        <EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />
      ) : (
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.seed}>{t('seed')}</th>
              <th>{t('player')}</th>
              <th>{t('team')}</th>
            </tr>
          </thead>
          <tbody>
            {tournament.participants.map((participant) => (
              <tr key={participant.accountId}>
                <td className={s.seed}>{participant.seed ?? '—'}</td>
                <td>
                  <Link className={s.link} href={ROUTES.player(participant.nickname ?? String(participant.accountId))}>
                    {participant.nickname ?? `#${participant.accountId}`}
                  </Link>
                </td>
                <td className={s.team}>{participant.teamName ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
};
