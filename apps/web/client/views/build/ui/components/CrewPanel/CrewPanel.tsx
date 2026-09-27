'use client';

import { useTranslations } from 'next-intl';

import { BUILD_VIEW } from '../../../config';
import { useBuildContext } from '../../../model/context';
import { PanelCard } from '../PanelCard';
import { CrewRole } from './components';

import s from './CrewPanel.module.scss';

export const CrewPanel = () => {
  const t = useTranslations('builds.panels.crew');
  const { catalog } = useBuildContext();

  return (
    <PanelCard description={t('description', { max: BUILD_VIEW.maxSkillsPerRole })} title={t('title')}>
      <div className={s.roles}>
        {catalog.crewRoles.map((role) => (
          <CrewRole key={role} role={role} />
        ))}
      </div>
    </PanelCard>
  );
};
