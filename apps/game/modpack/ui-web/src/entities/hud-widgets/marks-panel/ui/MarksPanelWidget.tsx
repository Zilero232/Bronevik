import type { MarksPanelWidgetProps } from './MarksPanelWidget.types';

import { HudPlate, HudText } from '../../../../shared/ui/hud';
import { marksPanelView } from '../lib/marks-panel-view';
import { MarksAverage, MarksMain, MarksThresholds } from './components';

import s from './MarksPanelWidget.module.scss';

export const MarksPanelWidget = ({ data }: MarksPanelWidgetProps) => {
  const view = marksPanelView(data);

  if (view.text !== null) {
    return (
      <HudPlate className={s.plate}>
        <HudText className={s.custom} text={view.text} />
      </HudPlate>
    );
  }

  return (
    <HudPlate className={s.plate}>
      <MarksMain view={view} />
      <MarksThresholds step={view.step} thresholds={view.thresholds} />
      <MarksAverage average={view.average} battles={view.battles} />
    </HudPlate>
  );
};
