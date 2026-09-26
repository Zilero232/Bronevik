'use client';

import { useTranslations } from 'next-intl';

import { PlusTeaser } from '@/features/plus/plus-gate';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Skeleton, Switch } from '@/ui-kit';

import { RETURN_ALERT } from '../../../../../config';
import { useReturnAlert } from '../../../../../model/hooks';

import s from './ReturnAlert.module.scss';

export const ReturnAlert = () => {
  const t = useTranslations('tank.obtain.returnAlert');
  const { isVisible, isSignedIn, isPlus, isOn, isPending, onToggle } = useReturnAlert();

  if (!isVisible) {
    return null;
  }

  if (isPending) {
    return <Skeleton height={RETURN_ALERT.skeletonHeight} shape='block' />;
  }

  if (!isSignedIn) {
    return (
      <p className={s.root}>
        <Link className={s.link} href={ROUTES.auth.login}>
          {t('signIn')}
        </Link>
      </p>
    );
  }

  if (!isPlus) {
    return <PlusTeaser feature={RETURN_ALERT.feature} />;
  }

  return (
    <div className={s.root}>
      <Switch checked={isOn} description={t('hint')} label={t('label')} onCheckedChange={onToggle} />
    </div>
  );
};
