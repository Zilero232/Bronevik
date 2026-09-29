import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';

import type { TooltipProps } from './Tooltip.types';

import { TOOLTIP } from './Tooltip.constants';

import s from './Tooltip.module.scss';

export const Tooltip = ({ content, side = 'top', children }: TooltipProps) => (
  <BaseTooltip.Root>
    <BaseTooltip.Trigger delay={TOOLTIP.delayMs} render={children} />
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner className={s.positioner} side={side} sideOffset={TOOLTIP.offset}>
        <BaseTooltip.Popup className={s.popup}>{content}</BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  </BaseTooltip.Root>
);
