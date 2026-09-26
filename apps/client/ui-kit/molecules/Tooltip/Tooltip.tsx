'use client';

import { Popover } from '@base-ui/react/popover';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { clsx } from 'clsx';

import type { TooltipProps } from './Tooltip.types';

import s from './Tooltip.module.scss';

export const TooltipProvider = BaseTooltip.Provider;

export const Tooltip = ({ content, side = 'top', delay = 250, isNativeButton = false, className, children }: TooltipProps) => (
  <Popover.Root>
    <Popover.Trigger openOnHover delay={delay} nativeButton={isNativeButton} render={children} />
    <Popover.Portal>
      <Popover.Positioner className={s.positioner} side={side} sideOffset={8}>
        <Popover.Popup className={clsx(s.popup, className)} initialFocus={false} role='tooltip'>
          <Popover.Arrow className={s.arrow} />
          {content}
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
);
