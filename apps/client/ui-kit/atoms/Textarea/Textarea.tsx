import { clsx } from 'clsx';

import type { TextareaProps } from './Textarea.types';

import s from './Textarea.module.scss';

export const Textarea = ({ isInvalid = false, className, rows = 4, ...props }: TextareaProps) => (
  <textarea aria-invalid={isInvalid || undefined} className={clsx(s.root, className)} data-invalid={isInvalid} rows={rows} {...props} />
);
