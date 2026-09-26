import { useTranslations } from 'next-intl';

import { Card } from '@/ui-kit';

import { DesignRow } from '../../../DesignRow';

import s from './SurfacesRow.module.scss';

export const SurfacesRow = () => {
  const t = useTranslations('design.icons');

  return (
    <DesignRow label={t('groups.surfaces')}>
      <Card className={s.surface}>
        <span className={s.name}>{t('panel')}</span>
      </Card>
      <span className={s.divider} />
    </DesignRow>
  );
};
