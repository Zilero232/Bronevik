import type { LucideIcon } from 'lucide-react';

import type { ButtonVariantProps } from '@/ui-kit';

import type { ModDownload } from '../../../../../model/hooks';

export type DownloadLinkProps = {
  file: ModDownload | null;
  href: string;
  fileName: string;
  icon: LucideIcon;
  label: string;
  variant: NonNullable<ButtonVariantProps['variant']>;
  hasShine?: boolean;
};
