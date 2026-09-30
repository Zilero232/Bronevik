'use client';

import { ChevronUp, GitCompareArrows, Trash2 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Link } from '@/shared/i18n/navigation';
import { MOTION_VARIANTS } from '@/shared/lib';
import { buttonVariants, IconButton, SegmentedControl } from '@/ui-kit';

import { COMPARE_TRAY } from '../config';
import { useCompareTray } from '../model/hooks';
import { COMPARE_TRAY_MOTION } from './CompareTray.motion';
import { TrayChip } from './components';

import s from './CompareTray.module.scss';

export const CompareTray = () => {
  const t = useTranslations('compareTray');
  const listId = useId();
  const {
    isVisible,
    kind,
    kinds,
    chips,
    count,
    max,
    openCount,
    isOverflow,
    canOpen,
    href,
    isExpanded,
    collapse,
    toggleExpanded,
    onKindChange,
    onRemove,
    onClear
  } = useCompareTray();

  return (
    <>
      {isVisible && <div aria-hidden className={s.spacer} />}
      <AnimatePresence initial={false}>
        {isVisible && (
          <m.aside key='tray' aria-label={t('label')} className={s.root} data-expanded={isExpanded} {...COMPARE_TRAY_MOTION}>
            <div className={s.head}>
              <GitCompareArrows aria-hidden className={s.icon} size={COMPARE_TRAY.iconSize} />
              {kinds.length > 1 ? (
                <SegmentedControl
                  aria-label={t('kindsLabel')}
                  options={kinds.map(({ value, count: total }) => ({ value, label: `${t(`kinds.${value}`)} ${total}` }))}
                  size='sm'
                  value={kind}
                  onChange={onKindChange}
                />
              ) : (
                <p className={s.count}>{t(`count.${kind}`, { count })}</p>
              )}
              <IconButton
                aria-controls={listId}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? t('collapse') : t('expand')}
                className={s.expand}
                size='sm'
                onClick={toggleExpanded}
              >
                <ChevronUp aria-hidden size={COMPARE_TRAY.iconSize} />
              </IconButton>
            </div>
            <ul aria-label={t('listLabel')} className={s.chips} id={listId}>
              <AnimatePresence initial={false} mode='popLayout'>
                {chips.map((chip, index) => (
                  <m.li layout key={`${kind}-${chip.id}`} animate='shown' exit='exit' initial='hidden' variants={MOTION_VARIANTS.listItem}>
                    <TrayChip
                      chip={chip}
                      isOver={index >= max}
                      removeLabel={t('remove', { name: chip.name })}
                      onNavigate={collapse}
                      onRemove={onRemove}
                    />
                  </m.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className={s.actions}>
              {isOverflow && <p className={s.note}>{t('overflow', { max })}</p>}
              {canOpen ? (
                <Link className={buttonVariants({ variant: 'primary', size: 'sm' })} href={href} onClick={collapse}>
                  {t('open')} · {openCount}
                </Link>
              ) : (
                <p className={s.note}>{t('needMore')}</p>
              )}
              <IconButton aria-label={t('clearLabel')} size='sm' title={t('clear')} onClick={onClear}>
                <Trash2 aria-hidden size={COMPARE_TRAY.iconSize} />
              </IconButton>
            </div>
          </m.aside>
        )}
      </AnimatePresence>
    </>
  );
};
