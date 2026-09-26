'use client';

import type { MyBattle } from '@otmetki/schemas';

import { useCopy, useShare } from '@siberiacancode/reactuse';
import { useFormatter, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { BATTLE_FACTS } from '../../../config';
import { durationClock } from '../../../lib/battle-format';

export const useBattleCard = (battle: MyBattle) => {
  const t = useTranslations('analytics.battle');
  const format = useFormatter();
  const { copy } = useCopy();
  const { supported, trigger } = useShare();

  const title = t('share.title', { tank: battle.vehicle?.name ?? String(battle.tankId) });
  const text = t('share.text', {
    tank: battle.vehicle?.name ?? String(battle.tankId),
    map: battle.mapName ?? battle.arenaId,
    result: t(`results.${battle.result}`),
    damage: format.number(battle.damageDealt, 'integer'),
    assisted: format.number(battle.damageAssisted, 'integer')
  });

  const onShare = async () => {
    const url = window.location.href;

    try {
      if (supported) {
        await trigger({ title, text, url });

        return;
      }

      await copy(`${text}\n${url}`);
      toast.success(t('share.copied'));
    } catch {
      toast.error(t('share.failed'));
    }
  };

  return {
    facts: BATTLE_FACTS.map((key) => ({ key, value: battle[key] })),
    duration: battle.durationSec === null ? null : durationClock(battle.durationSec),
    lifetime: battle.lifetimeSec === null ? null : durationClock(battle.lifetimeSec),
    startedAt: format.dateTime(new Date(battle.startedAt), 'dateTime'),
    onShare: () => void onShare()
  };
};
