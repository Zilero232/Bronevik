import { clsx } from 'clsx';

import type { TextAreaProps } from './TextArea.types';

import s from './TextArea.module.scss';

export const TextArea = ({ className, rows = 4, ...props }: TextAreaProps) => <textarea className={clsx(s.root, className)} rows={rows} {...props} />;
