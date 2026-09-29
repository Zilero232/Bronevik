import clsx from 'clsx';

import type { ReloadTimerWidgetProps } from './ReloadTimerWidget.types';

import { ClientIcon, MiniBar } from '../../../../../shared/ui/hud';
import { CONSUMABLES } from '../../config';
import { reloadView } from '../../lib/consumables-view';

import s from './ReloadTimerWidget.module.scss';

export const ReloadTimerWidget = ({ data }: ReloadTimerWidgetProps) => {
  const view = reloadView(data);

  return (
    <div className={clsx(s.reload, !view.visible && s.hidden)}>
      <div className={s.row}>
        {data.show_bar && (
          <MiniBar
            height={CONSUMABLES.reload.height}
            max={1000}
            tone={view.ready ? 'success' : 'accent'}
            value={Math.round(view.progress * 1000)}
            width={CONSUMABLES.reload.width}
          />
        )}
        <span className={s.seconds}>{view.seconds}</span>
      </div>
      {view.clip !== null && (
        <div className={s.row}>
          <ClientIcon icon={CONSUMABLES.reload.clipGlyph} size={CONSUMABLES.reload.clipIcon} />
          <span className={s.clip}>{view.clip}</span>
        </div>
      )}
    </div>
  );
};
