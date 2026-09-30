import { Link } from '@/shared/i18n/navigation';

import type { SampleNameCellProps } from './SampleNameCell.types';

import s from './SampleNameCell.module.scss';

export const SampleNameCell = ({ name, href, isEnough }: SampleNameCellProps) => (
  <Link className={s.root} data-enough={isEnough} href={href}>
    {name}
  </Link>
);
