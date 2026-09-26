'use client';

import { Layers, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardHeader, IconButton } from '@/ui-kit';

import { useLayersPanel } from '../../../model/hooks';
import { LayerRow } from './components';

import s from './LayersPanel.module.scss';

export const LayersPanel = () => {
  const t = useTranslations('tactics.layers');
  const { layers, activeLayerId, isEditable, canAdd, max, onAddLayer } = useLayersPanel();

  return (
    <Card padding='none'>
      <CardHeader
        action={
          isEditable && (
            <IconButton aria-label={t('add')} disabled={!canAdd} size='sm' title={t('add')} onClick={onAddLayer}>
              <Plus size={15} />
            </IconButton>
          )
        }
        title={
          <span className={s.title}>
            <Layers size={15} />
            {t('title')}
          </span>
        }
        meta={t('count', { count: layers.length, max })}
      />
      {layers.length === 0 ? (
        <p className={s.empty}>{isEditable ? t('emptyEditable') : t('empty')}</p>
      ) : (
        <ul className={s.list}>
          {layers.map((layer) => (
            <LayerRow key={layer.id} isActive={layer.id === activeLayerId} layer={layer} />
          ))}
        </ul>
      )}
    </Card>
  );
};
