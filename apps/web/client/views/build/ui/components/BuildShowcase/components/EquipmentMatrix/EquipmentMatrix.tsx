'use client';

import { EQUIP_CATEGORY_ICONS } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { EquipTile } from '@/entities/tank/build';
import { EmptyState, SectionHeader } from '@/ui-kit';

import { useShowcaseEquipment } from '../../../../../model/hooks';

import s from './EquipmentMatrix.module.scss';

export const EquipmentMatrix = () => {
  const t = useTranslations('builds.showcase.equipment');
  const { columns, isShares } = useShowcaseEquipment();

  if (columns.length === 0) {
    return <EmptyState title={t('empty')} />;
  }

  return (
    <section className={s.root}>
      <SectionHeader title={t('title')} variant='display' />
      <div className={s.columns}>
        {columns.map((column) => {
          const Icon = EQUIP_CATEGORY_ICONS[column.category];

          return (
            <div key={column.category} className={s.column} data-kind={column.category}>
              <h3 className={s.category}>
                <Icon aria-hidden size={16} />
                {t(`categories.${column.category}`)}
              </h3>
              {column.sets.map((set) => (
                <div key={set.id} className={s.set}>
                  <span className={s.setLabel}>{t(set.id)}</span>
                  <div className={s.tiles}>
                    {set.slots.map(({ family, tile }) => (
                      <EquipTile
                        key={family}
                        category={column.category}
                        image={tile?.image ?? null}
                        isImproved={column.category !== 'standard' && tile !== null}
                        name={tile?.name ?? null}
                        share={isShares ? (tile?.share ?? null) : null}
                      />
                    ))}
                    {set.directive && (
                      <>
                        <span aria-hidden className={s.divider} />
                        <EquipTile
                          category='directive'
                          image={set.directive.image}
                          kind='directive'
                          name={set.directive.name}
                          share={isShares ? set.directive.share : null}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
};
