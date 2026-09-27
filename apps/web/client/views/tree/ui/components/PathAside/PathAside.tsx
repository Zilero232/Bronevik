'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, Drawer, EmptyState } from '@/ui-kit';

import { usePathAside } from '../../../model/hooks';
import { PathPanel } from '../PathPanel';

import s from './PathAside.module.scss';

export const PathAside = () => {
  const t = useTranslations('tree.path');
  const { isCompact, isOpen, onOpenChange } = usePathAside();

  const placeholder = <EmptyState isCompact title={t('empty')} />;

  if (isCompact) {
    return (
      <>
        {placeholder}
        <Drawer open={isOpen} title={t('title')} onOpenChange={onOpenChange}>
          <PathPanel />
        </Drawer>
      </>
    );
  }

  return (
    <Card className={s.root} padding='none'>
      <CardHeader title={t('title')} />
      <div className={s.body}>{isOpen ? <PathPanel /> : placeholder}</div>
    </Card>
  );
};
