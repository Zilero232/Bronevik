'use client';

import { clsx } from 'clsx';
import { Map as MapIcon } from 'lucide-react';
import { match, P } from 'ts-pattern';

import { TankLink } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { GuideSubjectProps } from './GuideSubject.types';

import { useGuideSubject } from '../../model/hooks';

import s from './GuideSubject.module.scss';

export const GuideSubject = ({ tankId, arenaId, className }: GuideSubjectProps) => {
  const { vehicle, map } = useGuideSubject({ tankId, arenaId });

  return match({ vehicle, map, tankId, arenaId })
    .with({ vehicle: P.nonNullable }, ({ vehicle: tank }) => <TankLink className={className} vehicle={tank} />)
    .with({ map: P.nonNullable }, ({ map: arena }) => (
      <Link className={clsx(s.map, className)} href={ROUTES.map(arena.slug)}>
        <MapIcon aria-hidden size={14} />
        {arena.name}
      </Link>
    ))
    .with({ tankId: P.number }, ({ tankId: id }) => <span className={clsx(s.fallback, className)}>#{id}</span>)
    .with({ arenaId: P.string }, ({ arenaId: id }) => <span className={clsx(s.fallback, className)}>{id}</span>)
    .otherwise(() => null);
};
