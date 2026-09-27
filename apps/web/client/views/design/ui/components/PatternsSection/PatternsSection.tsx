'use client';

import { Gift, Newspaper, Target, Trophy, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { ActionStrip, Badge, Button, MediaCard, SectionHeader, Tabs, Timeline } from '@/ui-kit';

import { PATTERN_SPECIMENS } from '../../../config';
import { DesignBlock } from '../DesignBlock';
import { DesignRow } from '../DesignRow';

import s from './PatternsSection.module.scss';

export const PatternsSection = () => {
  const t = useTranslations('design.patterns');

  return (
    <DesignBlock id='patterns' title={t('title')}>
      <DesignRow className={s.wide} label={t('actionStrip')}>
        <ActionStrip
          links={[
            { id: 'marks', href: ROUTES.marks, label: t('links.marks'), icon: <Target /> },
            { id: 'builds', href: ROUTES.builds.list, label: t('links.builds'), icon: <Wrench /> },
            { id: 'codes', href: ROUTES.codes, label: t('links.codes'), icon: <Gift /> },
            { id: 'top', href: ROUTES.top, label: t('links.top'), icon: <Trophy /> }
          ]}
          className={s.wide}
          end={<Button size='sm'>{t('cta')}</Button>}
        />
      </DesignRow>
      <DesignRow className={s.wide} label={t('sectionHeader')}>
        <SectionHeader
          action={<Badge tone='accent'>{t('badge')}</Badge>}
          className={s.wide}
          count={4}
          meta={t('meta')}
          more={{ href: ROUTES.marks, label: t('more') }}
          title={t('headerTitle')}
          variant='display'
        />
      </DesignRow>
      <DesignRow className={s.wide} label={t('tabs')}>
        <Tabs
          items={[
            { value: 'overview', label: t('tabItems.overview'), content: <p className={s.panel}>{t('tabBody.overview')}</p> },
            { value: 'marks', label: t('tabItems.marks'), content: <p className={s.panel}>{t('tabBody.marks')}</p> },
            { value: 'history', label: t('tabItems.history'), content: <p className={s.panel}>{t('tabBody.history')}</p> }
          ]}
          aria-label={t('tabs')}
          className={s.wide}
          variant='sticky'
        />
      </DesignRow>
      <DesignRow className={s.timelines} label={t('timeline')}>
        <Timeline className={s.timeline} items={PATTERN_SPECIMENS.timeline.map(({ id, tone }) => ({ id, tone, content: t(`events.${id}`) }))} />
        <Timeline
          items={PATTERN_SPECIMENS.timeline.map(({ id, tone }, index) => ({
            id,
            tone,
            isCurrent: index === 0,
            date: t(`dates.${id}`),
            content: t(`events.${id}`)
          }))}
          className={s.timeline}
          variant='card'
        />
      </DesignRow>
      <DesignRow label={t('ribbons')}>
        {PATTERN_SPECIMENS.ribbons.map(({ id, shape, tone, caption }) => (
          <div key={id} className={s.ribbonCard}>
            <Badge shape={shape} tone={tone}>
              {t(id)}
            </Badge>
            {t(caption)}
          </div>
        ))}
      </DesignRow>
      <DesignRow label={t('mediaCard')}>
        <div className={s.media}>
          <MediaCard
            body={t('mediaBody')}
            media={<Newspaper className={s.mediaGlyph} size={120} strokeWidth={1} />}
            sub={t('mediaSub')}
            title={t('mediaTitle')}
          />
        </div>
      </DesignRow>
    </DesignBlock>
  );
};
