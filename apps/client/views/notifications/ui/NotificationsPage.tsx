'use client';

import { motion } from 'motion/react';

import { STAGGER, STAGGER_ITEM } from '@/shared/lib';

import { InboxFeed, NotificationsHero, PushCard, SettingsPanel } from './components';

import s from './NotificationsPage.module.scss';

export const NotificationsPage = () => (
  <div className={s.root}>
    <NotificationsHero />
    <motion.div animate='visible' className={s.layout} initial='hidden' variants={STAGGER}>
      <motion.div className={s.feed} variants={STAGGER_ITEM}>
        <InboxFeed />
      </motion.div>
      <motion.aside className={s.settings} variants={STAGGER_ITEM}>
        <PushCard />
        <SettingsPanel />
      </motion.aside>
    </motion.div>
  </div>
);
