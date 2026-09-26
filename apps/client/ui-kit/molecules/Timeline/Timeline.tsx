import { clsx } from 'clsx';

import type { TimelineProps } from './Timeline.types';

import s from './Timeline.module.scss';

export const Timeline = ({ items, variant = 'plain', className, 'aria-label': ariaLabel }: TimelineProps) => {
  const isDated = items.some((item) => item.date !== undefined);

  return (
    <ol aria-label={ariaLabel} className={clsx(s.root, s[variant], className)} data-dated={isDated}>
      {items.map(({ id, tone = 'accent', date, dateTime, isCurrent = false, content }) => (
        <li key={id} aria-current={isCurrent ? 'step' : undefined} className={s.node} data-tone={tone}>
          {isDated && (
            <time className={s.date} dateTime={dateTime}>
              {date}
            </time>
          )}
          <span aria-hidden className={s.dot} />
          <div className={s.content}>{content}</div>
        </li>
      ))}
    </ol>
  );
};
