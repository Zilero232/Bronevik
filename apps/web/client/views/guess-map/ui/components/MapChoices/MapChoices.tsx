'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, Card, Input } from '@/ui-kit';

import { GUESS_MAP } from '../../../config';
import { useMapChoices } from '../../../model/hooks';

import s from './MapChoices.module.scss';

export const MapChoices = () => {
  const t = useTranslations('play.map.choices');
  const { search, attempt, choices, onSearchChange, onPick } = useMapChoices();

  return (
    <Card className={s.root} variant='panel'>
      <h2 className={s.label}>{t('label', { attempt, total: GUESS_MAP.maxGuesses })}</h2>
      <Input
        aria-label={t('search')}
        icon={<Search size={GUESS_MAP.searchIcon} />}
        placeholder={t('placeholder')}
        size='sm'
        type='search'
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      {choices.length === 0 ? (
        <p className={s.empty}>{t('empty')}</p>
      ) : (
        <ul className={s.grid}>
          {choices.map((map) => (
            <li key={map.arenaId}>
              <Button block aria-label={t('guess', { name: map.name })} size='sm' variant='secondary' onClick={() => onPick(map)}>
                {map.name}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
