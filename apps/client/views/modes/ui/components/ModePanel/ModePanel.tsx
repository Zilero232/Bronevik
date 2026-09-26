import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ModeSeason } from '@/entities/mode/mode';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader, EmptyState, KeyFigure, KeyFigures } from '@/ui-kit';

import type { ModePanelProps } from './ModePanel.types';

import { LeaderRow } from './components';

import s from './ModePanel.module.scss';

export const ModePanel = ({ panel: { mode, summary } }: ModePanelProps) => {
  const t = useTranslations('modes');

  return (
    <Card className={s.root} padding='none'>
      <CardHeader
        action={
          <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={ROUTES.modes.detail(mode)}>
            {t('hub.open')}
            <ArrowRight size={14} />
          </Link>
        }
        title={
          <Link className={s.title} href={ROUTES.modes.detail(mode)}>
            {t(`names.${mode}`)}
          </Link>
        }
      />
      <div className={s.body}>
        <p className={s.blurb}>{t(`blurbs.${mode}`)}</p>
        {summary?.season && <ModeSeason season={summary.season} />}
        {summary ? (
          <>
            <KeyFigures isFramed={false}>
              <KeyFigure label={t('figures.battles')} value={summary.battles} />
              <KeyFigure label={t('figures.players')} value={summary.players} />
              <KeyFigure label={t('figures.tanks')} value={summary.tanks} />
            </KeyFigures>
            {summary.leaders.length > 0 && (
              <div className={s.leaders}>
                <h3 className={s.leadersTitle}>{t('hub.leaders')}</h3>
                <ol className={s.list}>
                  {summary.leaders.map((leader) => (
                    <LeaderRow key={leader.vehicle.tankId} leader={leader} />
                  ))}
                </ol>
              </div>
            )}
          </>
        ) : (
          <EmptyState isCompact description={t('hub.emptyDescription')} title={t('hub.emptyTitle')} />
        )}
      </div>
    </Card>
  );
};
