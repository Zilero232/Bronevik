'use client';

import { Popover } from '@base-ui/react/popover';
import { CheckCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { InboxHeader } from '@/entities/notification/inbox';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button } from '@/ui-kit';

import { useInboxPanel } from '../../../model/hooks';
import { InboxPanelList } from '../InboxPanelList';

import s from './InboxPanel.module.scss';

export const InboxPanel = () => {
  const t = useTranslations('inbox');
  const { unread, onMarkAll } = useInboxPanel();

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
      <InboxPanelList />
      <Popover.Close nativeButton={false} render={<Link className={s.footer} href={ROUTES.account.notifications} />}>
        {t('viewAll')}
      </Popover.Close>
    </div>
  );
};
