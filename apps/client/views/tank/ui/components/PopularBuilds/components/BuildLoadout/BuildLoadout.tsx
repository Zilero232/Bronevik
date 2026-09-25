'use client';

import { useTranslations } from 'next-intl';

import { gameLabel } from '@/entities/tank/build';

import type { BuildLoadoutProps } from './BuildLoadout.types';

import s from './BuildLoadout.module.scss';

export const BuildLoadout = ({ build }: BuildLoadoutProps) => {
  const t = useTranslations('tank.builds');

  const { optionalDevices, consumables, directives } = build;
  const supplies = [...consumables, ...directives];

  return (
    <div className={s.root}>
      <section className={s.group}>
        <h3 className={s.title}>{t('equipment')}</h3>
        {optionalDevices.length === 0 && <span className={s.none}>{t('none')}</span>}
        <ol className={s.slots}>
          {optionalDevices.map(({ id, name, categories }) => (
            <li key={id} className={s.slot} data-category={categories[0] ?? 'none'}>
              <span aria-hidden className={s.dot} />
              <span className={s.itemName}>{gameLabel(name)}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className={s.group}>
        <h3 className={s.title}>{t('consumables')}</h3>
        <ul className={s.chips}>
          {supplies.map(({ id, name }) => (
            <li key={id} className={s.chip}>
              {gameLabel(name)}
            </li>
          ))}
          {supplies.length === 0 && <li className={s.none}>{t('none')}</li>}
        </ul>
      </section>
    </div>
  );
};
