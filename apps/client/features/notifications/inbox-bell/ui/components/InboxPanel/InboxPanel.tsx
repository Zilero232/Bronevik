'use client';

import type { InboxItem } from '@bronevik/schemas';

import { ArrowRight, CheckCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useMarkInboxRead } from '@/entities/notification/inbox';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button } from '@/ui-kit';

import type { InboxPanelProps } from './InboxPanel.types';

import { InboxPanelList } from '../InboxPanelList';

import s from './InboxPanel.module.scss';

export const InboxPanel = ({ page, isPending, isError, onClose }: InboxPanelProps) => {
  const t = useTranslations('inbox');
  const markRead = useMarkInboxRead();

  const unread = page?.unread ?? 0;

  const onSelect = ({ id, url, readAt }: InboxItem) => {
    if (readAt === null) {
      markRead.mutate({ ids: [id] });
    }

    if (url) {
      onClose();
    }
  };

  return (
    <div className={s.root}>
      <header className={s.head}>
        <div className={s.heading}>
          <span className={s.eyebrow}>{t('eyebrow')}</span>
          <h2 className={s.title}>
            {t('title')}
            {unread > 0 && <span className={s.count}>{unread}</span>}
          </h2>
        </div>
        <Button disabled={unread === 0} size='sm' variant='ghost' onClick={() => markRead.mutate({})}>
          <CheckCheck size={15} />
          {t('markAll')}
        </Button>
      </header>
      <InboxPanelList isError={isError} isPending={isPending} items={page?.items ?? []} onSelect={onSelect} />
      <Link className={s.footer} href={ROUTES.account.notifications} onClick={onClose}>
        {t('viewAll')}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
};
