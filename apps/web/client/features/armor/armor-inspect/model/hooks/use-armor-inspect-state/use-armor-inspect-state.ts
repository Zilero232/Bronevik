'use client';

import type { ArmorModulesData } from '@otmetki/schemas';

import { useState } from 'react';

import type { ArmorInspectContextValue } from '../../context';

import { resolveSelection } from '../../../lib/select-modules';

export const useArmorInspectState = (modules: ArmorModulesData): ArmorInspectContextValue => {
  const [turretName, setTurretName] = useState<string>();
  const [gunName, setGunName] = useState<string>();

  const { turret, gun } = resolveSelection({ modules, turretName, gunName });

  const setTurret = (name: string) => {
    setTurretName(name);
    setGunName(undefined);
  };

  return { modules, turret, gun, setTurret, setGun: setGunName };
};
