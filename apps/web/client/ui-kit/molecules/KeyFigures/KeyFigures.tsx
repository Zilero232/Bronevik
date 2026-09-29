import { clsx } from 'clsx';

import type { KeyFiguresProps } from './KeyFigures.types';

import s from './KeyFigures.module.scss';

export const KeyFigures = ({ isFramed = true, isInline = false, className, children, ...props }: KeyFiguresProps) => (
  <div className={clsx(s.root, isFramed && s.framed, isInline && s.inline, className)} {...props}>
    {children}
  </div>
);
