import clsx from 'clsx';

import type { OptionNoticeWidgetProps } from './OptionNoticeWidget.types';

import { HudPlate, toneClass } from '../../../../shared/ui/hud';

import s from './OptionNoticeWidget.module.scss';

export const OptionNoticeWidget = ({ data }: OptionNoticeWidgetProps) => (
  <HudPlate className={s.plate} fill='centre'>
    <span className={s.name}>{data.option}</span>
    <span className={clsx(s.state, toneClass(data.tone))}>{data.state}</span>
  </HudPlate>
);
