'use client';

import { motion } from 'motion/react';

import { STAGGER } from '@/shared/lib';

import { ApiKeysPanel, CabinetHeader, UsagePanel, WebhooksPanel } from './components';

import s from './DeveloperCabinetPage.module.scss';

export const DeveloperCabinetPage = () => (
  <motion.div animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
    <CabinetHeader />
    <ApiKeysPanel />
    <UsagePanel />
    <WebhooksPanel />
  </motion.div>
);
