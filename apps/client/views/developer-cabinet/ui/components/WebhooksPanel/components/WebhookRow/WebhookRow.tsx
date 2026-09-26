'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { History, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { updateWebhook } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';
import { Badge, Button, IconButton, Switch } from '@/ui-kit';

import type { WebhookRowProps } from './WebhookRow.types';

import { WEBHOOK_STATUS_TONE } from '../../../../../config';
import { webhookStatus } from '../../../../../lib/webhook-status';
import { useDeveloperMutation } from '../../../../../model/hooks';
import { DeliveriesLog } from '../../../DeliveriesLog';
import { TimeAgo } from '../../../TimeAgo';

import s from './WebhookRow.module.scss';

export const WebhookRow = ({ endpoint, onEdit, onDelete }: WebhookRowProps) => {
  const t = useTranslations('developer.webhooks');
  const update = useDeveloperMutation({ mutationFn: updateWebhook, invalidates: [QUERY_KEYS.me.developer.webhooks], successKey: 'webhookUpdated' });
  const [isLogOpen, toggleLog] = useBoolean(false);

  const { id, url, events, filter, isActive, failureCount, disabledAt } = endpoint;
  const status = webhookStatus(endpoint);

  return (
    <li className={s.root} data-status={status}>
      <div className={s.main}>
        <div className={s.top}>
          <Badge tone={WEBHOOK_STATUS_TONE[status]}>{t(`status.${status}`)}</Badge>
          <code className={s.url}>{url}</code>
        </div>
        <div className={s.meta}>
          {events.map((event) => (
            <span key={event} className={s.event}>
              {event}
            </span>
          ))}
          <span className={s.filter}>{t('filterSummary', { players: filter.accountIds?.length ?? 0, clans: filter.clanIds?.length ?? 0 })}</span>
          {failureCount > 0 && <span className={s.failures}>{t('failures', { count: failureCount })}</span>}
          {status === 'disabled' && (
            <span className={s.failures}>
              {t('disabledAt')} <TimeAgo value={disabledAt} />
            </span>
          )}
        </div>
      </div>
      <div className={s.actions}>
        <Switch checked={isActive} label={t('active')} onCheckedChange={(checked) => update.mutate({ id, isActive: checked })} />
        <Button aria-expanded={isLogOpen} size='sm' variant='ghost' onClick={() => toggleLog()}>
          <History size={15} />
          {t('deliveries')}
        </Button>
        <IconButton aria-label={t('edit')} variant='outline' onClick={() => onEdit(endpoint)}>
          <Pencil size={15} />
        </IconButton>
        <IconButton aria-label={t('delete')} className={s.delete} variant='outline' onClick={() => onDelete(endpoint)}>
          <Trash2 size={15} />
        </IconButton>
      </div>
      {isLogOpen && <DeliveriesLog webhookId={id} />}
    </li>
  );
};
