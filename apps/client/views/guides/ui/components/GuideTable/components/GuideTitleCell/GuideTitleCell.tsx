import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { GuideTitleCellProps } from './GuideTitleCell.types';

import s from './GuideTitleCell.module.scss';

export const GuideTitleCell = ({ guide }: GuideTitleCellProps) => (
  <span className={s.root}>
    <Link className={s.title} href={ROUTES.guides.detail(guide.slug)}>
      {guide.title}
    </Link>
    <span className={s.locale}>{guide.locale}</span>
  </span>
);
