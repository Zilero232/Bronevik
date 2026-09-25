import type { CrewSkill, Equipment, FieldModification, OptionalDevice } from '@bronevik/gamedata';
import type { CrewSkillOption, ProvisionOption } from '@bronevik/schemas';

import type { MockFieldStepSeed, MockProvisionSeed, MockSkillSeed } from './mock.types';

const crew = (increase: number) => [{ attribute: 'crewLevelIncrease', op: 'add' as const, value: increase }];

const ANY_VEHICLE = { include: [], exclude: [] };

export const MOCK_PROVISIONS: MockProvisionSeed[] = [
  {
    id: 101,
    tag: 'tankRammer',
    name: 'Досылатель орудия',
    kind: 'optionalDevice',
    categories: ['firepower'],
    modifiers: [{ attribute: 'miscAttrs/gunReloadTimeFactor', op: 'mul', value: 0.9, specValue: 0.885 }]
  },
  {
    id: 102,
    tag: 'aimingStabilizer',
    name: 'Приводы наводки',
    kind: 'optionalDevice',
    categories: ['firepower'],
    modifiers: [{ attribute: 'miscAttrs/gunAimingTimeFactor', op: 'mul', value: 0.9, specValue: 0.885 }]
  },
  {
    id: 103,
    tag: 'enhancedAimDrives',
    name: 'Стабилизатор',
    kind: 'optionalDevice',
    categories: ['firepower'],
    modifiers: [{ attribute: 'miscAttrs/additiveShotDispersionFactor', op: 'mul', value: 0.8, specValue: 0.775 }]
  },
  {
    id: 104,
    tag: 'improvedVentilation',
    name: 'Улучшенная вентиляция',
    kind: 'optionalDevice',
    categories: ['survivability'],
    modifiers: [{ attribute: 'miscAttrs/crewLevelIncrease', op: 'add', value: 5, specValue: 6 }]
  },
  {
    id: 105,
    tag: 'coatedOptics',
    name: 'Просветлённая оптика',
    kind: 'optionalDevice',
    categories: ['stealth'],
    modifiers: [{ attribute: 'miscAttrs/circularVisionRadiusFactor', op: 'mul', value: 1.1, specValue: 1.135 }]
  },
  {
    id: 106,
    tag: 'stereoscope',
    name: 'Стереотруба',
    kind: 'optionalDevice',
    categories: ['stealth'],
    modifiers: [{ attribute: 'circularVisionRadius', op: 'mul', value: 1.25, specValue: 1.275, condition: 'still' }]
  },
  {
    id: 107,
    tag: 'turbocharger',
    name: 'Турбонагнетатель',
    kind: 'optionalDevice',
    categories: ['mobility'],
    modifiers: [
      { attribute: 'miscAttrs/enginePowerFactor', op: 'mul', value: 1.075, specValue: 1.1 },
      { attribute: 'miscAttrs/forwardMaxSpeedKMHTerm', op: 'add', value: 5, specValue: 6 }
    ]
  },
  {
    id: 108,
    tag: 'improvedRotationMechanism',
    name: 'Улучшенные поворотные механизмы',
    kind: 'optionalDevice',
    categories: ['mobility'],
    modifiers: [
      { attribute: 'miscAttrs/onMoveRotationSpeedFactor', op: 'mul', value: 1.1, specValue: 1.125 },
      { attribute: 'miscAttrs/onStillRotationSpeedFactor', op: 'mul', value: 1.1, specValue: 1.125 },
      { attribute: 'miscAttrs/turretRotationSpeed', op: 'mul', value: 1.1, specValue: 1.125 }
    ]
  },
  {
    id: 109,
    tag: 'improvedHardening',
    name: 'Улучшенная закалка',
    kind: 'optionalDevice',
    categories: ['survivability'],
    modifiers: [{ attribute: 'miscAttrs/healthFactor', op: 'mul', value: 1.08, specValue: 1.1 }]
  },
  { id: 201, tag: 'largeRepairkit', name: 'Большой ремкомплект', kind: 'consumable', modifiers: [] },
  { id: 202, tag: 'largeMedkit', name: 'Большая аптечка', kind: 'consumable', modifiers: [] },
  { id: 203, tag: 'autoExtinguishers', name: 'Автоматический огнетушитель', kind: 'consumable', modifiers: [] },
  { id: 204, tag: 'ration', name: 'Дополнительный паёк', kind: 'consumable', gold: 20, modifiers: crew(10) },
  {
    id: 205,
    tag: 'gasoline100',
    name: '100-октановый бензин',
    kind: 'consumable',
    modifiers: [{ attribute: 'engine/power', op: 'mul', value: 1.05, condition: 'active' }]
  },
  {
    id: 301,
    tag: 'directiveReload',
    name: 'Инструкция «Ускоренная досылка»',
    kind: 'directive',
    modifiers: [{ attribute: 'gun/reloadTime', op: 'mul', value: 0.975 }]
  },
  {
    id: 302,
    tag: 'directiveAiming',
    name: 'Инструкция «Отработка сведения»',
    kind: 'directive',
    modifiers: [{ attribute: 'gun/aimingTime', op: 'mul', value: 0.96 }]
  },
  { id: 303, tag: 'directiveCrew', name: 'Инструкция «Слаженность»', kind: 'directive', modifiers: crew(5) },
  {
    id: 401,
    tag: 'fm_aiming',
    name: 'Отработка сведения',
    kind: 'fieldModification',
    modifiers: [{ attribute: 'miscAttrs/gunAimingTimeFactor', op: 'mul', value: 0.95 }]
  },
  {
    id: 402,
    tag: 'fm_stabilization',
    name: 'Стабилизация',
    kind: 'fieldModification',
    modifiers: [{ attribute: 'miscAttrs/additiveShotDispersionFactor', op: 'mul', value: 0.9 }]
  },
  {
    id: 403,
    tag: 'fm_engine',
    name: 'Форсаж двигателя',
    kind: 'fieldModification',
    modifiers: [{ attribute: 'miscAttrs/enginePowerFactor', op: 'mul', value: 1.05 }]
  },
  {
    id: 404,
    tag: 'fm_reload',
    name: 'Ускоренная досылка',
    kind: 'fieldModification',
    modifiers: [{ attribute: 'miscAttrs/gunReloadTimeFactor', op: 'mul', value: 0.97 }]
  },
  {
    id: 405,
    tag: 'fm_calibration',
    name: 'Калибровка',
    kind: 'fieldModification',
    modifiers: [{ attribute: 'miscAttrs/multShotDispersionFactor', op: 'mul', value: 0.97 }]
  },
  {
    id: 406,
    tag: 'fm_hardening',
    name: 'Живучесть',
    kind: 'fieldModification',
    modifiers: [{ attribute: 'miscAttrs/healthFactor', op: 'mul', value: 1.03 }]
  }
];

