import { Avatar } from '@/ui-kit';

import type { GuideAuthorCellProps } from './GuideAuthorCell.types';

import s from './GuideAuthorCell.module.scss';

export const GuideAuthorCell = ({ author }: GuideAuthorCellProps) => (
  <span className={s.root}>
    <Avatar name={author.name} size='sm' src={author.image ?? undefined} />
    <span className={s.name}>{author.name}</span>
  </span>
);
