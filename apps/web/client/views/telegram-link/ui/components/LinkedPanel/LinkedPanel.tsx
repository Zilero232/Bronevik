'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, buttonVariants, Card, CardBody, ConfirmDialog } from '@/ui-kit';

import type { LinkedPanelProps } from './LinkedPanel.types';

import { botLink } from '../../../lib/bot-link';
import { useUnlinkDialog } from '../../../model/hooks';
import { BotCommands } from '../BotCommands';

import s from './LinkedPanel.module.scss';

export const LinkedPanel = ({ username, botUsername }: LinkedPanelProps) => {
  const t = useTranslations('telegram.linked');
  const tUnlink = useTranslations('telegram.unlink');
  const { isOpen, onOpenChange, onConfirm, isPending } = useUnlinkDialog();

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
            <ConfirmDialog
              cancelLabel={tUnlink('cancel')}
              confirmLabel={tUnlink('confirm')}
              description={tUnlink('description')}
              isPending={isPending}
              open={isOpen}
              title={tUnlink('title')}
              tone='danger'
              trigger={<Button variant='ghost'>{tUnlink('trigger')}</Button>}
              onConfirm={onConfirm}
              onOpenChange={onOpenChange}
            />
          </div>
        </CardBody>
      </Card>
      <BotCommands botUsername={botUsername} />
    </section>
  );
};
