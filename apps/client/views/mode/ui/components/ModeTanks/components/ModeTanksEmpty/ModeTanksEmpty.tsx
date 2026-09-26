import { useTranslations } from 'next-intl';

import { Button, EmptyState } from '@/ui-kit';

import type { ModeTanksEmptyProps } from './ModeTanksEmpty.types';

export const ModeTanksEmpty = ({ isFiltered, minBattles, onReset }: ModeTanksEmptyProps) => {
  const t = useTranslations('modes.table');

  if (isFiltered) {
    return (
      <EmptyState
        action={
          <Button size='sm' variant='secondary' onClick={onReset}>
            {t('resetFilters')}
          </Button>
        }
        title={t('filteredEmptyTitle')}
      />
    );
  }

  return <EmptyState description={t('emptyDescription', { battles: minBattles ?? 0 })} title={t('emptyTitle')} />;
};
