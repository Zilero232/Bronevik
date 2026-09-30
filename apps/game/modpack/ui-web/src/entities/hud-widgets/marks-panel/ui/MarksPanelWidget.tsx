import type { MarksPanelWidgetProps } from './MarksPanelWidget.types';

import { HudPlate, HudText } from '../../../../shared/ui/hud';
import { marksPanelView } from '../lib/marks-panel-view';
import { MarksDetail, MarksMain, MarksProgress, MarksThresholds } from './components';

import s from './MarksPanelWidget.module.scss';

export const MarksPanelWidget = ({ data }: MarksPanelWidgetProps) => {
  const view = marksPanelView(data);

  return (
    <HudPlate className={s.plate} rail='progress'>
      <MarksDetail detail={view.detail} />
      {view.extended && <MarksThresholds thresholds={view.thresholds} />}
      {view.extended && <MarksProgress battles={view.battles} step={view.step} />}
      <HudText className={s.secondary} text={data.text} />
      <MarksMain color={data.color} view={view} />
    </HudPlate>
  );
};
