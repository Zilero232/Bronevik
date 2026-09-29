import { Command } from 'cmdk';
import { useTranslations } from 'next-intl';

import { ClanEmblem } from '@/entities/clan/clan';
import { TankImage, vehicleIdentity } from '@/entities/tank/tank';

import type { PaletteResultsProps } from './PaletteResults.types';

import { usePaletteResults } from '../../../model/hooks';
import { PaletteItem } from '../PaletteItem';

import s from './PaletteResults.module.scss';

export const PaletteResults = ({ results, onSelect }: PaletteResultsProps) => {
  const t = useTranslations('search');
  const { players, tanks, clans } = usePaletteResults(results);

  return (
    <>
      {players.length > 0 && (
        <Command.Group heading={t('players')}>
          {players.map(({ key, value, title, meta, rating, href }) => (
            <PaletteItem
              key={key}
              trailing={
                rating && (
                  <span className={s.rating} data-tone={rating.tone}>
                    {rating.text}
                  </span>
                )
              }
              meta={meta}
              title={title}
              value={value}
              onSelect={() => onSelect(href)}
            />
          ))}
        </Command.Group>
      )}
      {tanks.length > 0 && (
        <Command.Group heading={t('tanks')}>
          {tanks.map(({ key, value, vehicle, title, meta, href }) => (
            <PaletteItem
              key={key}
              icon={<TankImage isDecorative size='small' tank={vehicleIdentity(vehicle)} />}
              meta={meta}
              title={title}
              value={value}
              onSelect={() => onSelect(href)}
            />
          ))}
        </Command.Group>
      )}
      {clans.length > 0 && (
        <Command.Group heading={t('clans')}>
          {clans.map(({ key, value, tag, emblem, title, meta, href }) => (
            <PaletteItem
              key={key}
              icon={<ClanEmblem size='sm' src={emblem} tag={tag} />}
              meta={meta}
              title={title}
              value={value}
              onSelect={() => onSelect(href)}
            />
          ))}
        </Command.Group>
      )}
    </>
  );
};
