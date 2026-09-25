'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { clsx } from 'clsx';

import type { TooltipProps } from './Tooltip.types';

import s from './Tooltip.module.scss';

export const TooltipProvider = BaseTooltip.Provider;

export const Tooltip = ({ content, side = 'top', delay = 250, className, children }: TooltipProps) => (
  <BaseTooltip.Root>
    <BaseTooltip.Trigger delay={delay} render={children} />
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner className={s.positioner} side={side} sideOffset={8}>
        <BaseTooltip.Popup className={clsx(s.popup, className)}>
          <BaseTooltip.Arrow className={s.arrow} />
          {content}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  </BaseTooltip.Root>
);
