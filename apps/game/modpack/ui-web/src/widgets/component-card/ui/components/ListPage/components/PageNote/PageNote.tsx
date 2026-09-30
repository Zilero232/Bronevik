import type { PageNoteProps } from './PageNote.types';

import { Icon } from '../../../../../../../shared/ui/icon';

import s from './PageNote.module.scss';

export const PageNote = ({ text }: PageNoteProps) => (
  <p className={s.note}>
    <Icon className={s.icon} name='info' size={16} tone='accent' />
    <span className={s.text}>{text}</span>
  </p>
);
