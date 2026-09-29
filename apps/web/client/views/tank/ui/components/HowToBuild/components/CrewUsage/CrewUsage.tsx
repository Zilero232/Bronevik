'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { percentText } from '@/shared/lib';

import type { CrewUsageProps } from './CrewUsage.types';

import { UsageList } from '../UsageList';
import { UsageRow } from '../UsageRow';

import s from './CrewUsage.module.scss';

export const CrewUsage = ({ crew }: CrewUsageProps) => {
  const t = useTranslations('builds.panels.crew.roles');
  const format = useFormatter();

  return (
    <div className={s.root}>
      {crew.map(({ role, skills }) => (
        <UsageList key={role} title={t(role)}>
          {skills.map(({ skill, name, image, share }) => (
            <UsageRow
              key={skill}
              image={image}
              kind='skill'
              label={name}
              share={share}
              tone='steel'
              valueLabel={percentText({ format, value: share * 100, digits: 0 })}
            />
          ))}
        </UsageList>
      ))}
    </div>
  );
};
