import clsx from 'clsx';

import type { ButtonProps } from '../button';
import type { InputProps } from '../input';
import type { RowListProps, RowMainProps, RowProps, RowSlotProps } from './Row.types';

import { Button } from '../button';
import { Input } from '../input';

import s from './Row.module.scss';

export const RowList = ({ children }: RowListProps) => <ul className={s.list}>{children}</ul>;

export const Row = ({ active = false, children }: RowProps) => <li className={clsx(s.row, active && s.active)}>{children}</li>;

export const RowMain = ({ title, badge, children }: RowMainProps) => (
  <div className={s.main}>
    <div className={s.titleLine}>
      <span className={s.title}>{title}</span>
      {badge}
    </div>
    {children}
  </div>
);

export const RowActions = ({ children }: RowSlotProps) => <div className={s.actions}>{children}</div>;

export const RowButton = (props: ButtonProps) => <Button className={s.control} {...props} />;

export const RowInput = (props: InputProps) => <Input className={s.control} {...props} />;

export const RowNote = ({ children }: RowSlotProps) => <span className={s.note}>{children}</span>;
