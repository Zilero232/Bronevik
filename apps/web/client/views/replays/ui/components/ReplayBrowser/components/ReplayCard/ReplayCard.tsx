'use client';

import { TankShowcaseCard } from '@/entities/tank/tank';
import { ReplayResultBadge } from '@/features/community/replay-meta';
import { Badge, MediaCard } from '@/ui-kit';

import type { ReplayCardProps } from './ReplayCard.types';

import { useReplayCard } from '../../../../../model/hooks';

export const ReplayCard = ({ replay, vehicle }: ReplayCardProps) => {
  const { href, mapName, tags, figures } = useReplayCard(replay);

  if (!vehicle) {
    return <MediaCard aspect='wide' href={href} media={null} sub={<ReplayResultBadge result={replay.result} />} title={mapName} />;
  }

  return (
    <TankShowcaseCard
      meta={
        <>
          <ReplayResultBadge result={replay.result} /> {mapName}
          {tags.map(({ tag, label }) => (
            <Badge key={tag} tone='gold'>
              {label}
            </Badge>
          ))}
        </>
      }
      figures={figures}
      href={href}
      layout='row'
      vehicle={vehicle}
    />
  );
};
