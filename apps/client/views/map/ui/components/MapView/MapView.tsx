'use client';

import { DataSourceNote } from '@/ui-kit';

import type { MapViewProps } from './MapView.types';

import { MapHeader } from '../MapHeader';
import { MapNav } from '../MapNav';
import { MapStats } from '../MapStats';

import s from './MapView.module.scss';

export const MapView = ({ map }: MapViewProps) => (
  <div className={s.root}>
    <MapHeader map={map} />
    <MapStats stats={map.stats} />
    <MapNav arenaId={map.arenaId} />
    <DataSourceNote />
  </div>
);
