import { PackageOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EmptyState } from '@/ui-kit';

import type { CatalogPendingProps } from './CatalogPending.types';

import { CATALOG_PENDING } from '../../config';

export const CatalogPending = ({ isCompact, className }: CatalogPendingProps) => {
  const t = useTranslations('common.catalogPending');

  return (
    <EmptyState
      className={className}
      description={t('description')}
      icon={<PackageOpen size={CATALOG_PENDING.iconSize} />}
      isCompact={isCompact}
      role='status'
      title={t('title')}
    />
  );
};
