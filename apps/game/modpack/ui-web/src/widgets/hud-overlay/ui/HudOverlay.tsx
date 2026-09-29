import { useHudOverlay } from '../model/hooks';
import { HudLabel } from './components';

import s from './HudOverlay.module.scss';

export const HudOverlay = () => {
  const overlay = useHudOverlay();

  return (
    <div className={s.overlay} style={overlay.style}>
      {overlay.labels.map((label) => (
        <HudLabel key={label.panel.id} label={label} />
      ))}
    </div>
  );
};
