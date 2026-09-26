'use client';

import { TANK_CLASS_ICONS, TANK_CLASSES } from '@bronevik/icons';
import { useTranslations } from 'next-intl';

import type { ClassVariantRowsProps } from './ClassVariantRows.types';

import { DESIGN_ICONS } from '../../../../../config';
import { DesignRow } from '../../../DesignRow';
import { IconCell } from '../IconCell';

export const ClassVariantRows = ({ size }: ClassVariantRowsProps) => {
  const t = useTranslations('design.icons');

  return DESIGN_ICONS.classVariants.map((variant) => (
    <DesignRow key={variant} label={t(`variants.${variant}`)}>
      {TANK_CLASSES.map((tankClass) => {
        const Icon = TANK_CLASS_ICONS[tankClass];

        return (
          <IconCell key={tankClass} title={`${tankClass} · ${variant}`}>
            <Icon size={size} variant={variant} />
          </IconCell>
        );
      })}
    </DesignRow>
  ));
};
