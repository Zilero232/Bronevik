import type { SixthSenseWidgetProps } from './SixthSenseWidget.types';

import { ClientIcon, RadialTimer } from '../../../../shared/ui/hud';
import { SIXTH_SENSE } from '../config';
import { lampView } from '../lib/lamp-view';

import s from './SixthSenseWidget.module.scss';

export const SixthSenseWidget = ({ data }: SixthSenseWidgetProps) => {
  const view = lampView(data);

  return (
    <div className={s.lamp}>
      <div style={{ opacity: view.alpha }}>
        <RadialTimer progress={view.progress} size={view.ring} stroke={SIXTH_SENSE.ring.stroke} tone='accent'>
          <ClientIcon icon={data.icon} size={data.size} />
        </RadialTimer>
      </div>
      {data.text && (
        <span className={s.text} style={{ color: data.color }}>
          {data.text}
        </span>
      )}
      {view.seconds && (
        <span className={s.seconds} style={{ color: data.color }}>
          {view.seconds}
        </span>
      )}
    </div>
  );
};
