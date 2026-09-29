'use client';

import { useTranslations } from 'next-intl';

import { Badge, Card } from '@/ui-kit';

import { MAP_HINT_TONE } from '../../../config';
import { useGuessMap } from '../../../model/context';

import s from './MapGuessList.module.scss';

export const MapGuessList = () => {
  const t = useTranslations('play.map.guesses');
  const { guesses } = useGuessMap();

  return (
    <Card className={s.root} variant='panel'>
      <h2 className={s.title}>{t('title')}</h2>
      {guesses.length === 0 ? (
        <p className={s.empty}>{t('empty')}</p>
      ) : (
        <ol className={s.list}>
          {guesses.map(({ map, hints }, index) => (
            <li key={map.arenaId} className={s.row} data-correct={hints.isCorrect}>
              <span className={s.index}>{index + 1}</span>
              <span className={s.name}>{map.name}</span>
              {hints.isCorrect ? (
                <Badge tone='success'>{t('correct')}</Badge>
              ) : (
                <span className={s.hints}>
                  <Badge tone={MAP_HINT_TONE.camouflage[hints.camouflage]}>{t(`camouflage.${hints.camouflage}`)}</Badge>
                  <Badge tone={MAP_HINT_TONE.size[hints.size]}>{t(`size.${hints.size}`)}</Badge>
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
};
