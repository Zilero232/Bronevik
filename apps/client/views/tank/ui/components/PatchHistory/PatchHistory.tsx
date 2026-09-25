'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { SectionHeader, Skeleton } from '@/ui-kit';

import { TANK_PAGE, TANK_SECTIONS } from '../../../config';
import { patchEntries } from '../../../lib';
import { useTankPatches } from '../../../model/hooks';
import { RevealSection } from '../RevealSection';
import { SectionNotice } from '../SectionNotice';
import { PatchEntryCard } from './components';

import s from './PatchHistory.module.scss';

export const PatchHistory = () => {
  const t = useTranslations('tank.patches');
  const { data: patches, isPending, isError } = useTankPatches();

  return (
    <RevealSection id={TANK_SECTIONS.patches}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// 05' title={t('title')} />
      {match({ list: patches ?? [], isPending, isError })
        .with({ isPending: true }, () => (
          <div className={s.skeleton}>
            {Array.from({ length: TANK_PAGE.skeletonRows - 2 }, (_, index) => (
              <Skeleton key={index} height={120} shape='block' width='100%' />
            ))}
          </div>
        ))
        .with({ isError: true }, () => <SectionNotice kind='error' />)
        .with({ list: [] }, () => <SectionNotice description={t('emptyDescription')} kind='empty' title={t('emptyTitle')} />)
        .otherwise(({ list }) => (
          <ol className={s.timeline}>
            {patchEntries(list).map((entry, index) => (
              <PatchEntryCard key={entry.version} entry={entry} index={index} />
            ))}
          </ol>
        ))}
    </RevealSection>
  );
};
