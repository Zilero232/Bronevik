import { isNation, toRoman } from '@otmetki/icons';
import { Command } from 'cmdk';
import { useFormatter, useTranslations } from 'next-intl';

import { ClanEmblem } from '@/entities/clan/clan';
import { clanLabel } from '@/entities/player/player';
import { TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { toneOfTier } from '@/shared/lib';

import type { PaletteResultsProps } from './PaletteResults.types';

import { PaletteItem } from '../PaletteItem';

import s from './PaletteResults.module.scss';

export const PaletteResults = ({ results, onSelect }: PaletteResultsProps) => {
  const t = useTranslations('search');
  const tGame = useTranslations('game');
  const format = useFormatter();

  const { players, tanks, clans } = results;

  return (
    <>
      {players.length > 0 && (
        <Command.Group heading={t('players')}>
          {players.map(({ accountId, nickname, clanTag, wn8: { value, tier } }) => (
            <PaletteItem
              key={accountId}
              trailing={
                value !== null &&
                tier !== null && (
                  <span className={s.rating} data-tone={toneOfTier(tier)}>
                    {format.number(value)}
                  </span>
                )
              }
              meta={clanTag ? clanLabel({ tag: clanTag }) : t('noClan')}
              title={nickname}
              value={`player-${accountId}`}
              onSelect={() => onSelect(ROUTES.players.profile(nickname))}
            />
          ))}
        </Command.Group>
      )}
      {tanks.length > 0 && (
        <Command.Group heading={t('tanks')}>
          {tanks.map(({ vehicle }) => (
            <PaletteItem
              key={vehicle.tankId}
              icon={<TankImage isDecorative size='small' tank={vehicleIdentity(vehicle)} />}
              meta={`${toRoman(vehicle.tier)} · ${tGame(`classes.${vehicle.type}`)} · ${isNation(vehicle.nation) ? tGame(`nations.${vehicle.nation}`) : vehicle.nation}`}
              title={vehicle.name}
              value={`tank-${vehicle.tankId}`}
              onSelect={() => onSelect(ROUTES.tanks.detail(vehicle.slug))}
            />
          ))}
        </Command.Group>
      )}
      {clans.length > 0 && (
        <Command.Group heading={t('clans')}>
          {clans.map(({ clanId, tag, name, membersCount, emblem }) => (
            <PaletteItem
              key={clanId}
              icon={<ClanEmblem size='sm' src={emblem} tag={tag} />}
              meta={t('members', { count: membersCount })}
              title={clanLabel({ tag, name })}
              value={`clan-${clanId}`}
              onSelect={() => onSelect(ROUTES.clans.detail(tag))}
            />
          ))}
        </Command.Group>
      )}
    </>
  );
};
