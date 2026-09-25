'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { SectionHeader, Skeleton } from '@/ui-kit';

import { OVERLAY_EDITOR } from '../../../config';
import { publicIdOf } from '../../../lib/overlay-form';
import { useOverlays } from '../../../model/hooks';
import { OverlayEditor } from '../OverlayEditor';
import { OverlayList } from '../OverlayList';

import s from './OverlaysPanel.module.scss';

export const OverlaysPanel = () => {
  const t = useTranslations('streamer.overlays');
  const { data: overlays = [], isPending } = useOverlays();
  const [selection, setSelection] = useState<string | null>(null);

  const selected = selection === OVERLAY_EDITOR.newId ? null : (overlays.find(({ id }) => id === selection) ?? overlays[0] ?? null);
  const previewSource = selected ?? overlays[0];

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} title={t('title')} />
      {isPending ? (
        <Skeleton height={520} shape='block' />
      ) : (
        <div className={s.layout}>
          <OverlayList
            overlays={overlays}
            selectedId={selected?.id ?? null}
            onCreate={() => setSelection(OVERLAY_EDITOR.newId)}
            onSelect={setSelection}
          />
          <OverlayEditor
            key={selected?.id ?? OVERLAY_EDITOR.newId}
            overlay={selected}
            previewPublicId={previewSource ? publicIdOf(previewSource.publicUrl) : null}
            onRemoved={() => setSelection(null)}
            onSaved={setSelection}
          />
        </div>
      )}
    </section>
  );
};
