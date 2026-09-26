'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { EquipTile } from '@/entities/tank/build';
import { SectionHeader } from '@/ui-kit';

import type { ShellMixProps } from './ShellMix.types';

import s from './ShellMix.module.scss';

export const ShellMix = ({ consumables, shells }: ShellMixProps) => {
  const t = useTranslations('builds.showcase.supplies');
  const format = useFormatter();

  return (
    <section className={s.root}>
      <SectionHeader title={t('title')} variant='display' />
      <div className={s.body}>
        {consumables.length > 0 && (
          <div className={s.group}>
            <span className={s.label}>{t('consumables')}</span>
            <div className={s.tiles}>
              {consumables.map(({ option, share }) => (
                <EquipTile key={option.id} category='consumable' image={option.image} kind='consumable' name={option.name} share={share} size='sm' />
              ))}
            </div>
          </div>
        )}
        {shells.length > 0 && (
          <div className={s.group}>
            <span className={s.label}>{t('shells')}</span>
            <div aria-hidden className={s.bar}>
              {shells.map((shell) => (
                <span key={shell.shellId} className={s.segment} data-premium={shell.isPremium} style={{ flexGrow: shell.ammoShare }} />
              ))}
            </div>
            <ul className={s.legend}>
              {shells.map((shell) => (
                <li key={shell.shellId} className={s.legendItem} data-premium={shell.isPremium}>
                  <span aria-hidden className={s.swatch} />
                  {shell.label}
                  {shell.isPremium && ` (${t('premium')})`}
                  <span className={s.share}>{format.number(shell.ammoShare, 'share')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
