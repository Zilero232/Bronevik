'use client';

import { MonitorPlay, Plus } from 'lucide-react';
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
              <MonitorPlay aria-hidden className={s.icon} size={16} />
              <span className={s.text}>
                <span className={s.name}>{name}</span>
                <span className={s.meta}>
                  {t(`kind.${kind}`)} · {t(`theme.${config.theme}`)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Button block aria-pressed={selectedId === null} size='sm' variant='secondary' onClick={onCreate}>
        <Plus size={15} />
        {t('new')}
      </Button>
    </nav>
  );
};
