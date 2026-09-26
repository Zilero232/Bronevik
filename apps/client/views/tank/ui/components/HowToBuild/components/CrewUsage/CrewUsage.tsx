'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { GameIcon, gameLabel } from '@/entities/tank/build';
import { percentText } from '@/shared/lib';
import { ProgressBar } from '@/ui-kit';

import type { CrewUsageProps } from './CrewUsage.types';

import { HOW_TO_BUILD } from '../../../../../config';

import s from './CrewUsage.module.scss';

export const CrewUsage = ({ crew }: CrewUsageProps) => {
  const t = useTranslations('builds.panels.crew.roles');
  const format = useFormatter();

  return (
    <div className={s.root}>
      {crew.map(({ role, skills }) => (
        <div key={role} className={s.role}>
          <h4 className={s.title}>{t(role)}</h4>
          <ol className={s.list}>
            {skills.map(({ skill, name, image, share }) => (
              <li key={skill} className={s.row}>
                <GameIcon size={HOW_TO_BUILD.iconSize} src={image} />
                <ProgressBar
                  className={s.bar}
                  label={gameLabel(name)}
                  size='sm'
                  tone='steel'
                  value={share * 100}
                  valueLabel={percentText({ format, value: share * 100, digits: 0 })}
                />
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
};