export const MOCK_FIELD_STEPS: MockFieldStepSeed[] = [
  { level: 1, tags: ['fm_aiming'] },
  { level: 2, tags: ['fm_stabilization', 'fm_engine'] },
  { level: 3, tags: ['fm_hardening'] },
  { level: 4, tags: ['fm_reload', 'fm_calibration'] }
];

export const MOCK_SKILLS: MockSkillSeed[] = [
  {
    skill: 'brotherhood',
    name: 'Боевое братство',
    roles: ['commander', 'gunner', 'driver', 'radioman', 'loader'],
    isCommon: true,
    extras: { crewLevelIncrease: 5 }
  },
  { skill: 'repair', name: 'Ремонт', roles: ['commander', 'gunner', 'driver', 'radioman', 'loader'], isCommon: true },
  { skill: 'commander_sixthSense', name: 'Шестое чувство', roles: ['commander'] },
  { skill: 'commander_eagleEye', name: 'Орлиный глаз', roles: ['commander'], params: [{ name: 'circularVisionRadius', perLevel: 0.0002 }] },
  {
    skill: 'gunner_smoothTurret',
    name: 'Плавный поворот башни',
    roles: ['gunner'],
    params: [{ name: 'turretAimingDispersion', perLevel: -0.00075 }]
  },
  { skill: 'gunner_sniper', name: 'Снайпер', roles: ['gunner'] },
  {
    skill: 'driver_smoothDriving',
    name: 'Плавный ход',
    roles: ['driver'],
    params: [{ name: 'vehicleGunShotDispersionChassisMovement', perLevel: -0.0004 }]
  },
  { skill: 'driver_virtuoso', name: 'Виртуоз', roles: ['driver'], params: [{ name: 'vehicleAllGroundRotationSpeed', perLevel: 0.0005 }] },
  { skill: 'radioman_inventor', name: 'Изобретатель', roles: ['radioman'], params: [{ name: 'radioDistance', perLevel: 0.002 }] },
  { skill: 'radioman_finder', name: 'Радиоперехват', roles: ['radioman'], params: [{ name: 'vehicleCircularVisionRadius', perLevel: 0.0003 }] },
  { skill: 'loader_intuition', name: 'Интуиция', roles: ['loader'] },
  { skill: 'loader_desperado', name: 'Отчаянный', roles: ['loader'] }
];

export const provisionOption = ({ id, tag, name, kind, categories = [], gold, modifiers }: MockProvisionSeed): ProvisionOption => ({
  id,
  tag,
  name,
  kind,
  variant: kind === 'optionalDevice' ? 'standard' : null,
  group: null,
  image: null,
  price: gold === undefined ? null : { amount: gold, currency: 'gold' },
  categories,
  effects: modifiers.map(({ attribute, op, value, specValue, condition }) => ({
    attribute,
    op,
    value,
    specValue: specValue ?? null,
    condition: condition ?? null
  }))
});

export const optionalDevice = ({ id, tag, name, categories = [], modifiers }: MockProvisionSeed): OptionalDevice => ({
  name: tag,
  id,
  provisionId: id,
  displayName: name,
  kind: 'standard',
  tags: [tag],
  categories,
  incompatibleTags: [],
  removable: true,
  vehicleFilter: ANY_VEHICLE,
  modifiers,
  params: {}
});

export const equipment = ({ id, tag, name, kind, modifiers }: MockProvisionSeed): Equipment => ({
  name: tag,
  id,
  provisionId: id,
  displayName: name,
  kind: kind === 'directive' ? 'directive' : 'consumable',
  equipmentType: kind,
  tags: [tag],
  incompatibleTags: [],
  notInShop: false,
  vehicleFilter: ANY_VEHICLE,
  modifiers,
  params: {}
});

export const fieldModification = ({ id, tag, name, modifiers }: MockProvisionSeed): FieldModification => ({
  name: tag,
  id,
  provisionId: id,
  locName: name,
  modifiers
});

export const crewSkillOption = ({ skill, name, roles, isCommon = false, params = [] }: MockSkillSeed): CrewSkillOption => ({
  skill,
  name,
  roles,
  isCommon,
  image: null,
  params: params.map((param) => ({ ...param, situational: false }))
});

export const crewSkill = ({ skill, roles, isCommon = false, params = [], extras = {} }: MockSkillSeed): CrewSkill => ({
  name: skill,
  role: isCommon ? 'common' : (roles[0] ?? 'common'),
  roles,
  isCommon,
  singleOnVehicle: false,
  params: params.map((param) => ({ ...param, situational: false })),
  extras
});
