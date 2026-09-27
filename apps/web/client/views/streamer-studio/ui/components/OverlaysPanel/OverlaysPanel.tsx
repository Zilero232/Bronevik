'use client';

import { useTranslations } from 'next-intl';

import { QueryState, Skeleton } from '@/ui-kit';

import { useOverlaysPanel } from '../../../model/hooks';
import { OverlayEditor } from '../OverlayEditor';
import { OverlayList } from '../OverlayList';

import s from './OverlaysPanel.module.scss';

export const OverlaysPanel = () => {
  const t = useTranslations('streamer.overlays');
  const { query, overlays, selected, editorKey, onSelect, onCreate, onRemoved } = useOverlaysPanel();

  return (
    <section className={s.root}>
      <p className={s.note}>{t('description')}</p>
      <QueryState isEmpty={() => false} query={query} skeleton={<Skeleton height={520} shape='block' />}>
        <div className={s.layout}>
          <OverlayList overlays={overlays} selectedId={selected?.id ?? null} onCreate={onCreate} onSelect={onSelect} />
          <OverlayEditor key={editorKey} overlay={selected} onRemoved={onRemoved} onSaved={onSelect} />
        </div>
      </QueryState>
    </section>
  );
};
