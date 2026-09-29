'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { DrawerProps } from './Drawer.types';

import { DRAWER_SWIPE } from './Drawer.constants';

import s from './Drawer.module.scss';

export const Drawer = ({ open, title, side = 'right', footer, className, children, onOpenChange }: DrawerProps) => {
  const t = useTranslations('common');

  return (
    <BaseDrawer.Root open={open} swipeDirection={DRAWER_SWIPE[side]} onOpenChange={onOpenChange}>
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className={s.backdrop} />
        <BaseDrawer.Viewport className={clsx(s.viewport, s[side])}>
          <BaseDrawer.Popup className={clsx(s.popup, className)}>
            <div className={s.head}>
              <BaseDrawer.Title className={s.title}>{title}</BaseDrawer.Title>
              <BaseDrawer.Close aria-label={t('close')} className={s.close}>
                <X size={18} />
              </BaseDrawer.Close>
            </div>
            <BaseDrawer.Content className={s.content}>{children}</BaseDrawer.Content>
            {footer && <div className={s.footer}>{footer}</div>}
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
};
