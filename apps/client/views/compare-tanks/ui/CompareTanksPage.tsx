'use client';

import { useCompareIds } from '../model/hooks';
import { CompareBoard, CompareHero, ComparePresets } from './components';

import s from './CompareTanksPage.module.scss';

export const CompareTanksPage = () => {
  const { ids } = useCompareIds();

  return (
    <div className={s.root}>
      <CompareHero />
      {ids.length > 0 ? <CompareBoard /> : <ComparePresets />}
    </div>
  );
};
