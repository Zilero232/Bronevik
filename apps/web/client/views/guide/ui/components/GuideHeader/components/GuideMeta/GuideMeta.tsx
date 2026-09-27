'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { GuideSubject } from '@/features/community/guide-meta';
import { Avatar } from '@/ui-kit';

import { useGuide } from '../../../../../model/context';

import s from './GuideMeta.module.scss';

export const GuideMeta = () => {
  const t = useTranslations('guides');
  const guide = useGuide();
  const format = useFormatter();

  return (
    <dl className={s.root}>
      <div className={s.item}>
        <dt className={s.label}>{t('detail.author')}</dt>
        <dd className={s.author}>
          <Avatar name={guide.author.name} size='sm' src={guide.author.image ?? undefined} />
          {guide.author.name}
        </dd>
      </div>
      <div className={s.item}>
        <dt className={s.label}>{t('detail.kind')}</dt>
        <dd className={s.value}>{t(`kinds.${guide.kind}`)}</dd>
      </div>
      {(guide.tankId !== null || guide.arenaId !== null) && (
        <div className={s.item}>
          <dt className={s.label}>{guide.tankId === null ? t('detail.map') : t('detail.tank')}</dt>
          <dd className={s.value}>
            <GuideSubject arenaId={guide.arenaId} tankId={guide.tankId} />
          </dd>
        </div>
      )}
      <div className={s.item}>
        <dt className={s.label}>{guide.publishedAt ? t('detail.published') : t('detail.created')}</dt>
        <dd className={s.value}>{format.dateTime(new Date(guide.publishedAt ?? guide.createdAt), { dateStyle: 'medium' })}</dd>
      </div>
      {guide.updatedAt !== guide.createdAt && (
        <div className={s.item}>
          <dt className={s.label}>{t('detail.updated')}</dt>
          <dd className={s.value}>{format.dateTime(new Date(guide.updatedAt), { dateStyle: 'medium' })}</dd>
        </div>
      )}
      <div className={s.item}>
        <dt className={s.label}>{t('detail.language')}</dt>
        <dd className={s.value}>{t(`locales.${guide.locale === 'en' ? 'en' : 'ru'}`)}</dd>
      </div>
    </dl>
  );
};
