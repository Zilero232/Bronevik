'use client';

import { useTranslations } from 'next-intl';

import { serializeLoadout } from '@/entities/tank/build';
import { Button, SegmentedControl, Switch } from '@/ui-kit';

import type { BuildSide } from '../../../lib/stat-diff';

import { BUILD_VIEW } from '../../../config';
import { useBuildContext } from '../../../model/context';

import s from './LoadoutBar.module.scss';

export const LoadoutBar = () => {
  const t = useTranslations('builds.loadout');
  const { active, side, isCompare, setSide, setCompare, copyAToB, resetActive } = useBuildContext();

  return (
    <div className={s.root}>
      <Switch checked={isCompare} className={s.compare} description={t('compareHint')} label={t('compare')} onCheckedChange={setCompare} />
      {isCompare && (
        <div className={s.sides}>
          <SegmentedControl<BuildSide>
            aria-label={t('label')}
            options={BUILD_VIEW.sides.map((value) => ({ value, label: t(value) }))}
            value={side}
            onChange={setSide}
          />
          <Button size='sm' variant='ghost' onClick={copyAToB}>
            {t('copy')}
          </Button>
        </div>
      )}
      <div className={s.tail}>
        <code className={s.code} title={t('code')}>
          <span className={s.codeSide}>{side.toUpperCase()}</span>
          {serializeLoadout(active)}
        </code>
        <Button size='sm' title={t('resetHint')} variant='ghost' onClick={resetActive}>
          {t('reset')}
        </Button>
      </div>
    </div>
  );
};
