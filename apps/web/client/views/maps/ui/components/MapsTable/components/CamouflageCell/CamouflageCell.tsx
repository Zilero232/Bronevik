'use client';

import { CAMOUFLAGE_TONE, isMapCamouflage, useMapLabels } from '@/entities/map/map';
import { Badge } from '@/ui-kit';

import type { CamouflageCellProps } from './CamouflageCell.types';

export const CamouflageCell = ({ camouflage }: CamouflageCellProps) => {
  const labels = useMapLabels();

  return camouflage ? (
    <Badge tone={isMapCamouflage(camouflage) ? CAMOUFLAGE_TONE[camouflage] : 'neutral'}>{labels.camouflage(camouflage)}</Badge>
  ) : (
    '—'
  );
};
