'use client';

import { ICON_GROUPS, ICONS } from '@bronevik/icons';
import { useTranslations } from 'next-intl';

import type { IconGroupRowsProps } from './IconGroupRows.types';

import { DESIGN_ICONS } from '../../../../../config';
import { DesignRow } from '../../../DesignRow';
import { IconCell } from '../IconCell';

export const IconGroupRows = ({ iconProps }: IconGroupRowsProps) => {
  const t = useTranslations('design.icons');

  return DESIGN_ICONS.groupOrder.map((group) => (
    <DesignRow key={group} label={t(`groups.${group}`)}>
      {ICON_GROUPS[group].map((name) => {
        const Icon = ICONS[name];

        return (
          <IconCell key={name} name={name} title={name}>
            <Icon {...iconProps} />
          </IconCell>
        );
      })}
    </DesignRow>
  ));
};
