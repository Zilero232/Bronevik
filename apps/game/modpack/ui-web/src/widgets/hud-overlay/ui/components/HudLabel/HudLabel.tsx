import clsx from 'clsx';

import type { HudLabelProps } from './HudLabel.types';

import { LogoMark } from '../../../../../shared/ui/logo-mark';
import { HUD_OVERLAY } from '../../../config';
import { HudRun } from '../HudRun';

import s from './HudLabel.module.scss';

// A button so the drag handle is a native control; a label lets the mouse through (pointer-events: none)
// unless the player holds the edit modifier, and the settings button is always clickable.
export const HudLabel = ({ label }: HudLabelProps) => (
  <button
    ref={label.measureRef}
    className={clsx(
      s.label,
      label.panel.border && s.border,
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
    onMouseDown={label.onMouseDown}
    onWheel={label.onWheel}
  >
    {label.button ? (
      <LogoMark size={HUD_OVERLAY.logoSize} />
    ) : (
      label.lines.map((line, index) => (
        <span key={index} className={s.line}>
          {line.map((run, position) => (
            <HudRun key={position} run={run} />
          ))}
        </span>
      ))
    )}
  </button>
);
