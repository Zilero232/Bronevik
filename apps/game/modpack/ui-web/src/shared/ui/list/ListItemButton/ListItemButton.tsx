import type { ButtonProps } from '../../button';

import { Button } from '../../button';

import s from './ListItemButton.module.scss';

export const ListItemButton = (props: ButtonProps) => <Button className={s.control} {...props} />;
