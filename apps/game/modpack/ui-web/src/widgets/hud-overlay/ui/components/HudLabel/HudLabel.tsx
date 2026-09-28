import clsx from 'clsx';

import type { HudLabelProps } from './HudLabel.types';

import { HudRun } from '../HudRun';

import s from './HudLabel.module.scss';

// A button so the drag handle is a native control; a label the player cannot drag is disabled and
// lets the mouse through (pointer-events: none), like the rest of the page.
export const HudLabel = ({ label }: HudLabelProps) => (
  <button
    aria-label={label.panel.id}
    className={clsx(s.label, label.panel.border && s.border, label.draggable && s.draggable, label.dragging && s.dragging)}
    disabled={!label.draggable}
    style={label.style}
    tabIndex={-1}
    type='button'
    onMouseDown={label.onMouseDown}
  >
    {label.lines.map((line, index) => (
      <span key={index} className={s.line}>
        {line.map((run, position) => (
          <HudRun key={position} run={run} />
        ))}
      </span>
    ))}
  </button>
);
