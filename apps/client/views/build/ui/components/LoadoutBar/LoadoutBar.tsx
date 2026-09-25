'use client';

import { Copy, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { serializeLoadout } from '@/entities/tank/build';
import { POPUP } from '@/shared/lib';
import { Button, SegmentedControl, Switch } from '@/ui-kit';

import type { BuildSide } from '../../../lib/stat-diff';

import { useBuildContext } from '../../../model/context';

import s from './LoadoutBar.module.scss';

const SIDES = ['a', 'b'] as const satisfies readonly BuildSide[];

export const LoadoutBar = () => {
  const t = useTranslations('builds.loadout');
  const { active, side, isCompare, setSide, setCompare, copyAToB, resetActive } = useBuildContext();

  const options = SIDES.map((value) => ({ value, label: t(value) }));

  return (
    <div className={s.root}>
      <Switch checked={isCompare} className={s.compare} description={t('compareHint')} label={t('compare')} onCheckedChange={setCompare} />
      <AnimatePresence initial={false}>
        {isCompare && (
          <motion.div key='sides' animate='visible' className={s.sides} exit='exit' initial='hidden' variants={POPUP}>
            <SegmentedControl<BuildSide> aria-label={t('label')} options={options} value={side} onChange={setSide} />
            <Button size='sm' variant='ghost' onClick={copyAToB}>
              <Copy size={14} />
              {t('copy')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={s.tail}>
        <code className={s.code} title={t('code')}>
          <span className={s.codeSide}>{side.toUpperCase()}</span>
          {serializeLoadout(active)}
        </code>
        <Button size='sm' title={t('resetHint')} variant='ghost' onClick={resetActive}>
          <RotateCcw size={14} />
          {t('reset')}
        </Button>
      </div>
    </div>
  );
};
