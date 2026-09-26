'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, ErrorState, KeyFigure, SectionHeader, Skeleton } from '@/ui-kit';

import { COSMETICS_PAGE } from '../config';
import { useCosmeticsPage } from '../model/hooks';
import { CosmeticTile } from './components';

import s from './CosmeticsPage.module.scss';

export const CosmeticsPage = () => {
  const t = useTranslations('cosmetics');
  const { inventory, sections, isPending, isError, isRetrying, retry, isBusy, onBuy, onEquip } = useCosmeticsPage();

  return (
    <div className={s.root}>
      <SectionHeader
        action={inventory && <KeyFigure hint={t('balanceHint')} label={t('balance')} value={inventory.balance} />}
        as='h2'
        description={t('description')}
        title={t('title')}
      />
      {isPending && <Skeleton height={COSMETICS_PAGE.skeletonHeight} shape='block' />}
      {isError && <ErrorState description={t('error')} isRetrying={isRetrying} onRetry={retry} />}
      {inventory &&
        sections.map(({ slot, items }) => (
          <Card key={slot} className={s.section} padding='lg'>
            <CardHeader title={t(`slots.${slot}`)} />
            <p className={s.hint}>{t(`slotHints.${slot}`)}</p>
            {items.length === 0 ? (
              <EmptyState isCompact title={t('empty')} />
            ) : (
              <ul className={s.grid}>
                {items.map(({ item, action }) => (
                  <li key={item.code}>
                    <CosmeticTile action={action} isBusy={isBusy} item={item} onBuy={onBuy} onEquip={onEquip} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
    </div>
  );
};
