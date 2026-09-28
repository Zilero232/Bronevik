import type { ButtonVariantProps } from '@/ui-kit';

import type { ManagerLinkTarget } from '../../lib/manager-link';

export type OpenInManagerProps = {
  target: ManagerLinkTarget;
  size?: NonNullable<ButtonVariantProps['size']>;
  variant?: NonNullable<ButtonVariantProps['variant']>;
  className?: string;
};
