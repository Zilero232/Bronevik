'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { isNonNullish } from 'remeda';

import { SPRING } from '@/shared/lib';

import { BUILD_VIEW } from '../../../config';
import { useBuildStatGroups } from '../../../model/hooks';
import { StatsBoard } from '../StatsBoard';
import { SummaryChip } from './components';
import { SHEET } from './MobileStats.motion';

import s from './MobileStats.module.scss';

export const MobileStats = () => {
  const t = useTranslations('builds.stats');
  const { groups } = useBuildStatGroups();
  const [isOpen, toggleOpen] = useBoolean(false);
  const sheetId = useId();

  const rows = groups.flatMap((group) => group.rows);
  const summary = BUILD_VIEW.summaryKeys.map((key) => rows.find((row) => row.key === key)).filter(isNonNullish);

  return (
    <div className={s.root}>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key='sheet' animate='open' className={s.sheet} exit='closed' id={sheetId} initial='closed' variants={SHEET}>
            <div className={s.scroll}>
              <StatsBoard />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button aria-controls={sheetId} aria-expanded={isOpen} className={s.bar} type='button' onClick={() => toggleOpen()}>
        <span className={s.summary}>
          <span className={s.srOnly}>{t('summary')}</span>
          {summary.map((row) => (
            <SummaryChip key={row.key} row={row} />
          ))}
        </span>
        <span className={s.toggle}>
          {isOpen ? t('hide') : t('showAll')}
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className={s.chevron} transition={SPRING}>
            <ChevronUp size={16} />
          </motion.span>
        </span>
      </button>
    </div>
  );
};
