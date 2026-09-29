'use client';

import type { ArmorModulesData } from '@otmetki/schemas';

import { listArmorGuns } from '@otmetki/gamedata';
import { useQueryStates } from 'nuqs';

import { useArmorGuns } from '@/entities/armor/armor-model';

import type { ArmorAttackContextValue } from '../../context';

import { ARMOR_ATTACK_URL_PARSERS, ARMOR_INSPECT } from '../../../config';
import { clampDistance, pickGun, pickShell, resolveShell } from '../../../lib/shell-options';

export const useArmorAttackState = (modules: ArmorModulesData): ArmorAttackContextValue => {
  const [params, setParams] = useQueryStates(ARMOR_ATTACK_URL_PARSERS, { history: 'replace' });
  const { data, isLoading, isError } = useArmorGuns({ idOrSlug: params.attacker });

  const guns = params.attacker ? (data?.guns ?? []) : listArmorGuns(modules);
  const gun = pickGun({ guns, gunName: params.gun });
  const shellOption = pickShell({ gun, shellName: params.shell });
  const distance = clampDistance(params.distance);
  const randomness = ARMOR_INSPECT.randomness[params.rng];

  return {
    attackerSlug: params.attacker,
    guns,
    gun,
    shellOption,
    shellState: shellOption ? { shell: resolveShell({ option: shellOption, distance }), randomness } : undefined,
    distance,
    randomness,
    randomnessKey: params.rng,
    layers: params.layers,
    heatmap: params.heatmap,
    isAttackerLoading: isLoading,
    isAttackerError: isError,
    setAttacker: (vehicle) => void setParams({ attacker: vehicle?.slug ?? null, gun: null, shell: null }),
    setGun: (name) => void setParams({ gun: name, shell: null }),
    setShell: (name) => void setParams({ shell: name }),
    setDistance: (value) => void setParams({ distance: clampDistance(value) }),
    setRandomness: (key) => void setParams({ rng: key }),
    setLayers: (layers) => void setParams({ layers }),
    setHeatmap: (heatmap) => void setParams({ heatmap })
  };
};
