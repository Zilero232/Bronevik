'use client';

import { ArmorInspectProvider, ModulePicker } from '@/features/armor/armor-inspect';

import type { ArmorPaneProps } from './ArmorPane.types';

import { ArmorStage } from '../ArmorStage';
import { ZoneTable } from './components';

import s from './ArmorPane.module.scss';

export const ArmorPane = ({ model, paneKey, leader, showName, ...stage }: ArmorPaneProps) => (
  <ArmorInspectProvider modules={model.response.modules}>
    <section aria-label={model.response.vehicle.name} className={s.root} data-pane={paneKey}>
      <header className={s.head}>
        {showName && <h2 className={s.name}>{model.response.vehicle.name}</h2>}
        <ModulePicker />
      </header>
      <ArmorStage {...stage} geometry={model.geometry} isLeader={paneKey === leader} syncId={paneKey} />
      <ZoneTable geometry={model.geometry} />
    </section>
  </ArmorInspectProvider>
);
