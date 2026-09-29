'use client';

import { useTranslations } from 'next-intl';

import { useLoginHref } from '@/entities/auth/session';
import { Link } from '@/shared/i18n/navigation';
import { EventAlert } from '@/widgets/notifications/event-alert';

import { CODE_ALERT } from '../../../config';

import s from './CodeAlert.module.scss';

export const CodeAlert = () => {
  const loginHref = useLoginHref();
  const t = useTranslations('codes.alert');

  return (
    <EventAlert
      signedOut={
        <p className={s.root}>
          <Link className={s.link} href={loginHref}>
            {t('signIn')}
          </Link>
          <span className={s.hint}>{t('signInHint')}</span>
        </p>
      }
      channels={t('channels')}
      event={CODE_ALERT.event}
      label={t('label')}
      messages={{ enabled: t('enabled'), disabled: t('disabled'), failed: t('failed') }}
      skeleton={CODE_ALERT.skeleton}
    />
  );
};
