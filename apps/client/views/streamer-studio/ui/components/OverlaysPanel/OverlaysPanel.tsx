'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ErrorState, Skeleton } from '@/ui-kit';

import { useOverlaysPanel } from '../../../model/hooks';
import { OverlayEditor } from '../OverlayEditor';
import { OverlayList } from '../OverlayList';

import s from './OverlaysPanel.module.scss';

export const OverlaysPanel = () => {
  const t = useTranslations('streamer.overlays');
  const { overlays, selected, editorKey, isPending, isError, isFetching, onSelect, onCreate, onRemoved, onRetry } = useOverlaysPanel();

  return (
    <section className={s.root}>
      <p className={s.note}>{t('description')}</p>
      {match({ isPending, isError })
        .with({ isPending: true }, () => <Skeleton height={520} shape='block' />)
        .with({ isError: true }, () => <ErrorState isRetrying={isFetching} onRetry={onRetry} />)
        .otherwise(() => (
          <div className={s.layout}>
            <OverlayList overlays={overlays} selectedId={selected?.id ?? null} onCreate={onCreate} onSelect={onSelect} />
            <OverlayEditor key={editorKey} overlay={selected} onRemoved={onRemoved} onSaved={onSelect} />
          </div>
        ))}
    </section>
  );
};
