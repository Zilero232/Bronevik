'use client';

import { useTranslations } from 'next-intl';

import type { UsageBodyProps } from './UsageBody.types';

import { HOW_TO_BUILD } from '../../../../../config';
import { CrewUsage } from '../CrewUsage';
import { PickList } from '../PickList';
import { ShellUsage } from '../ShellUsage';

import s from './UsageBody.module.scss';

export const UsageBody = ({ usage, crew }: UsageBodyProps) => {
  const t = useTranslations('tank.builds');

  return (
    <div className={s.root}>
      <section className={s.group}>
        <h3 className={s.title}>{t('equipment')}</h3>
        <div className={s.columns}>
          {usage.equipment.map(({ slot, picks }) => (
            <PickList key={slot} picks={picks.slice(0, HOW_TO_BUILD.picksPerSlot)} title={t('slot', { slot: slot + 1 })} />
          ))}
        </div>
      </section>
      <section className={s.group}>
        <h3 className={s.title}>{t('consumables')}</h3>
        <div className={s.columns}>
          <PickList picks={usage.consumables.slice(0, HOW_TO_BUILD.picksPerList)} />
          {usage.directives.length > 0 && <PickList picks={usage.directives.slice(0, HOW_TO_BUILD.picksPerSlot)} title={t('directives')} />}
          {usage.shells.length > 0 && <ShellUsage shells={usage.shells.slice(0, HOW_TO_BUILD.shells)} />}
        </div>
      </section>
      {usage.fieldModifications.length > 0 && (
        <section className={s.group}>
          <h3 className={s.title}>{t('fieldMods')}</h3>
          <div className={s.columns}>
            {usage.fieldModifications.map(({ level, picks }) => (
              <PickList key={level} picks={picks} title={t('level', { level })} />
            ))}
          </div>
        </section>
      )}
      {crew.length > 0 && (
        <section className={s.group}>
          <h3 className={s.title}>{t('crew')}</h3>
          <CrewUsage crew={crew} />
        </section>
      )}
    </div>
  );
};
