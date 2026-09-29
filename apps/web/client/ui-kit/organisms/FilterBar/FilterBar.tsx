'use client';

import { clsx } from 'clsx';
import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useFilterBar } from '@/shared/lib';

import type { FilterBarProps } from './FilterBar.types';

import { Button } from '../../atoms';
import { Drawer } from '../../molecules';
import { ActiveFilterChips } from './components';

import s from './FilterBar.module.scss';

export const FilterBar = ({
  label,
  children,
  active = [],
  activeCount = active.length,
  primary,
  more,
  moreLabel,
  moreCount = 0,
  actions,
  variant = 'panel',
  className,
  onReset
}: FilterBarProps) => {
  const t = useTranslations('common.filters');
  const { isSheetOpen, isMoreOpen, onSheetOpenChange, onSheetOpen, onSheetClose, onMoreToggle } = useFilterBar();

  return (
    <section
      aria-label={label ?? t('title')}
      className={clsx(s.root, s[variant], className)}
      data-active={activeCount > 0 || undefined}
      role='search'
    >
      <div className={s.head}>
        <span className={s.title}>
          {t('title')}
          <span aria-live='polite' className={s.count} data-empty={activeCount === 0 || undefined}>
            {activeCount}
          </span>
        </span>
        <Button className={s.open} size='sm' variant='secondary' onClick={onSheetOpen}>
          <SlidersHorizontal size={14} />
          {t('open')}
          {activeCount > 0 && <span className={s.badge}>{activeCount}</span>}
        </Button>
        <ActiveFilterChips active={active} />
        <div className={s.tools}>
          {actions}
          {more && (
            <Button aria-expanded={isMoreOpen} className={s.moreToggle} size='sm' variant='ghost' onClick={onMoreToggle}>
              <ChevronDown className={s.chevron} data-open={isMoreOpen || undefined} size={14} />
              {moreLabel ?? t('more')}
              {moreCount > 0 && <span className={s.badge}>{moreCount}</span>}
            </Button>
          )}
          {onReset && (
            <Button className={s.reset} disabled={activeCount === 0} size='sm' variant='ghost' onClick={onReset}>
              <RotateCcw size={14} />
              <span className={s.resetText}>{t('reset')}</span>
            </Button>
          )}
        </div>
      </div>
      {primary && <div className={s.primary}>{primary}</div>}
      <div className={s.fields}>{children}</div>
      {more && isMoreOpen && <div className={clsx(s.fields, s.more)}>{more}</div>}
      <Drawer
        footer={
          <>
            {onReset && (
              <Button disabled={activeCount === 0} variant='ghost' onClick={onReset}>
                <RotateCcw size={14} />
                {t('reset')}
              </Button>
            )}
            <Button className={s.apply} onClick={onSheetClose}>
              {t('apply')}
            </Button>
          </>
        }
        className={s.sheet}
        open={isSheetOpen}
        side='bottom'
        title={label ?? t('title')}
        onOpenChange={onSheetOpenChange}
      >
        <div className={s.sheetFields}>
          {children}
          {more}
        </div>
      </Drawer>
    </section>
  );
};
