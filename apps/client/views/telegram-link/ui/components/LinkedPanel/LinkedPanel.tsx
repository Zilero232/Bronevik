'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { buttonVariants, Card, CardBody } from '@/ui-kit';

import type { LinkedPanelProps } from './LinkedPanel.types';

import { botLink } from '../../../lib/bot-link';
import { BotCommands } from '../BotCommands';
import { UnlinkDialog } from '../UnlinkDialog';

import s from './LinkedPanel.module.scss';

export const LinkedPanel = ({ username, botUsername }: LinkedPanelProps) => {
  const t = useTranslations('telegram.linked');

  return (
    <section className={s.root}>
      <Card>
        <CardBody className={s.body}>
          <div className={s.identity}>
            <span className={s.status}>{t('status')}</span>
            <strong className={s.username}>{username ? `@${username}` : t('anonymous')}</strong>
            <p className={s.description}>{t('description')}</p>
          </div>
          <div className={s.actions}>
            <a className={buttonVariants({ variant: 'secondary' })} href={botLink({ username: botUsername })} rel='noreferrer' target='_blank'>
              {t('openBot')}
              <ExternalLink size={14} />
            </a>
            <UnlinkDialog />
          </div>
        </CardBody>
      </Card>
      <BotCommands botUsername={botUsername} />
    </section>
  );
};
