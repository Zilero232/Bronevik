'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';
import { MousePointerClick } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardHeader, Drawer } from '@/ui-kit';

import type { PathAsideProps } from './PathAside.types';

import { TREE_VIEW } from '../../../config';
import { PathPanel } from '../PathPanel';

import s from './PathAside.module.scss';

export const PathAside = ({ selected, steps, cost, onClear }: PathAsideProps) => {
  const t = useTranslations('tree.path');
  const isCompact = useMediaQuery(TREE_VIEW.compactQuery);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClear();
    }
  };

  const placeholder = (
    <div className={s.placeholder}>
      <MousePointerClick aria-hidden className={s.placeholderIcon} size={28} />
      <p className={s.placeholderTitle}>{t('emptyTitle')}</p>
      <p className={s.placeholderText}>{t('emptyDescription')}</p>
    </div>
  );

  if (isCompact) {
    return (
      <>
        {placeholder}
        <Drawer open={selected !== null} title={t('eyebrow')} onOpenChange={onOpenChange}>
          {selected && <PathPanel cost={cost} selected={selected} steps={steps} onClear={onClear} />}
        </Drawer>
      </>
    );
  }

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader eyebrow={t('eyebrow')} title={selected ? t('title') : undefined} />
      {selected ? <PathPanel cost={cost} selected={selected} steps={steps} onClear={onClear} /> : placeholder}
    </Card>
  );
};
