import type { CrosshairWidgetProps } from './CrosshairWidget.types';

import { ClientIcon } from '../../../../shared/ui/hud';
import { CROSSHAIR } from '../config';

import s from './CrosshairWidget.module.scss';

export const CrosshairWidget = ({ data }: CrosshairWidgetProps) => (
  <div className={s.reticle} style={{ width: `${CROSSHAIR.reticle}rem`, height: `${CROSSHAIR.reticle}rem` }}>
    <div className={s.ring} />
    <div className={s.horizontal} />
    <div className={s.vertical} />
    {!data.hides_centre && <div className={s.centre} />}
    {data.mark && <ClientIcon className={s.mark} icon={data.mark} size={data.size} />}
  </div>
);
