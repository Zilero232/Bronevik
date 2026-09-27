'use client';

import { useTranslations } from 'next-intl';

import { Button, Select, Textarea } from '@/ui-kit';

import type { OrderReviewProps } from './OrderReview.types';

import { COACHING_ORDERS } from '../../../../../config';
import { useOrderReview } from '../../../../../model/hooks';

import s from './OrderReview.module.scss';

export const OrderReview = ({ order }: OrderReviewProps) => {
  const t = useTranslations('coaching.orders');
  const { score, review, isBusy, onScoreChange, onReviewChange, onReview } = useOrderReview(order);

  return (
    <div className={s.root}>
      <Select
        items={COACHING_ORDERS.scores.map((value) => ({ value, label: t('score', { score: value }) }))}
        label={t('reviewScore')}
        value={score}
        onValueChange={onScoreChange}
      />
      <Textarea
        aria-label={t('reviewPlaceholder')}
        placeholder={t('reviewPlaceholder')}
        rows={COACHING_ORDERS.reviewRows}
        value={review}
        onChange={(event) => onReviewChange(event.target.value)}
      />
      <Button disabled={isBusy} size='sm' onClick={onReview}>
        {t('sendReview')}
      </Button>
    </div>
  );
};
