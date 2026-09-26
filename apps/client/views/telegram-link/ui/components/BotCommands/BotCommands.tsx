'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardBody, CardHeader } from '@/ui-kit';

import type { BotCommandsProps } from './BotCommands.types';

import { BOT_FEATURES } from '../../../config';
import { botName } from '../../../lib/bot-link';

import s from './BotCommands.module.scss';

export const BotCommands = ({ botUsername }: BotCommandsProps) => {
  const t = useTranslations('telegram.commands');

  return (
    <div className={s.root}>
      <Card>
        <CardHeader title={t('title')} />
        <CardBody>
          <ul className={s.commands}>
            {BOT_FEATURES.commands.map((command) => (
              <li key={command} className={s.command}>
                <code className={s.name}>/{command}</code>
                <span className={s.hint}>{t(`list.${command}`)}</span>
              </li>
            ))}
            <li className={s.command}>
              <code className={s.name}>@{botName(botUsername)}</code>
              <span className={s.hint}>{t('inline')}</span>
            </li>
          </ul>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title={t('alertsTitle')} />
        <CardBody className={s.alertsBody}>
          <ul className={s.alerts}>
            {BOT_FEATURES.alerts.map((alert) => (
              <li key={alert}>{t(`alerts.${alert}`)}</li>
            ))}
          </ul>
          <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.notifications}>
            {t('settings')}
          </Link>
        </CardBody>
      </Card>
    </div>
  );
};
