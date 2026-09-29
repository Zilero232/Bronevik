import type { ComponentProps, ReactNode } from 'react';

import type { Link } from '@/shared/i18n/navigation';

export type FeaturedLinkProps = {
  href: ComponentProps<typeof Link>['href'];
  eyebrow: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  isAccent?: boolean;
};
