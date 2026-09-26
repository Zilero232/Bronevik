import { cva } from 'class-variance-authority';

import s from './PagedList.module.scss';

export const pagedListVariants = cva(s.root, {
  variants: {
    layout: { grid: s.grid, rows: s.rows }
  },
  defaultVariants: { layout: 'grid' }
});
