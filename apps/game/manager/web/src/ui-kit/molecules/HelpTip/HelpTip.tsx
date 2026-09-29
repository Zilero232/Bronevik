import { CircleHelp } from 'lucide-react';

import type { HelpTipProps } from './HelpTip.types';

import { Tooltip } from '../Tooltip';

import s from './HelpTip.module.scss';

export const HelpTip = ({ label, children }: HelpTipProps) => (
  <Tooltip content={children}>
    <button aria-label={label} className={s.root} type='button'>
      <CircleHelp aria-hidden />
    </button>
  </Tooltip>
);
