import clsx from 'clsx';

import type { MarksPanelWidgetProps } from './MarksPanelWidget.types';

import { ClientIcon, Glyph, HudPlate, toneClass } from '../../../../shared/ui/hud';
import { MARKS_PANEL } from '../config';
import { marksPanelView } from '../lib/marks-panel-view';

import s from './MarksPanelWidget.module.scss';

export const MarksPanelWidget = ({ data }: MarksPanelWidgetProps) => {
  const view = marksPanelView(data);

  return (
    <HudPlate className={s.plate} rail='progress'>
      {view.extended && view.thresholds.length > 0 && (
        <div className={s.line}>
          {view.thresholds.map((item) => (
            <span key={item.level} className={s.threshold}>
              <span className={s.level}>{item.label}</span>
              {item.reached ? (
                <Glyph name={MARKS_PANEL.checkGlyph} size={MARKS_PANEL.checkSize} tone='success' />
              ) : (
                <span className={s.need}>{item.value}</span>
              )}
            </span>
          ))}
        </div>
      )}
      {view.extended && (view.step !== null || view.battles !== null) && (
        <div className={s.line}>
          {view.step !== null && <span className={s.secondary}>{view.step}</span>}
          {view.battles !== null && (
            <span className={s.battles}>
              <ClientIcon icon={MARKS_PANEL.battlesGlyph} size={12} />
              <span className={s.secondary}>{view.battles}</span>
            </span>
          )}
        </div>
      )}
      {data.text !== null && <span className={s.secondary}>{data.text}</span>}
      <div className={s.main}>
        <ClientIcon icon={view.mark} size={MARKS_PANEL.markSize} />
        <span className={s.percent} style={{ color: data.color }}>
          {view.percent}
        </span>
        {view.delta !== null && <span className={clsx(s.delta, toneClass(view.deltaTone))}>{view.delta}</span>}
      </div>
    </HudPlate>
  );
};
