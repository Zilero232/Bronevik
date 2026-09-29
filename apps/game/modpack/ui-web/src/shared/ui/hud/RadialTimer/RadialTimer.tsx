import clsx from 'clsx';

import type { RadialTimerProps } from './RadialTimer.types';

import { radialDash } from '../../../lib/radial';
import { toneClass } from '../tone';

import s from './RadialTimer.module.scss';

export const RadialTimer = ({ progress, size, stroke, tone = 'accent', children }: RadialTimerProps) => {
  const { dasharray, dashoffset } = radialDash({ progress, radius: (size - stroke) / 2 });

  return (
    <div className={s.radial} style={{ width: `${size}rem`, height: `${size}rem` }}>
      <span className={clsx(s.ring, toneClass(tone))}>
        <svg aria-hidden='true' height='100%' viewBox={`0 0 ${size} ${size}`} width='100%' xmlns='http://www.w3.org/2000/svg'>
          <circle cx={size / 2} cy={size / 2} fill='none' r={(size - stroke) / 2} stroke='rgba(255,255,255,0.12)' stroke-width={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            fill='none'
            r={(size - stroke) / 2}
            stroke='currentColor'
            stroke-dasharray={dasharray}
            stroke-dashoffset={dashoffset}
            stroke-width={stroke}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
      </span>
      <div className={s.content}>{children}</div>
    </div>
  );
};
