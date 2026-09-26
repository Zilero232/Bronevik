'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import { useStreamerProfile } from '../../../model/hooks';

import s from './StudioHeader.module.scss';

export const StudioHeader = () => {
  const t = useTranslations('streamer.studio');
  const { data: profile } = useStreamerProfile();

  return (
    <header className={s.root}>
      <div className={s.text}>
        <h1 className={s.title}>{t('title')}</h1>
        <p className={s.lead}>{t('lead')}</p>
      </div>
      {profile && (
        <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.streamers.profile(profile.slug)}>
          <ExternalLink size={14} />
          {t('openPublic')}
        </Link>
      )}
    </header>
  );
};
