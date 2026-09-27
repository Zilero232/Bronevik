'use client';

import { ArrowRight, Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import { MeCard } from '../MeCard';

import s from './NotificationsCard.module.scss';

export const NotificationsCard = () => {
  const t = useTranslations('me.notifications');
  const tDashboard = useTranslations('notifications.dashboard');

  return (
    <MeCard description={tDashboard('description')} icon={<Bell size={18} />} title={t('title')}>
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm', className: s.link })} href={ROUTES.account.notifications}>
        {tDashboard('open')}
        <ArrowRight size={15} />
      </Link>
    </MeCard>
  );
};
