import { clsx } from 'clsx';

import type { KbdProps } from './Kbd.types';

import s from './Kbd.module.scss';

export const Kbd = ({ className, ...props }: KbdProps) => <kbd className={clsx(s.root, className)} {...props} />;
