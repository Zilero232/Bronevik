'use client';

import { useTranslations } from 'next-intl';

import { Badge, Card, CardBody, CardHeader, Switch } from '@/ui-kit';

import type { MissionDetailProps } from './MissionDetail.types';

import { missionDetailState } from '../../../lib/mission-detail';
import { MissionTanks } from '../MissionTanks';
import { ConditionList } from './components';

import s from './MissionDetail.module.scss';

export const MissionDetail = ({ mission, progress, isSignedIn, isSaving, onProgress }: MissionDetailProps) => {
  const t = useTranslations('missions.mission');
  const { main, honors, hasHonors, done, withHonors, toggleDone, toggleHonors } = missionDetailState({ mission, progress, isSaving, onProgress });

  return (
    <div className={s.root}>
      <Card>
        <CardHeader
          meta={
            <span className={s.badges}>
              <Badge tone='steel'>{t('tiers', { min: mission.minTier, max: mission.maxTier })}</Badge>
              {mission.isFinal && <Badge tone='premium'>{t('final')}</Badge>}
            </span>
          }
          title={mission.title}
        />
        <CardBody className={s.body}>
          {mission.description && <p className={s.description}>{mission.description}</p>}
          <ConditionList conditions={main} title={t('main')} />
          {hasHonors ? <ConditionList conditions={honors} title={t('honors')} /> : <p className={s.muted}>{t('noHonors')}</p>}
          {mission.advice && (
            <p className={s.advice}>
              <span className={s.adviceLabel}>{t('advice')}</span> {mission.advice}
            </p>
          )}
          {isSignedIn ? (
            <div className={s.progress}>
              <Switch checked={done} label={t('done')} onCheckedChange={toggleDone} />
              {hasHonors && <Switch checked={withHonors} label={t('withHonors')} onCheckedChange={toggleHonors} />}
            </div>
          ) : (
            <p className={s.muted}>{t('signIn')}</p>
          )}
        </CardBody>
      </Card>
      <MissionTanks metric={mission.metric} questId={mission.questId} />
    </div>
  );
};
