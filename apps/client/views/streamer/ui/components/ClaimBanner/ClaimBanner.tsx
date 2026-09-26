'use client';

import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { ClaimBannerProps } from './ClaimBanner.types';

import { STREAMER_PAGE } from '../../../config';
import { RemovalDialog } from './components';

import s from './ClaimBanner.module.scss';

export const ClaimBanner = ({ slug }: ClaimBannerProps) => {
  const t = useTranslations('streamersDirectory.public.claim');
  const [isRemovalOpen, setIsRemovalOpen] = useState(false);

  return (
    <section className={s.root}>
      <div className={s.text}>
        <strong className={s.title}>{t('title')}</strong>
        <p className={s.description}>{t('description')}</p>
      </div>
      <div className={s.actions}>
        <Link className={buttonVariants({ size: 'sm' })} href={ROUTES.streamers.claim(slug)}>
          {t('action')}
          <ArrowRight size={STREAMER_PAGE.iconSize} />
        </Link>
        <Button size='sm' variant='ghost' onClick={() => setIsRemovalOpen(true)}>
          {t('remove')}
        </Button>
      </div>
      <RemovalDialog open={isRemovalOpen} slug={slug} onOpenChange={setIsRemovalOpen} />
    </section>
  );
};
