import clsx from 'clsx';

import type { ReloadTimerWidgetProps } from './ReloadTimerWidget.types';

import { ClientIcon, MiniBar } from '../../../../shared/ui/hud';
import { RELOAD_TIMER } from '../config';
import { reloadView } from '../lib/reload-view';

import s from './ReloadTimerWidget.module.scss';

export const ReloadTimerWidget = ({ data }: ReloadTimerWidgetProps) => {
  const view = reloadView(data);

  return (
    <div className={clsx(s.reload, !view.visible && s.hidden)}>
      <div className={s.row}>
        {data.show_bar && (
          <MiniBar
            height={RELOAD_TIMER.height}
            max={1000}
            tone={view.ready ? 'success' : 'accent'}
            value={Math.round(view.progress * 1000)}
            width={RELOAD_TIMER.width}
          />
        )}
        <span className={s.seconds}>{view.seconds}</span>
      </div>
      {view.clip !== null && (
        <div className={s.row}>
          <ClientIcon icon={RELOAD_TIMER.clipGlyph} size={RELOAD_TIMER.clipIcon} />
          <span className={s.clip}>{view.clip}</span>
        </div>
      )}
    </div>
  );
};
