'use client';

import { isNation, toRoman } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { clanLabel } from '@/entities/player/player';
import { ROUTES } from '@/shared/constants';
import { toneOfTier } from '@/shared/lib';

import type { SearchGroups } from '../../../lib/group-results';

import { COMMAND_PALETTE } from '../../../config';

export const usePaletteResults = ({ players, tanks, clans }: SearchGroups) => {
  const t = useTranslations('search');
  const tGame = useTranslations('game');
  const format = useFormatter();

  return {
    players: players.map(({ accountId, nickname, clanTag, wn8: { value, tier } }) => ({
      key: accountId,
      value: `player-${accountId}`,
      title: nickname,
      meta: clanTag ? clanLabel({ tag: clanTag }) : t('noClan'),
      rating: value !== null && tier !== null ? { text: format.number(value), tone: toneOfTier(tier) } : null,
      href: ROUTES.players.profile(nickname)
    })),
    tanks: tanks.map(({ vehicle }) => ({
      key: vehicle.tankId,
      value: `tank-${vehicle.tankId}`,
      vehicle,
      title: vehicle.name,
      meta: [
        toRoman(vehicle.tier),
        tGame(`classes.${vehicle.type}`),
        isNation(vehicle.nation) ? tGame(`nations.${vehicle.nation}`) : vehicle.nation
      ].join(COMMAND_PALETTE.metaSeparator),
      href: ROUTES.tanks.detail(vehicle.slug)
    })),
    clans: clans.map(({ clanId, tag, name, membersCount, emblem }) => ({
      key: clanId,
      value: `clan-${clanId}`,
      tag,
      emblem,
      title: clanLabel({ tag, name }),
      meta: t('members', { count: membersCount }),
      href: ROUTES.clans.detail(tag)
    }))
  };
};
