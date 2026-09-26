'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { Badge, Button, RelativeTime } from '@/ui-kit';

import type { OrderRowProps } from './OrderRow.types';

import { useOrderRow } from '../../../../../model/hooks';
import { OrderReview } from './components';

import s from './OrderRow.module.scss';

export const OrderRow = ({ order, coachName }: OrderRowProps) => {
  const t = useTranslations('coaching.orders');
  const { role, canAccept, canComplete, canCancel, canReview, coachHref, isDecline, isBusy, onAccept, onComplete, onCancel } = useOrderRow(order);

  return (
    <article className={s.root}>
      <header className={s.head}>
        <Badge tone={role === 'coach' ? 'accent' : 'steel'}>{t(`role.${role}`)}</Badge>
        {role === 'student' ? (
          <Link className={s.who} href={coachHref}>
            {coachName ?? t('coach')}
          </Link>
        ) : (
          <span className={s.who}>{t('student')}</span>
        )}
        <span className={s.status} data-status={order.status}>
          {t(`status.${order.status}`)}
        </span>
      </header>
      <p className={s.meta}>
        <RelativeTime value={order.createdAt} />
        {order.score !== null && ` · ${t('score', { score: order.score })}`}
      </p>
      {order.notes && <p className={s.notes}>{order.notes}</p>}
      {role === 'coach' && order.studentContact && (
        <p className={s.contact}>
          {t('studentContact')}: <strong>{order.studentContact}</strong>
        </p>
      )}
      {(canAccept || canComplete || canCancel) && (
        <div className={s.actions}>
          {canAccept && (
            <Button disabled={isBusy} size='sm' onClick={onAccept}>
              {t('accept')}
            </Button>
          )}
          {canComplete && (
            <Button disabled={isBusy} size='sm' onClick={onComplete}>
              {t('complete')}
            </Button>
          )}
          {canCancel && (
            <Button disabled={isBusy} size='sm' variant='ghost' onClick={onCancel}>
              {isDecline ? t('decline') : t('cancel')}
            </Button>
          )}
        </div>
      )}
      {canReview && <OrderReview order={order} />}
    </article>
  );
};
