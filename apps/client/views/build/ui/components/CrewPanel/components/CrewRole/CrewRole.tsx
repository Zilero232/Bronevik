'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { GameIcon } from '@/entities/tank/build';

import type { CrewRoleProps } from './CrewRole.types';

import { BUILD_VIEW } from '../../../../../config';
import { useCrewRole } from '../../../../../model/hooks';

import s from './CrewRole.module.scss';

export const CrewRole = ({ role }: CrewRoleProps) => {
  const t = useTranslations('builds.panels.crew');
  const { skills, count, max, isFull, onToggle } = useCrewRole({ role });
  const headingId = useId();

  return (
    <div aria-labelledby={headingId} className={s.root} role='group'>
      <div className={s.head}>
        <h3 className={s.title} id={headingId}>
          {t(`roles.${role}`)}
        </h3>
        <span className={s.counter} data-full={isFull} title={isFull ? t('full') : undefined}>
          {t('counter', { count, max })}
        </span>
      </div>
      <div className={s.chips}>
        {skills.map(({ id, name, image, isOn }) => (
          <button key={id} aria-pressed={isOn} className={s.chip} disabled={!isOn && isFull} title={name} type='button' onClick={onToggle(id)}>
            <GameIcon kind='skill' size={BUILD_VIEW.iconSize.skill} src={image} />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};
