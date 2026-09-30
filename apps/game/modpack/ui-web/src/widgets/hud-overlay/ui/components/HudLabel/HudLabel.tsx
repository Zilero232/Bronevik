import clsx from 'clsx';

import type { HudLabelProps } from './HudLabel.types';

import { HudPointerContext } from '../../../../../shared/lib/hud-pointer';
import { HudLines } from '../../../../../shared/ui/hud';
import { HUD_OVERLAY } from '../../../config';

import s from './HudLabel.module.scss';

export const HudLabel = ({ label }: HudLabelProps) => (
  <button
    ref={label.measureRef}
    className={clsx(
      s.label,
      label.panel.border && s.border,
      label.widget && s.widget,
      label.button && s.button,
      label.interactive && s.interactive,
      label.framed && s.framed,
      label.dragging && s.dragging
    )}
    aria-label={label.panel.id}
    disabled={!label.interactive}
    style={label.style}
    tabIndex={-1}
    type='button'
    onClick={label.onClick}
  >
    {label.button ? (
      <img alt='' className={s.buttonIcon} draggable={false} src={HUD_OVERLAY.buttonIcon} />
    ) : label.widget ? (
      <HudPointerContext value={label.interactive}>{label.widget.node}</HudPointerContext>
    ) : (
      <HudLines lines={label.lines} />
    )}
  </button>
);
