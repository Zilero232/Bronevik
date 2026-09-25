import { isNation, NATION_ICONS, TANK_CLASS_ICONS, toRoman } from '@bronevik/icons';
import { Command } from 'cmdk';
import { Shield } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { isNonNullish } from 'remeda';

import { ROUTES } from '@/shared/constants';
import { toneOfTier } from '@/shared/lib';
import { Avatar, RatingBadge } from '@/ui-kit';

import type { PaletteResultsProps } from './PaletteResults.types';

import { PaletteItem } from '../PaletteItem';

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
                isNonNullish(value) &&
                isNonNullish(tier) && <RatingBadge label='WN8' size='sm' tone={toneOfTier(tier)} value={format.number(value)} withPips={false} />
              }
              icon={<Avatar name={nickname} size='sm' />}
              meta={clanTag ? `[${clanTag}]` : t('noClan')}
              title={nickname}
              value={`player-${accountId}`}
              onSelect={() => onSelect(ROUTES.player(nickname))}
            />
          ))}
        </Command.Group>
      )}
      {tanks.length > 0 && (
        <Command.Group heading={t('tanks')}>
          {tanks.map(({ vehicle: { tankId, slug, name, nation, type, tier } }) => {
            const ClassIcon = TANK_CLASS_ICONS[type];
            const NationIcon = isNation(nation) ? NATION_ICONS[nation] : null;
            const nationLabel = isNation(nation) ? tGame(`nations.${nation}`) : nation;

            return (
              <PaletteItem
                key={tankId}
                icon={<ClassIcon size={22} strokeWidth={1.75} />}
                meta={`${toRoman(tier)} · ${tGame(`classes.${type}`)} · ${nationLabel}`}
                title={name}
                trailing={NationIcon && <NationIcon palette='color' size={18} />}
                value={`tank-${tankId}`}
                onSelect={() => onSelect(ROUTES.tank(slug))}
              />
            );
          })}
        </Command.Group>
      )}
      {clans.length > 0 && (
        <Command.Group heading={t('clans')}>
          {clans.map(({ clanId, tag, name, membersCount }) => (
            <PaletteItem
              key={clanId}
              icon={<Shield size={20} strokeWidth={1.75} />}
              meta={t('members', { count: membersCount })}
              title={`[${tag}] ${name}`}
              value={`clan-${clanId}`}
              onSelect={() => onSelect(ROUTES.clan(tag))}
            />
          ))}
        </Command.Group>
      )}
    </>
  );
};
