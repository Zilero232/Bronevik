'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/ui-kit';

import type { OverlayListProps } from './OverlayList.types';

import s from './OverlayList.module.scss';

export const OverlayList = ({ overlays, selectedId, onSelect, onCreate }: OverlayListProps) => {
  const t = useTranslations('streamer.overlays');

  return (
    <nav aria-label={t('list')} className={s.root}>
      <ul className={s.list}>
        {overlays.map(({ id, name, kind, config }) => (
          <li key={id}>
            <button aria-current={id === selectedId} className={s.item} type='button' onClick={() => onSelect(id)}>
              <span className={s.name}>{name}</span>
              <span className={s.meta}>
                {t(`kind.${kind}`)} · {t(`theme.${config.theme}`)}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Button block aria-pressed={selectedId === null} size='sm' variant='secondary' onClick={onCreate}>
        <Plus size={14} />
        {t('new')}
      </Button>
    </nav>
  );
};
