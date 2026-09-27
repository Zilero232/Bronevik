import type { ButtonVariant } from '../button';

export type ActionBarItem = {
  id: string;
  label: string;
  variant?: ButtonVariant;
  onClick: () => void;
};

export type ActionBarProps = {
  items: readonly ActionBarItem[];
};
