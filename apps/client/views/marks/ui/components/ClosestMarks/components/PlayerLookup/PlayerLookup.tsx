'use client';

import type { SubmitEvent } from 'react';

import { Crosshair, UserSearch } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button, Input } from '@/ui-kit';

import type { PlayerLookupProps } from '../../ClosestMarks.types';

import { usePlayerSuggestions } from '../../../../../model/hooks';

import s from './PlayerLookup.module.scss';

export const PlayerLookup = ({ player, onPick }: PlayerLookupProps) => {
  const t = useTranslations('marks.closest');
  const format = useFormatter();
  const [input, setInput] = useState(player);
  const { players } = usePlayerSuggestions(input === player ? '' : input);

  const pick = (value: string) => {
    setInput(value);
    onPick(value.trim());
  };

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    pick(input);
  };

  return (
    <form className={s.root} role='search' onSubmit={onSubmit}>
      <span className={s.icon}>
        <Crosshair aria-hidden size={28} />
      </span>
      <p className={s.lead}>{t('lead')}</p>
      <div className={s.row}>
        <Input
          aria-label={t('label')}
          autoComplete='off'
          icon={<UserSearch size={16} />}
          placeholder={t('placeholder')}
          value={input}
          wrapperClassName={s.input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button disabled={!input.trim()} type='submit'>
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
                {battles !== null && <span className={s.battles}>{t('battles', { battles: format.number(battles) })}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};
