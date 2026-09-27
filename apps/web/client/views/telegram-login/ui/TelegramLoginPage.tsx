'use client';

import { useTranslations } from 'next-intl';

import { Card, CardBody } from '@/ui-kit';

import { WEB_LOGIN } from '../config';
import { useWebLogin } from '../model/hooks';
import { LoginActions } from './components';

import s from './TelegramLoginPage.module.scss';

export const TelegramLoginPage = () => {
  const t = useTranslations('telegram.webLogin');
  const { phase, tone, replacedAccount, confirm } = useWebLogin();

  return (
    <div className={s.root}>
      <Card aria-live='polite' className={s.panel} data-tone={tone}>
        <CardBody className={s.body}>
          <span className={s.label}>{t('label')}</span>
          <h1 className={s.title}>{t(`phases.${phase}.title`)}</h1>
          <p className={s.description}>{t(`phases.${phase}.description`, { command: WEB_LOGIN.botCommand })}</p>
          {replacedAccount !== null && <p className={s.description}>{t('replaceSession', { name: replacedAccount })}</p>}
          <LoginActions phase={phase} replacesSession={replacedAccount !== null} onConfirm={confirm} />
        </CardBody>
      </Card>
    </div>
  );
};
