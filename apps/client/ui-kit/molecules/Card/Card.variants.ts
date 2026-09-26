import { cva } from 'class-variance-authority';

import s from './Card.module.scss';

export const cardVariants = cva(s.root, {
  variants: {
    variant: { panel: s.panel, well: s.well },
    padding: { none: s['pad-none'], sm: s['pad-sm'], md: s['pad-md'], lg: s['pad-lg'] },
    isInteractive: { true: s.interactive, false: '' }
  },
  defaultVariants: { variant: 'panel', padding: 'md', isInteractive: false }
});
