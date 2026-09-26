import { EQUIP_CATEGORY_ICONS } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { EquipTile } from '@/entities/tank/build';
import { SectionHeader } from '@/ui-kit';

import type { EquipmentMatrixProps } from './EquipmentMatrix.types';

import s from './EquipmentMatrix.module.scss';

export const EquipmentMatrix = ({ columns, isShares }: EquipmentMatrixProps) => {
  const t = useTranslations('builds.showcase.equipment');

  return (
    <section className={s.root}>
      <SectionHeader title={t('title')} variant='display' />
      <div className={s.columns}>
        {columns.map((column) => {
          const Icon = EQUIP_CATEGORY_ICONS[column.category];
          const rows = [
            { id: 'primary', label: t('primary'), tiles: column.primary, directive: column.directive },
            { id: 'alternative', label: t('alternative'), tiles: column.alternative, directive: column.directiveAlternative }
          ];

          return (
            <div key={column.category} className={s.column} data-kind={column.category}>
              <h3 className={s.category}>
                <Icon aria-hidden size={16} />
                {t(`categories.${column.category}`)}
              </h3>
              {rows.map(
                (row) =>
                  row.tiles && (
                    <div key={row.id} className={s.set}>
                      <span className={s.setLabel}>{row.label}</span>
                      <div className={s.tiles}>
                        {row.tiles.map((tile, index) => (
                          <EquipTile
                            // eslint-disable-next-line react/no-array-index-key -- a missing variant leaves an empty slot at this position
                            key={tile?.id ?? `empty-${index}`}
                            category={column.category}
                            image={tile?.image ?? null}
                            isImproved={column.category !== 'standard' && tile !== null}
                            name={tile?.name ?? null}
                            share={isShares ? (tile?.share ?? null) : null}
                          />
                        ))}
                        {row.directive && (
                          <>
                            <span aria-hidden className={s.divider} />
                            <EquipTile
                              category='directive'
                              image={row.directive.image}
                              kind='directive'
                              name={row.directive.name}
                              share={isShares ? row.directive.share : null}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  )
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
