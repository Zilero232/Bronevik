'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { clsx } from 'clsx';

import type { PopoverProps } from './Popover.types';

import s from './Popover.module.scss';

export const Popover = ({ trigger, title, description, side = 'bottom', align = 'center', className, children }: PopoverProps) => (
  <BasePopover.Root>
    <BasePopover.Trigger render={trigger} />
    <BasePopover.Portal>
      <BasePopover.Positioner align={align} className={s.positioner} side={side} sideOffset={10}>
        <BasePopover.Popup className={clsx(s.popup, className)}>
          {title && <BasePopover.Title className={s.title}>{title}</BasePopover.Title>}
          {description && <BasePopover.Description className={s.description}>{description}</BasePopover.Description>}
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  </BasePopover.Root>
);
