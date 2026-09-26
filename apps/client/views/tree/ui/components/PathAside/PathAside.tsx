'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, Drawer, EmptyState } from '@/ui-kit';

import type { PathAsideProps } from './PathAside.types';

import { usePathAside } from '../../../model/hooks';
import { PathPanel } from '../PathPanel';

import s from './PathAside.module.scss';

export const PathAside = ({ selected, steps, cost, onClear }: PathAsideProps) => {
  const t = useTranslations('tree.path');
  const { isCompact, onOpenChange } = usePathAside(onClear);

  const placeholder = <EmptyState isCompact title={t('empty')} />;

  if (isCompact) {
    return (
      <>
        {placeholder}
        <Drawer open={selected !== null} title={t('title')} onOpenChange={onOpenChange}>
          {selected && <PathPanel cost={cost} selected={selected} steps={steps} onClear={onClear} />}
        </Drawer>
      </>
    );
  }

  return (
    <Card className={s.root} padding='none'>
      <CardHeader title={t('title')} />
      <div className={s.body}>{selected ? <PathPanel cost={cost} selected={selected} steps={steps} onClear={onClear} /> : placeholder}</div>
    </Card>
  );
};
