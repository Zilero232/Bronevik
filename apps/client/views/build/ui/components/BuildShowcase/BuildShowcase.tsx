'use client';

import { Share2, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Button, EmptyState, ErrorState, Skeleton, StatList } from '@/ui-kit';

import { useBuildShowcase } from '../../../model/hooks';
import { BuildStage, CrewBand, EquipmentMatrix, FieldModRing, ShellMix, ShowcaseCompare, SourceToggle } from './components';

import s from './BuildShowcase.module.scss';

export const BuildShowcase = () => {
  const t = useTranslations('builds.showcase');
  const {
    vehicle,
    source,
    other,
    isPlus,
    status,
    isRetrying,
    usage,
    comparison,
    leftPairs,
    rightPairs,
    stats,
    hasStats,
    isStatsPending,
    crew,
    equipment,
    consumables,
    shells,
    hasLoadout,
    tanksHref,
    onSourceChange,
    onOpenEditor,
    onShare,
    onRetry
  } = useBuildShowcase();

  const isShares = source === 'all';

  return (
    <div className={s.root}>
      <BuildStage
        actions={
          <>
            <Button disabled={!hasLoadout} onClick={onOpenEditor}>
              <Wrench size={16} />
              {t('actions.openEditor')}
            </Button>
            <Button variant='secondary' onClick={onShare}>
              <Share2 size={16} />
              {t('actions.share')}
            </Button>
          </>
        }
        stats={match({ isStatsPending, hasStats })
          .with({ isStatsPending: true }, () => <Skeleton height={140} />)
          .with({ hasStats: true }, () => <StatList items={stats} title={t('stats.title')} />)
          .otherwise(() => (
            <p className={s.notice}>{t('stats.empty')}</p>
          ))}
        compare={usage && <ShowcaseCompare items={comparison} other={other} />}
        left={<FieldModRing isShares={isShares} pairs={leftPairs} />}
        notice={usage && !usage.isEnough ? <p className={s.notice}>{t('notEnough', { battles: usage.battles, min: usage.minSample })}</p> : null}
        right={<FieldModRing isShares={isShares} pairs={rightPairs} />}
        tanksHref={tanksHref}
        toggle={<SourceToggle isPlus={isPlus} source={source} usage={usage} onChange={onSourceChange} />}
        vehicle={vehicle}
      />
      {status === 'pending' && <Skeleton className={s.pending} height={320} />}
      {status === 'error' && <ErrorState isRetrying={isRetrying} title={t('error')} onRetry={onRetry} />}
      {status === 'ready' && (
        <>
          {crew.length > 0 ? <CrewBand columns={crew} isShares={isShares} /> : <EmptyState title={t('crew.empty')} />}
          {equipment.length > 0 ? <EquipmentMatrix columns={equipment} isShares={isShares} /> : <EmptyState title={t('equipment.empty')} />}
          {(consumables.length > 0 || shells.length > 0) && <ShellMix consumables={consumables} shells={shells} />}
        </>
      )}
    </div>
  );
};
