'use client';

import { RefreshCw, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, Card, CardBody, CardHeader, CopyField } from '@/ui-kit';

import type { SharePanelProps } from './SharePanel.types';

import { useSharePanel } from '../../../model/hooks';

import s from './SharePanel.module.scss';

export const SharePanel = ({ board, token }: SharePanelProps) => {
  const t = useTranslations('tactics.share');
  const { links, isPublic, isPrivate, isRotating, onRotate } = useSharePanel({ board, token });

  return (
    <Card>
      <CardHeader
        action={
          <Button disabled={isRotating} size='sm' variant='ghost' onClick={onRotate}>
            <RefreshCw size={14} />
            {t('rotate')}
          </Button>
        }
        title={
          <span className={s.title}>
            <Share2 size={15} />
            {t('title')}
          </span>
        }
      />
      <CardBody>
        {isPrivate ? (
          <p className={s.hint}>{t('privateHint')}</p>
        ) : (
          <div className={s.links}>
            {isPublic && <CopyField label={t('public')} value={links.plain} />}
            {links.view && <CopyField label={t('view')} value={links.view} />}
            {links.edit && <CopyField isSecret label={t('edit')} tone='accent' value={links.edit} />}
          </div>
        )}
        <p className={s.hint}>{t('rotateHint')}</p>
      </CardBody>
    </Card>
  );
};
