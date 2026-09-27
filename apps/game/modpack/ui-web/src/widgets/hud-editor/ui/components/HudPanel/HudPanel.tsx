import clsx from 'clsx';

import type { HudPanelProps } from './HudPanel.types';

import { useT } from '../../../../../entities/window-state';

import s from './HudPanel.module.scss';

export const HudPanel = ({ item }: HudPanelProps) => {
  const t = useT();
  const { panel } = item;

  return (
    <button
      aria-label={panel.title}
      aria-pressed={item.selected}
      className={clsx(s.panel, item.selected && s.panelOn, !panel.enabled && s.panelOff)}
      style={item.style}
      type='button'
      onKeyDown={item.onKeyDown}
      onMouseDown={item.onMouseDown}
    >
      <span className={s.panelTitle}>{panel.title}</span>
      <span className={s.panelPreview}>{panel.enabled ? (panel.preview ?? '') : t('hudDisabled')}</span>
    </button>
  );
};
