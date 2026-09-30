import clsx from 'clsx';

import type { ScrollAreaProps } from './ScrollArea.types';

import { useScrollArea } from '../../lib/use-scroll-area';

import s from './ScrollArea.module.scss';

export const ScrollArea = ({ className, contentClassName, label, children }: ScrollAreaProps) => {
  const area = useScrollArea();

  return (
    <div className={clsx(s.area, className)}>
      <div ref={area.viewportRef} aria-label={label} className={s.viewport} role={label ? 'region' : undefined} {...area.viewportProps}>
        <div className={clsx(s.content, contentClassName)}>{children}</div>
      </div>
      {area.thumb.visible && (
        <div aria-hidden='true' className={s.track}>
          <div ref={area.thumbRef} className={s.thumb} style={area.thumbStyle} />
        </div>
      )}
    </div>
  );
};
