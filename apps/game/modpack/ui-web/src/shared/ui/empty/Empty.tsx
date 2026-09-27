import type { EmptyProps } from './Empty.types';

import s from './Empty.module.scss';

export const Empty = ({ children }: EmptyProps) => <p className={s.empty}>{children}</p>;
