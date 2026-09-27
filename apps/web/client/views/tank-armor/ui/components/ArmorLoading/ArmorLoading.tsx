'use client';

import { ArmorScanner } from '@/widgets/armor/armor-viewer';

import s from './ArmorLoading.module.scss';

export const ArmorLoading = () => (
  <div className={s.root}>
    <ArmorScanner />
  </div>
);
