import type { WindowFrameProps } from './WindowFrame.types';

import { Icon } from '../../../shared/ui/icon';

import s from './WindowFrame.module.scss';

export const WindowFrame = ({ frame, label, children }: WindowFrameProps) => (
  <div aria-label={label} className={s.frame} role='dialog' style={frame.frameStyle}>
    <div className={s.inner} style={frame.innerStyle}>
      {children}
    </div>
    <div aria-hidden='true' className={s.edgeRight} onMouseDown={frame.onResizeStart('right')} />
    <div aria-hidden='true' className={s.edgeBottom} onMouseDown={frame.onResizeStart('bottom')} />
    <div aria-hidden='true' className={s.grip} onMouseDown={frame.onResizeStart('corner')}>
      <Icon name='move-diagonal-2' size={12} />
    </div>
  </div>
);
