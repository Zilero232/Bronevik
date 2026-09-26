'use client';

import { useState } from 'react';

import type { ArmorInspectProviderProps, ArmorLayerKey } from './armor-inspect-context.types';

import { ARMOR_INSPECT, ARMOR_LAYERS } from '../../config';
import { resolveSelection } from '../../lib/select-modules';
import { pickShell, resolveShell } from '../../lib/shell-options';
import { ArmorInspectContext } from './armor-inspect-context';

export const ArmorInspectProvider = ({ modules, children }: ArmorInspectProviderProps) => {
  const [turretName, setTurretName] = useState<string>();
  const [gunName, setGunName] = useState<string>();
  const [shellName, setShellName] = useState<string>();
  const [distance, setDistance] = useState<number>(ARMOR_INSPECT.distance.initial);
  const [randomness, setRandomness] = useState<number>(ARMOR_INSPECT.randomness.lesta);
  const [layers, setLayers] = useState<ArmorLayerKey[]>([...ARMOR_LAYERS]);

  const { turret, gun } = resolveSelection({ modules, turretName, gunName });
  const shellOption = pickShell({ gun, shellName });
  const shellState = shellOption ? { shell: resolveShell({ option: shellOption, distance }), randomness } : undefined;

  const onTurretChange = (name: string) => {
    setTurretName(name);
    setGunName(undefined);
  };

  return (
    <ArmorInspectContext
      value={{
        modules,
        turret,
        gun,
        shellOption,
        shellState,
        distance,
        randomness,
        layers,
        setTurret: onTurretChange,
        setGun: setGunName,
        setShell: setShellName,
        setDistance,
        setRandomness,
        setLayers
      }}
    >
      {children}
    </ArmorInspectContext>
  );
};
