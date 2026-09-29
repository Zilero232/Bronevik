import clsx from 'clsx';

import type { HudLabelProps } from './HudLabel.types';

import { LogoMark } from '../../../../../shared/ui/logo-mark';
import { HUD_OVERLAY } from '../../../config';
import { HudRun } from '../HudRun';

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
    onMouseDown={label.onMouseDown}
    onWheel={label.onWheel}
  >
    {label.button ? (
      <LogoMark size={HUD_OVERLAY.logoSize} />
    ) : label.widget ? (
      label.widget.node
    ) : (
      label.lines.map((line) => (
        <span key={line.key} className={s.line}>
          {line.runs.map((run) => (
            <HudRun key={run.key} run={run} />
          ))}
        </span>
      ))
    )}
  </button>
);
