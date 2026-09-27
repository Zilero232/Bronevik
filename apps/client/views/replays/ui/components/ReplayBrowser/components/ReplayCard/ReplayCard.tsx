'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankShowcaseCard } from '@/entities/tank/tank';
import { ReplayResultBadge } from '@/features/community/replay-meta';
import { ROUTES } from '@/shared/constants';
import { PERCENT_TEXT } from '@/shared/lib';
import { MediaCard } from '@/ui-kit';

import type { ReplayCardProps } from './ReplayCard.types';

import { REPLAY_CARD } from '../../../../../config';

export const ReplayCard = ({ replay, vehicle }: ReplayCardProps) => {
  const t = useTranslations('replays.list');
  const format = useFormatter();

  const href = ROUTES.replays.detail(replay.id);
  const mapName = replay.mapName ?? replay.arenaId ?? t('unknownMap');
  const result = <ReplayResultBadge result={replay.result} />;

  if (!vehicle) {
    return <MediaCard aspect='wide' href={href} media={null} sub={result} title={mapName} />;
  }

  return (
    <TankShowcaseCard
      figures={REPLAY_CARD.figures.map(({ id, key }) => {
        const value = replay[key];

        return { id, label: t(`columns.${id}`), value: value === null ? PERCENT_TEXT.empty : format.number(value) };
      })}
      meta={
        <>
          {result} {mapName}
        </>
      }
      href={href}
      layout='row'
      vehicle={vehicle}
    />
  );
};
