'use client';

import { AlertTriangle, Gauge, Send, Timer } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { KeyFigure, ProgressBar } from '@/ui-kit';

import type { UsageTodayProps } from './UsageToday.types';

import { useUsageToday } from '../../../../../model/hooks';

import s from './UsageToday.module.scss';

export const UsageToday = ({ usage }: UsageTodayProps) => {
  const t = useTranslations('developer.usage.today');
  const { today, requestsLimit, requestsTrend, errorsTrend, errorRate, quotaTone, quotaLabel } = useUsageToday(usage);

  return (
    <div className={s.root}>
      <div className={s.tiles}>
        <KeyFigure isFramed icon={<Send size={16} />} label={t('requests')} tone='accent' trend={requestsTrend} value={today.requests} />
        <KeyFigure
          isFramed
          hint={errorRate}
          icon={<AlertTriangle size={16} />}
          label={t('errors')}
          tone='bad'
          trend={errorsTrend}
          value={today.errors}
        />
        <KeyFigure isFramed hint={t('throttledHint')} icon={<Gauge size={16} />} label={t('throttled')} tone='average' value={today.throttled} />
        <KeyFigure isFramed icon={<Timer size={16} />} label={t('latency')} suffix={t('ms')} tone='steel' value={today.avgLatencyMs ?? 0} />
      </div>
      <ProgressBar label={t('quota')} max={requestsLimit} tone={quotaTone} value={today.requests} valueLabel={quotaLabel} />
    </div>
  );
};
