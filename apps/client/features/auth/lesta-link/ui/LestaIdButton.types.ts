import type { LestaStartUrlInput } from '../model/hooks';

export type LestaIdButtonProps = LestaStartUrlInput & {
  label: string;
  size?: 'lg' | 'md' | 'sm';
  variant?: 'primary' | 'secondary';
  block?: boolean;
  className?: string;
};
