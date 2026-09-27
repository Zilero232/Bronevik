import { cva } from 'class-variance-authority';

import s from './Badge.module.scss';

export const badgeVariants = cva(s.root, {
  variants: {
    tone: { neutral: s.neutral, accent: s.accent, success: s.success, warning: s.warning, danger: s.danger, premium: s.premium }
  },
  defaultVariants: { tone: 'neutral' }
});
