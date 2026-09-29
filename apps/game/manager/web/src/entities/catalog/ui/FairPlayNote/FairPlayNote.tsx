import { ShieldCheck } from 'lucide-react';

import type { FairPlayNoteProps } from './FairPlayNote.types';

import s from './FairPlayNote.module.scss';

export const FairPlayNote = ({ children }: FairPlayNoteProps) => (
  <p className={s.root}>
    <ShieldCheck aria-hidden />
    {children}
  </p>
);
