'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, KeyFigure, QueryState, SectionHeader, Skeleton } from '@/ui-kit';

import { COSMETICS_PAGE } from '../config';
import { useCosmeticsPage } from '../model/hooks';
import { CosmeticTile } from './components';

import s from './CosmeticsPage.module.scss';

export const CosmeticsPage = () => {
  const t = useTranslations('cosmetics');
  const { query, sections, isBusy, onBuy, onEquip } = useCosmeticsPage();

  return (
    <div className={s.root}>
      <SectionHeader
        action={query.data && <KeyFigure hint={t('balanceHint')} label={t('balance')} value={query.data.balance} />}
        as='h1'
        description={t('description')}
        title={t('title')}
      />
      <QueryState errorDescription={t('error')} query={query} skeleton={<Skeleton height={COSMETICS_PAGE.skeletonHeight} shape='block' />}>
        {sections.map(({ slot, items }) => (
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
      </QueryState>
    </div>
  );
};
