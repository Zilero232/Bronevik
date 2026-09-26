'use client';

import { useTranslations } from 'next-intl';

import { EXTERNAL_LINKS } from '@/shared/config';

import type { ArmorAttributionProps } from './ArmorAttribution.types';

import { ARMOR_SOURCE } from '../../../config';

import s from './ArmorAttribution.module.scss';

export const ArmorAttribution = ({ commit }: ArmorAttributionProps) => {
  const t = useTranslations('armor.attribution');

  return (
    <aside className={s.root} data-testid='armor-attribution'>
      <p>
        {t('lesta')}{' '}
        <a href={EXTERNAL_LINKS.game} rel='noreferrer' target='_blank'>
          {t('site')}
        </a>
      </p>
      <p>
        {t.rich('geometry', {
          repo: ARMOR_SOURCE.repo,
          commit: commit ? commit.slice(0, ARMOR_SOURCE.shortCommit) : '—',
          link: (chunks) => (
            <a href={ARMOR_SOURCE.url} rel='noreferrer' target='_blank'>
              {chunks}
            </a>
          )
        })}
      </p>
      <p className={s.note}>{t('note')}</p>
    </aside>
  );
};
