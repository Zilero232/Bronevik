'use client';

import { CREW_ROLE_ICONS, isCrewRole } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { SkillRow } from '@/entities/tank/build';
import { EmptyState } from '@/ui-kit';

import { useShowcaseCrew } from '../../../../../model/hooks';

import s from './CrewBand.module.scss';

export const CrewBand = () => {
  const t = useTranslations('builds.showcase.crew');
  const tRoles = useTranslations('builds.panels.crew.roles');
  const { columns, isShares } = useShowcaseCrew();

  if (columns.length === 0) {
    return <EmptyState title={t('empty')} />;
  }

  return (
    <section aria-label={t('title')} className={s.root} data-theme='dark'>
      <div className={s.columns}>
        {columns.map(({ role, skills }) => {
          const Icon = isCrewRole(role) ? CREW_ROLE_ICONS[role] : null;

          return (
            <div key={role} className={s.column}>
              <h3 className={s.role}>
                {Icon && (
                  <span aria-hidden className={s.icon}>
                    <Icon size={28} strokeWidth={1.5} />
                  </span>
                )}
                {isCrewRole(role) ? tRoles(role) : role}
              </h3>
              <ol className={s.skills}>
                {skills.map((skill, index) => (
                  <SkillRow key={skill.skill} image={skill.image} index={index + 1} name={skill.name} share={isShares ? skill.share : null} />
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
};
