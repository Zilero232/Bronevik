'use client';

import { AlertTriangle, Gauge, Send, Timer } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { KeyFigure, ProgressBar } from '@/ui-kit';

import type { UsageTodayProps } from './UsageToday.types';

import { quotaShare, quotaTone, usageSeries } from '../../../../../lib/usage-stats';

import s from './UsageToday.module.scss';

export const UsageToday = ({ usage }: UsageTodayProps) => {
  const t = useTranslations('developer.usage.today');
  const format = useFormatter();

  const { today, limits, history } = usage;
  const { requests, errors } = usageSeries(history);
  const share = quotaShare({ used: today.requests, limit: limits.requestsPerDay });
  const errorShare = today.requests > 0 ? today.errors / today.requests : 0;

  return (
    <div className={s.root}>
      <div className={s.tiles}>
        <KeyFigure isFramed icon={<Send size={16} />} label={t('requests')} tone='accent' trend={requests} value={today.requests} />
        <KeyFigure
          isFramed
          hint={t('errorRate', { rate: format.number(errorShare, { style: 'percent', maximumFractionDigits: 1 }) })}
          icon={<AlertTriangle size={16} />}
          label={t('errors')}
          tone='bad'
          trend={errors}
          value={today.errors}
        />
        <KeyFigure isFramed hint={t('throttledHint')} icon={<Gauge size={16} />} label={t('throttled')} tone='average' value={today.throttled} />
        <KeyFigure isFramed icon={<Timer size={16} />} label={t('latency')} suffix={t('ms')} tone='steel' value={today.avgLatencyMs ?? 0} />
      </div>
      <ProgressBar
        label={t('quota')}
        max={limits.requestsPerDay}
        tone={quotaTone(share)}
        value={today.requests}
        valueLabel={`${format.number(today.requests)} / ${format.number(limits.requestsPerDay)}`}
      />
    </div>
  );
};
