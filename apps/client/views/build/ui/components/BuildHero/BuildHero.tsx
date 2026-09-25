'use client';

import type { VehicleSummary } from '@bronevik/schemas';

import { TANK_CLASS_SILHOUETTES, toRoman } from '@bronevik/icons';
import { ArrowUpRight, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { TankIdentity, TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { TankPicker } from '@/features/tank/pick-tank';
import { ROUTES } from '@/shared/constants';
import { Link, useRouter } from '@/shared/i18n/navigation';
import { HEAD_REVEAL, STAGGER } from '@/shared/lib';
import { Button, buttonVariants } from '@/ui-kit';

import { useBuildContext } from '../../../model/context';
import { useShareLink } from '../../../model/hooks';

import s from './BuildHero.module.scss';

export const BuildHero = () => {
  const t = useTranslations('builds');
  const router = useRouter();
  const { vehicle } = useBuildContext();
  const share = useShareLink();

  const Silhouette = TANK_CLASS_SILHOUETTES[vehicle.type];
  const identity = vehicleIdentity(vehicle);

  const onPick = (next: VehicleSummary | null) => {
    if (next && next.slug !== vehicle.slug) {
      router.push(ROUTES.build(next.slug));
    }
  };

  return (
    <motion.header animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <span aria-hidden className={s.watermark}>
        <Silhouette size={320} strokeWidth={0.5} />
      </span>
      <span aria-hidden className={s.tier}>
        {toRoman(vehicle.tier)}
      </span>
      <TankImage isDecorative isPriority className={s.render} size='big' tank={identity} />
      <motion.p className={s.eyebrow} variants={HEAD_REVEAL}>
        {t('hero.eyebrow')}
      </motion.p>
      <motion.h1 className={s.title} variants={HEAD_REVEAL}>
        <TankIdentity size='lg' tank={identity} />
      </motion.h1>
      <motion.p className={s.lead} variants={HEAD_REVEAL}>
        {t('hero.lead')}
      </motion.p>
      <motion.div className={s.actions} variants={HEAD_REVEAL}>
        <TankPicker className={s.picker} label={t('hero.picker')} value={vehicle} onChange={onPick} />
        <div className={s.buttons}>
          <Link className={buttonVariants({ variant: 'secondary' })} href={ROUTES.tank(vehicle.slug)}>
            {t('hero.toTank')}
            <ArrowUpRight size={16} />
          </Link>
          <Button onClick={share}>
            <Share2 size={16} />
            {t('share.action')}
          </Button>
        </div>
      </motion.div>
    </motion.header>
  );
};
