'use client';

import { Mark3Icon, RandomBattleIcon } from '@bronevik/icons';
import { Dices } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { MOCK_PLAYERS } from '@/shared/mocks';
import { AnimatedNumber, Button, EmptyState, ProgressBar, ProgressRing, Skeleton, Sparkline, StatTile } from '@/ui-kit';

import { DesignBlock, DesignRow } from '../DesignBlock';

import s from './DataSection.module.scss';

const [{ trend: TREND }] = MOCK_PLAYERS;

export const DataSection = () => {
  const t = useTranslations('design.data');
  const [value, setValue] = useState(48_211);

  return (
    <DesignBlock eyebrow='06' id='data' title={t('title')}>
      <div className={s.tiles}>
        <StatTile delta={2.4} deltaLabel='+2.4%' icon={<RandomBattleIcon size={18} />} label={t('battles')} trend={TREND} value={value} />
        <StatTile format={{ maximumFractionDigits: 2 }} label={t('winRate')} suffix='%' tone='great' value={64.82} />
        <StatTile delta={-1.1} deltaLabel='−1.1%' label={t('damage')} tone='steel' value={3184} />
        <StatTile hint={t('marksHint')} icon={<Mark3Icon size={18} />} label={t('marks')} tone='unicum' value={212} />
      </div>
      <DesignRow label={t('number')}>
        <span className={s.big}>
          <AnimatedNumber value={value} />
        </span>
        <Button size='sm' variant='secondary' onClick={() => setValue(Math.round(10_000 + Math.random() * 90_000))}>
          <Dices size={14} />
          {t('shuffle')}
        </Button>
      </DesignRow>
      <DesignRow className={s.bars} label={t('progress')}>
        <ProgressBar label={t('moe')} value={87.4} valueLabel='87.4%' />
        <ProgressBar label={t('master')} tone='steel' value={42} valueLabel='42 / 100' />
        <ProgressBar label={t('index')} tone='good' value={66.5} valueLabel='66.5' />
      </DesignRow>
      <DesignRow label={t('rings')}>
        <ProgressRing label={t('moe')} value={87.4}>
          87%
        </ProgressRing>
        <ProgressRing label={t('master')} size={72} tone='steel' value={42}>
          42
        </ProgressRing>
        <ProgressRing label={t('index')} size={120} thickness={8} tone='unicum' value={96}>
          96
        </ProgressRing>
      </DesignRow>
      <DesignRow label={t('sparklines')}>
        <Sparkline data={TREND} height={40} width={160} />
        <Sparkline data={[...TREND].reverse()} height={40} tone='bad' width={160} />
        <Sparkline data={TREND} height={40} tone='steel' width={160} withArea={false} />
      </DesignRow>
      <DesignRow className={s.skeletons} label={t('skeleton')}>
        <Skeleton height={44} shape='circle' width={44} />
        <span className={s.skeletonText}>
          <Skeleton width='70%' />
          <Skeleton width='45%' />
        </span>
        <Skeleton height={64} shape='block' width={180} />
      </DesignRow>
      <EmptyState code={t('emptyCode')} description={t('emptyBody')} title={t('emptyTitle')} />
    </DesignBlock>
  );
};
