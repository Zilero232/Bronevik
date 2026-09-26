'use client';

import { useTranslations } from 'next-intl';

import type { TopPodiumProps } from './TopPodium.types';

import { PodiumCard } from './components';

import s from './TopPodium.module.scss';

export const TopPodium = ({ entries, filter }: TopPodiumProps) => {
  const t = useTranslations('top.podium');

  return (
    <section aria-label={t('title')} className={s.root}>
      <ol className={s.list}>
        {entries.map((entry) => (
          <PodiumCard key={`${entry.rank}-${entry.name}`} entry={entry} filter={filter} />
        ))}
      </ol>
    </section>
  );
};
