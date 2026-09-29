import { cva } from 'class-variance-authority';

import s from './Button.module.scss';

export const buttonVariants = cva(s.root, {
  variants: {
    variant: { primary: s.primary, premium: s.premium, secondary: s.secondary, ghost: s.ghost, danger: s.danger },
    size: { sm: s.sm, md: s.md, lg: s.lg },
    block: { true: s.block },
    shine: { true: s.shine }
  },
  defaultVariants: { variant: 'primary', size: 'md' }
});
