import type { CardSwitchProps } from './CardSwitch.types';

import { useT } from '../../../../../entities/window-state';
import { Toggle } from '../../../../../shared/ui/toggle';

import s from './CardSwitch.module.scss';

export const CardSwitch = ({ component, card }: CardSwitchProps) => {
  const t = useT();

  if (!component.switch) {
    return null;
  }

  return (
    <span className={s.switch}>
      <span className={s.switchLabel}>{t(card.switchLabelKey)}</span>
      <Toggle label={component.title} on={component.switch.value} onToggle={card.toggle} />
    </span>
  );
};
