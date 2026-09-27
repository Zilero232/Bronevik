import type { InputProps } from '../../input';

import { Input } from '../../input';

import s from './ListItemInput.module.scss';

export const ListItemInput = (props: InputProps) => <Input className={s.control} {...props} />;
