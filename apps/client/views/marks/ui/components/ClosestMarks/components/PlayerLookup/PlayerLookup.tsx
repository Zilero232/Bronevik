'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, Input } from '@/ui-kit';

import type { PlayerLookupProps } from './PlayerLookup.types';

import { usePlayerLookup } from '../../../../../model/hooks';

import s from './PlayerLookup.module.scss';

export const PlayerLookup = ({ player, onPick }: PlayerLookupProps) => {
  const t = useTranslations('marks.closest');
  const { field, players, canSubmit, pick, onSubmit } = usePlayerLookup({ player, onPick });

  return (
    <form className={s.root} role='search' onSubmit={onSubmit}>
      <div className={s.row}>
        <Input
          aria-label={t('label')}
          autoComplete='off'
          icon={<Search size={14} />}
          placeholder={t('placeholder')}
          wrapperClassName={s.input}
          {...field}
        />
        <Button disabled={!canSubmit} size='sm' type='submit' variant='secondary'>
          {t('submit')}
        </Button>
      </div>
      {players.length > 0 && (
        <ul aria-label={t('suggestions')} className={s.suggestions}>
          {players.map(({ accountId, nickname, clanTag, battles }) => (
            <li key={accountId}>
              <button className={s.suggestion} type='button' onClick={() => pick(nickname)}>
                <span className={s.nickname}>{nickname}</span>
                {clanTag && <span className={s.clan}>[{clanTag}]</span>}
                {battles !== null && <span className={s.battles}>{t('battles', { battles })}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};
