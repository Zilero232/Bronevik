'use client';

import type { EconomyAccount } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, KeyFigure, KeyFigures, SegmentedControl, Switch } from '@/ui-kit';

import { TANK_SECTIONS } from '../../../config';
import { useEconomySection } from '../../../model/hooks';

import s from './EconomySection.module.scss';

export const EconomySection = () => {
  const t = useTranslations('tank.economy');
  const { account, setAccount, withReserve, onReserveChange, view, hasData, windowDays } = useEconomySection();

  return (
    <Card className={s.root} id={TANK_SECTIONS.economy} padding='none'>
      <CardHeader
        action={
          <SegmentedControl<EconomyAccount>
            options={[
              { value: 'premium', label: t('premium') },
              { value: 'standard', label: t('standard') }
            ]}
            aria-label={t('account')}
            size='sm'
            value={account}
            onChange={setAccount}
          />
        }
        className={s.header}
        title={t('title')}
      />
      {!hasData && <EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />}
      {hasData && !view && <EmptyState isCompact title={t('noAccountData')} />}
      {view && (
        <>
          <KeyFigures isFramed={false}>
            <KeyFigure label={t('credits')} size='xl' value={view.credits} />
            <KeyFigure label={t('net')} size='xl' tone={view.net !== null && view.net < 0 ? 'bad' : 'good'} value={view.net} />
            <KeyFigure hint={t('costsHint')} label={t('costs')} value={view.costs} />
            <KeyFigure label={t('xp')} value={view.xp} />
            <KeyFigure label={t('freeXp')} value={view.freeXp} />
          </KeyFigures>
          <div className={s.controls}>
            <Switch checked={withReserve} description={t('reserveHint')} label={t('reserve')} onCheckedChange={onReserveChange} />
          </div>
        </>
      )}
      <p className={s.note}>{view ? t('note', { battles: view.battles, players: view.players, days: windowDays }) : t('noteEmpty')}</p>
    </Card>
  );
};
