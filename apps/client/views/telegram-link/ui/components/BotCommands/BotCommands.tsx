'use client';

import { AtSign, BellRing, Settings2, Terminal } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { BotCommandsProps } from './BotCommands.types';

import { BOT_FEATURES } from '../../../config';
import { botName } from '../../../lib/bot-link';

import s from './BotCommands.module.scss';

export const BotCommands = ({ botUsername }: BotCommandsProps) => {
  const t = useTranslations('telegram.commands');

  return (
    <div className={s.root}>
      <section className={s.panel}>
        <h3 className={s.heading}>
          <Terminal size={16} />
          {t('title')}
        </h3>
        <ul className={s.commands}>
          {BOT_FEATURES.commands.map((command) => (
            <li key={command} className={s.command}>
              <code className={s.name}>/{command}</code>
              <span className={s.hint}>{t(`list.${command}`)}</span>
            </li>
          ))}
          <li className={s.command}>
            <code className={s.name}>
              <AtSign size={12} />
              {botName(botUsername)}
            </code>
            <span className={s.hint}>{t('inline')}</span>
          </li>
        </ul>
      </section>
      <section className={s.panel}>
        <h3 className={s.heading}>
          <BellRing size={16} />
          {t('alertsTitle')}
        </h3>
        <ul className={s.alerts}>
          {BOT_FEATURES.alerts.map((alert) => (
            <li key={alert} className={s.alert}>
              {t(`alerts.${alert}`)}
            </li>
          ))}
        </ul>
        <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.notifications}>
          <Settings2 size={14} />
          {t('settings')}
        </Link>
      </section>
    </div>
  );
};
