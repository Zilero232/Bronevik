import { GameIcon, gameLabel } from '@/entities/tank/build';
import { Tooltip } from '@/ui-kit';

import type { PickIconsProps } from './PickIcons.types';

import { HOW_TO_BUILD } from '../../../../../../../config';

import s from './PickIcons.module.scss';

export const PickIcons = ({ picks }: PickIconsProps) => (
  <span className={s.root}>
    {picks.map(({ option }) => (
      <Tooltip key={option.id} content={gameLabel(option.name)}>
        <span aria-label={gameLabel(option.name)}>
          <GameIcon kind={option.kind} size={HOW_TO_BUILD.iconSize} src={option.image} />
        </span>
      </Tooltip>
    ))}
  </span>
);
