'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Skeleton, Switch } from '@/ui-kit';

import { CODE_ALERT } from '../../../config';
import { useCodeAlert } from '../../../model/hooks';

import s from './CodeAlert.module.scss';

export const CodeAlert = () => {
  const t = useTranslations('codes.alert');
  const { isSignedIn, isOn, isPending, onToggle } = useCodeAlert();

  if (isPending) {
    return <Skeleton height={CODE_ALERT.skeletonHeight} shape='block' width={CODE_ALERT.skeletonWidth} />;
  }

  if (!isSignedIn) {
    return (
      <p className={s.root}>
        <Link className={s.link} href={ROUTES.auth.login}>
          {t('signIn')}
        </Link>
        <span className={s.hint}>{t('signInHint')}</span>
      </p>
    );
  }

  return (
    <div className={s.root}>
      <Switch checked={isOn} label={t('label')} onCheckedChange={onToggle} />
      <Link className={s.hint} href={ROUTES.account.notifications}>
        {t('channels')}
      </Link>
    </div>
  );
};
