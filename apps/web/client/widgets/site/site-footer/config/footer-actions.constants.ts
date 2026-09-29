import type { SITE_FOOTER_ACTIONS } from '@/shared/constants';
import type { ButtonVariantProps } from '@/ui-kit';

export const FOOTER_ACTION_VARIANT = {
  mod: 'primary',
  tools: 'secondary',
  plus: 'premium'
} as const satisfies Record<(typeof SITE_FOOTER_ACTIONS)[number]['key'], NonNullable<ButtonVariantProps['variant']>>;
