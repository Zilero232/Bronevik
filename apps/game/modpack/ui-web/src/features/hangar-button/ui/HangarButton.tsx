import type { HangarButtonProps } from './HangarButton.types';

import { LogoMark } from '../../../shared/ui/logo-mark';
import { BUTTON } from '../config';

import s from './HangarButton.module.scss';

export const HangarButton = ({ onOpen }: HangarButtonProps) => (
  <button aria-label={BUTTON.title} className={s.button} title={BUTTON.title} type='button' onClick={onOpen}>
    <LogoMark size={BUTTON.logoSize} />
  </button>
);
