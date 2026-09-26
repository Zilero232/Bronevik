'use client';

import { CheckCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { InboxHeader } from '@/entities/notification/inbox';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button } from '@/ui-kit';

import type { InboxPanelProps } from './InboxPanel.types';

import { useInboxPanel } from '../../../model/hooks';
import { InboxPanelList } from '../InboxPanelList';

import s from './InboxPanel.module.scss';

export const InboxPanel = ({ page, isPending, isError, isRetrying, onClose, onRetry }: InboxPanelProps) => {
  const t = useTranslations('inbox');
  const { unread, items, onSelect, onMarkAll } = useInboxPanel({ page, onClose });

  return (
    <div className={s.root}>
      <InboxHeader
        actions={
          <Button disabled={unread === 0} size='sm' variant='ghost' onClick={onMarkAll}>
            <CheckCheck size={14} />
            {t('markAll')}
          </Button>
        }
        count={unread}
        title={t('title')}
      />
      <InboxPanelList isError={isError} isPending={isPending} isRetrying={isRetrying} items={items} onRetry={onRetry} onSelect={onSelect} />
      <Link className={s.footer} href={ROUTES.account.notifications} onClick={onClose}>
        {t('viewAll')}
      </Link>
    </div>
  );
};
