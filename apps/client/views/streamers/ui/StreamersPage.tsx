'use client';

import { ArrowDown, MonitorPlay } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { buttonVariants, PageHero } from '@/ui-kit';

import { LANDING_ANCHORS } from '../config';
import { ConnectBand, FlowSection, StreamersCta, StudioLink, ToolsSection } from './components';

import s from './StreamersPage.module.scss';

export const StreamersPage = () => {
  const t = useTranslations('streamers.hero');

  return (
    <div className={s.root}>
      <PageHero
        actions={
          <>
            <StudioLink />
            <a className={buttonVariants({ variant: 'ghost', size: 'lg' })} href={`#${LANDING_ANCHORS.flow}`}>
              {t('ctaHow')}
              <ArrowDown aria-hidden size={16} />
            </a>
          </>
        }
        art={{ kind: 'emblem', glyph: <MonitorPlay size={480} strokeWidth={1.25} /> }}
        breadcrumbs={[{ label: t('home'), href: ROUTES.home }, { label: t('crumb') }]}
        eyebrow={t('eyebrow')}
        lead={t('lead')}
        title={t('pageTitle')}
      />
      <ToolsSection />
      <ConnectBand />
      <FlowSection />
      <StreamersCta />
    </div>
  );
};
