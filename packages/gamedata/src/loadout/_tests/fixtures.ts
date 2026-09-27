import type { CrewData, Equipment, OptionalDevice, PostProgression, VehicleSpec } from '../../model';

export const R01_IS: VehicleSpec = {
  tag: 'R01_IS',
  id: 2,
  tankId: 513,
  nation: 'ussr',
  tier: 7,
  type: 'heavyTank',
  role: 'role_HT_break',
  tags: [
    'heavyTank',
    'role_HT_break',
    'HD',
    'sinai',
    'improvedVentilation_class2_user',
    'tankRammer_class2_user',
    'extraHealthReserve_class2_user',
    'antifragmentationLining_medium_user'
  ],
  nameKey: 'ussr_vehicles:IS',
  descriptionKey: 'ussr_vehicles:IS_descr',
  name: 'IS',
  shortName: 'IS',
  price: { amount: 1424000, currency: 'credits' },
  notInShop: false,
  isPremium: false,
  isCollectible: false,
  isWheeled: false,
  isSecret: false,
  isClone: false,
  crew: [
    { role: 'commander', extraRoles: ['radioman'] },
    { role: 'gunner', extraRoles: [] },
    { role: 'driver', extraRoles: [] },
    { role: 'loader', extraRoles: [] }
  ],
  speedLimits: { forward: 34, backward: 14 },
  invisibility: { moving: 0.07, still: 0.139, camouflageBonus: 0.02, firePenalty: 0.209 },
  hull: {
    weight: 23550,
    maxHealth: 904,
    armor: {
      armor_1: 120,
      armor_2: 100,
      armor_3: 100,
      armor_4: 60,
      armor_5: 120,
      armor_6: 70,
      armor_7: 90,
      armor_8: 90,
      armor_9: 35,
      armor_10: 140,
      armor_11: 60,
      armor_12: 0,
      armor_13: 100,
      armor_14: 35,
      armor_15: 30,
      armor_16: 20
    },
    primaryArmor: [120, 90, 60],
    ammoBayHealth: 180
  },
  chassis: [
    {
      name: 'IS-1',
      id: 4,
      moduleId: 1026,
      nameKey: 'ussr_vehicles:IS-1',
      displayName: 'IS-1',
      tier: 6,
      price: { amount: 12990, currency: 'credits' },
      weight: 11500,
      maxHealth: 170,
      tags: [],
      unlocks: [{ type: 'chassis', name: 'IS-2M', cost: 8125 }],
      rotationSpeed: 32,
      rotationIsAroundCenter: false,
      terrainResistance: [1.1, 1.7, 2.6],
      shotDispersionFactors: { movement: 0.23, rotation: 0.23 },
      brakeForce: 34500,
      maxClimbAngle: 25,
      armor: { leftTrack: 20, rightTrack: 20 }
    },
    {
      name: 'IS-2M',
      id: 5,
      moduleId: 1282,
      nameKey: 'ussr_vehicles:IS-2M',
      displayName: 'IS-2M',
      tier: 7,
      price: { amount: 18080, currency: 'credits' },
      weight: 11500,
      maxHealth: 190,
      tags: [],
      unlocks: [],
      rotationSpeed: 35,
      rotationIsAroundCenter: false,
      terrainResistance: [1.1, 1.4, 2.3],
      shotDispersionFactors: { movement: 0.21, rotation: 0.21 },
      brakeForce: 34500,
      maxClimbAngle: 25,
      armor: { leftTrack: 20, rightTrack: 20 }
    }
  ],
  turrets: [
    {
      name: 'IS-85',
      id: 3,
      moduleId: 771,
      nameKey: 'ussr_vehicles:IS-85',
      displayName: 'IS-85',
      tier: 6,
      price: { amount: 15000, currency: 'credits' },
      weight: 7200,
      maxHealth: 226,
      tags: [],
      unlocks: [{ type: 'turret', name: 'IS-122', cost: 12200 }],
      rotationSpeed: 38,
      circularVisionRadius: 330,
      armor: {
        armor_1: 100,
        armor_2: 90,
        armor_3: 90,
        armor_4: 90,
        armor_5: 90,
        armor_6: 60,
        armor_7: 45,
        armor_8: 90,
        armor_9: 90,
        armor_10: 30,
        armor_11: 30,
        armor_12: 35,
        armor_13: 90,
        armor_14: 30,
        armor_15: 0,
        armor_16: 0
      },
      primaryArmor: [100, 90, 90],
      guns: [
        {
          name: '_85mm_D-5T',
          id: 11,
          moduleId: 2820,
          nameKey: 'ussr_vehicles:_85mm_D-5T',
          displayName: '85mm D-5T',
          tier: 6,
          price: { amount: 61530, currency: 'credits' },
          weight: 1500,
          maxHealth: 122,
          tags: [],
          unlocks: [
            { type: 'gun', name: '_85mm_D5T-85BM', cost: 15500 },
            { type: 'gun', name: '_100mm_D10T', cost: 16500 }
          ],
          reloadTime: 4.9,
          aimingTime: 2.9,
          shotDispersionRadius: 0.46,
          shotDispersionFactors: { turretRotation: 0.16, afterShot: 4, whileGunDamaged: 2 },
          rotationSpeed: 39.375,
          maxAmmo: 68,
          pitchLimits: {
            elevation: 22,
            depression: 5,
            elevationMax: 22,
            depressionMax: 5,
            minPitch: [
              { angle: 0, pitch: -22 },
              { angle: 1, pitch: -22 }
            ],
            maxPitch: [
              { angle: 0, pitch: 5 },
              { angle: 0.366894, pitch: 5 },
              { angle: 0.430556, pitch: 3 },
              { angle: 0.569444, pitch: 3 },
              { angle: 0.633106, pitch: 5 },
              { angle: 1, pitch: 5 }
            ]
          },
          turretYawLimits: [-180, 180],
          invisibilityFactorAtShot: 0.25,
          shots: [
            {
              shell: '_85mm_UBR-365K',
              shellId: 9226,
              kind: 'ARMOR_PIERCING',
              damage: { armor: 160, devices: 115 },
              caliber: 85,
              isPremium: false,
              speed: 800,
              gravity: 9.81,
              maxDistance: 720,
              piercingPower: { at100m: 120, at500m: 111 },
              defaultPortion: 0.9
            },
            {
              shell: '_85mm_UBR-365P',
              shellId: 9482,
              kind: 'ARMOR_PIERCING_CR',
              damage: { armor: 160, devices: 115 },
              caliber: 85,
              isPremium: true,
              speed: 1000,
              gravity: 9.81,
              maxDistance: 720,
              piercingPower: { at100m: 161, at500m: 140 },
              defaultPortion: 0
            },
            {
              shell: '_85mm_UOF-365K',
              shellId: 9738,
              kind: 'HIGH_EXPLOSIVE',
              damage: { armor: 280, devices: 115 },
              caliber: 85,
              explosionRadius: 1.32,
              isPremium: false,
              speed: 800,
              gravity: 9.81,
              maxDistance: 720,
              piercingPower: { at100m: 43, at500m: 43 },
              defaultPortion: 0.1
            }
          ],
          armor: { armor_1: 100, armor_2: 60, armor_3: 60, armor_4: 0, gun: 30 },
          spacedArmor: ['armor_1', 'armor_2', 'armor_3', 'armor_4'],
          collision: 'Gun_01'
        }
      ]
    },
    {
      name: 'IS-122',
      id: 4,
      moduleId: 1027,
      nameKey: 'ussr_vehicles:IS-122',
      displayName: 'IS-122',
      tier: 7,
      price: { amount: 26300, currency: 'credits' },
      weight: 7500,
      maxHealth: 326,
      tags: [],
      unlocks: [{ type: 'gun', name: '_122-mm_D-25T_with_a_piston_shutter', cost: 17000 }],
      rotationSpeed: 28,
      circularVisionRadius: 350,
      armor: {
        armor_1: 100,
        armor_2: 90,
        armor_3: 90,
        armor_4: 90,
        armor_5: 90,
        armor_6: 60,
        armor_7: 45,
        armor_8: 90,
        armor_9: 90,
        armor_10: 30,
        armor_11: 30,
        armor_12: 35,
        armor_13: 90,
        armor_14: 30,
        armor_15: 0,
        armor_16: 0
      },
      primaryArmor: [100, 90, 90],
      guns: [
        {
          name: '_122-mm_D-25T_with_wedges_shutter',
          id: 15,
          moduleId: 3844,
          nameKey: 'ussr_vehicles:_122-mm_D-25T_with_wedges_shutter',
          displayName: '122-mm D-25T with wedges shutter',
          tier: 8,
          price: { amount: 125140, currency: 'credits' },
          weight: 2590,
          maxHealth: 192,
          tags: [],
          unlocks: [{ type: 'vehicle', name: 'R139_IS_M', cost: 58000 }],
          reloadTime: 12.3,
          aimingTime: 3.4,
          shotDispersionRadius: 0.46,
          shotDispersionFactors: { turretRotation: 0.16, afterShot: 4, whileGunDamaged: 2 },
          rotationSpeed: 26.25,
          maxAmmo: 28,
          pitchLimits: {
            elevation: 25,
            depression: 6,
            elevationMax: 25,
            depressionMax: 6,
            minPitch: [
              { angle: 0, pitch: -25 },
              { angle: 1, pitch: -25 }
            ],
            maxPitch: [
              { angle: 0, pitch: 6 },
              { angle: 0.366894, pitch: 6 },
              { angle: 0.430556, pitch: 2 },
              { angle: 0.569444, pitch: 2 },
              { angle: 0.633106, pitch: 6 },
              { angle: 1, pitch: 6 }
            ]
          },
          turretYawLimits: [-180, 180],
          invisibilityFactorAtShot: 0.19,
          shots: [
            {
              shell: '_122mm_UBR-471',
              shellId: 13066,
              kind: 'ARMOR_PIERCING',
              damage: { armor: 390, devices: 165 },
              caliber: 122,
              isPremium: false,
              speed: 780,
              gravity: 9.81,
              maxDistance: 720,
              piercingPower: { at100m: 175, at500m: 152 },
              defaultPortion: 0.9
            },
            {
              shell: '_122mm_UBR-471P',
              shellId: 13322,
              kind: 'ARMOR_PIERCING_CR',
              damage: { armor: 390, devices: 165 },
              caliber: 122,
              isPremium: true,
              speed: 975,
              gravity: 9.81,
              maxDistance: 720,
              piercingPower: { at100m: 217, at500m: 204 },
              defaultPortion: 0
            },
            {
              shell: '_122mm_UOF-471',
              shellId: 13578,
              kind: 'HIGH_EXPLOSIVE',
              damage: { armor: 530, devices: 165 },
              caliber: 122,
              explosionRadius: 2.49,
              isPremium: false,
              speed: 780,
              gravity: 9.81,
              maxDistance: 720,
              piercingPower: { at100m: 61, at500m: 61 },
              defaultPortion: 0.1
            }
          ],
          armor: { armor_1: 100, armor_2: 60, armor_3: 60, armor_4: 0, gun: 50 },
          spacedArmor: ['armor_1', 'armor_2', 'armor_3', 'armor_4'],
          collision: 'Gun_10'
        }
      ]
    }
  ],
  engines: [
    {
      name: 'V-2IS',
      id: 3,
      moduleId: 773,
      nameKey: 'ussr_vehicles:V-2IS',
      displayName: 'V-2IS',
      tier: 7,
      price: { amount: 36000, currency: 'credits' },
      weight: 750,
      maxHealth: 190,
      tags: ['diesel'],
      unlocks: [{ type: 'engine', name: 'V-2-54IS', cost: 26000 }],
      power: 600,
      fireStartingChance: 0.15
    },
    {
      name: 'V-2-54IS',
      id: 40,
      moduleId: 10245,
      nameKey: 'ussr_vehicles:V-2-54IS',
      displayName: 'V-2-54IS',
      tier: 9,
      price: { amount: 79290, currency: 'credits' },
      weight: 700,
      maxHealth: 370,
      tags: ['diesel'],
      unlocks: [],
      power: 700,
      fireStartingChance: 0.12
    }
  ],
  fuelTanks: [
    {
      name: 'Heavy',
      id: 204,
      moduleId: 52230,
      displayName: 'Heavy',
      price: { amount: 100, currency: 'credits' },
      weight: 275,
      maxHealth: 175,
      tags: [],
      unlocks: []
    }
  ],
  radios: [
    {
      name: '_10RK',
      id: 8,
      moduleId: 2055,
      nameKey: 'ussr_vehicles:_10RK',
      displayName: '10RK',
      tier: 7,
      price: { amount: 18600, currency: 'credits' },
      weight: 100,
      maxHealth: 150,
      tags: [],
      unlocks: [{ type: 'radio', name: '_12RT', cost: 5600 }],
      distance: 440
    },
    {
      name: '_12RT',
      id: 9,
      moduleId: 2311,
      nameKey: 'ussr_vehicles:_12RT',
      displayName: '12RT',
      tier: 9,
      price: { amount: 33600, currency: 'credits' },
      weight: 110,
      maxHealth: 200,
      tags: [],
      unlocks: [],
      distance: 625
    }
  ],
  optDevsOverrides: {
    camouflageNet: { invisibilityBonus: [0.05, 0.075] },
    additionalInvisibilityDevice: { invisibilityBonus: [0.03, 0.04] },
    trophyBasicAdditionalInvisibilityDevice: { invisibilityBonus: [0.03] },
    trophyUpgradedAdditionalInvisibilityDevice: { invisibilityBonus: [0.05] }
  },
  supplySlots: [5, 1, 1, 6, 6, 6, 7, 8, 8, 8],
  postProgressionTree: 'role_HT_break',
  hasSiegeMode: false
};

export const CATALOG: { optionalDevices: OptionalDevice[]; equipment: Equipment[]; crew: CrewData; postProgression: PostProgression } = {
  optionalDevices: [
    {
      name: 'deluxRammer',
      id: 45,
      provisionId: 11769,
      nameKey: 'artefacts:deluxRammer/name',
      displayName: 'deluxRammer/name',
      descriptionKey: 'artefacts:deluxRammer/long_special',
      icon: 'rammer',
      kind: 'deluxe',
      script: 'StaticOptionalDevice',
      archetype: 'tankRammer',
      groupName: 'tankRammer',
      tags: ['rammer', 'deluxe', 'firepower'],
      categories: [],
      incompatibleTags: ['rammer', 'avgDamage'],
      price: { amount: 5000, currency: 'crystal' },
      removable: false,
      vehicleFilter: { include: [{ tags: ['tankRammer_class1_user', 'tankRammer_class2_user'], mandatoryTags: [], nations: [] }], exclude: [] },
      modifiers: [{ attribute: 'miscAttrs/gunReloadTimeFactor', op: 'mul', value: 0.865, specValue: 0.865 }],
      params: {}
    },
    {
      name: 'tankRammer_tier1',
      id: 82,
      provisionId: 21241,
      nameKey: 'artefacts:tankRammer_tier1/name',
      displayName: 'tankRammer tier1/name',
      descriptionKey: 'artefacts:rammer/long_special',
      icon: 'rammer',
      kind: 'standard',
      script: 'StaticOptionalDevice',
      archetype: 'tankRammer',
      tags: ['rammer', 'firepower'],
      categories: ['firepower'],
      incompatibleTags: ['rammer', 'avgDamage'],
      price: { amount: 600000, currency: 'credits' },
      removable: false,
      vehicleFilter: { include: [{ tags: ['tankRammer_class1_user'], mandatoryTags: [], nations: [] }], exclude: [] },
      modifiers: [{ attribute: 'miscAttrs/gunReloadTimeFactor', op: 'mul', value: 0.9, specValue: 0.885 }],
      params: {}
    },
    {
      name: 'improvedVentilation_tier2',
      id: 76,
      provisionId: 19705,
      nameKey: 'artefacts:improvedVentilation_tier2/name',
      displayName: 'improvedVentilation tier2/name',
      descriptionKey: 'artefacts:improvedVentilation/long_special',
      icon: 'improvedVentilation',
      kind: 'standard',
      script: 'StaticOptionalDevice',
      archetype: 'improvedVentilation',
      tags: ['ventilation', 'armor', 'firepower', 'camouflage', 'reconnaissance', 'mobility'],
      categories: ['firepower', 'mobility', 'stealth', 'survivability'],
      incompatibleTags: ['ventilation'],
      price: { amount: 200000, currency: 'credits' },
      removable: false,
      vehicleFilter: { include: [{ tags: ['improvedVentilation_class2_user'], mandatoryTags: [], nations: [] }], exclude: [] },
      modifiers: [{ attribute: 'miscAttrs/crewLevelIncrease', op: 'add', value: 5, specValue: 6 }],
      params: {}
    },
    {
      name: 'enhancedAimDrives_tier2',
      id: 84,
      provisionId: 21753,
      nameKey: 'artefacts:enhancedAimDrives_tier2/name',
      displayName: 'enhancedAimDrives tier2/name',
      descriptionKey: 'artefacts:enhancedAimDrives/long_special',
      icon: 'enhancedAimDrives',
      kind: 'standard',
      script: 'StaticOptionalDevice',
      archetype: 'enhancedAimDrives',
      tags: ['enhancedAimDrives', 'firepower'],
      categories: ['firepower'],
      incompatibleTags: ['enhancedAimDrives'],
      price: { amount: 200000, currency: 'credits' },
      removable: false,
      vehicleFilter: { include: [{ minLevel: 5, maxLevel: 7, tags: [], mandatoryTags: [], nations: [] }], exclude: [] },
      modifiers: [{ attribute: 'miscAttrs/gunAimingTimeFactor', op: 'mul', value: 0.909, specValue: 0.897 }],
      params: {}
    },
    {
      name: 'stereoscope_tier1',
      id: 69,
      provisionId: 17913,
      nameKey: 'artefacts:stereoscope_tier1/name',
      displayName: 'stereoscope tier1/name',
      descriptionKey: 'artefacts:stereoscope/long_special',
      icon: 'stereoscope',
      kind: 'standard',
      script: 'Stereoscope',
      archetype: 'stereoscope',
      tags: ['stereoscope', 'reconnaissance'],
      categories: ['stealth'],
      incompatibleTags: ['stereoscope'],
      price: { amount: 600000, currency: 'credits' },
      removable: false,
      vehicleFilter: {
        include: [{ minLevel: 8, maxLevel: 11, tags: [], mandatoryTags: [], nations: [] }],
        exclude: [{ tags: [], mandatoryTags: ['wheeledVehicle', 'lightTank'], nations: [] }]
      },
      modifiers: [{ attribute: 'circularVisionRadius', op: 'mul', value: 1.25, specValue: 1.275, condition: 'still' }],
      params: { activateWhenStillSec: [3], circularVisionRadius: [1.25, 1.275] }
    },
    {
      name: 'camouflageNet_tier2',
      id: 74,
      provisionId: 19193,
      nameKey: 'artefacts:camouflageNet_tier2/name',
      displayName: 'camouflageNet tier2/name',
      descriptionKey: 'artefacts:camouflageNet/long_special',
      icon: 'camouflageNet',
      kind: 'standard',
      script: 'CamouflageNet',
      archetype: 'camouflageNet',
      tags: ['camouflageNet', 'camouflage'],
      categories: ['stealth'],
      incompatibleTags: ['camouflageNet'],
      price: { amount: 100000, currency: 'credits' },
      removable: false,
      vehicleFilter: { include: [{ minLevel: 5, maxLevel: 11, tags: [], mandatoryTags: [], nations: [] }], exclude: [] },
      modifiers: [{ attribute: 'invisibility/additive', op: 'add', value: 0.15, specValue: 0.175, condition: 'still' }],
      params: { activateWhenStillSec: [3], invisibilityBonus: [0.15, 0.175] }
    },
    {
      name: 'improvedRotationMechanism_tier1',
      id: 96,
      provisionId: 24825,
      nameKey: 'artefacts:improvedRotationMechanism_tier1/name',
      displayName: 'improvedRotationMechanism tier1/name',
      descriptionKey: 'artefacts:improvedRotationMechanism/long_special',
      icon: 'improvedRotationMechanism',
      kind: 'standard',
      script: 'RotationMechanisms',
      archetype: 'improvedRotationMechanism',
      tags: ['rotationMechanism'],
      categories: ['firepower', 'mobility'],
      incompatibleTags: ['rotationMechanism'],
      price: { amount: 600000, currency: 'credits' },
      removable: true,
      vehicleFilter: { include: [{ minLevel: 8, maxLevel: 11, tags: [], mandatoryTags: [], nations: [] }], exclude: [] },
      modifiers: [
        { attribute: 'miscAttrs/turretRotationSpeed', op: 'mul', value: 1.1, specValue: 1.125 },
        { attribute: 'miscAttrs/additiveShotDispersionFactor', op: 'mul', value: 0.9, specValue: 0.875 },
        { attribute: 'miscAttrs/onMoveRotationSpeedFactor', op: 'mul', value: 1.1, specValue: 1.125, condition: 'tracked' },
        { attribute: 'miscAttrs/onStillRotationSpeedFactor', op: 'mul', value: 1.1, specValue: 1.125, condition: 'tracked' },
        { attribute: 'miscAttrs/onMoveRotationSpeedFactor', op: 'mul', value: 1.1, specValue: 1.125, condition: 'wheeled' },
        { attribute: 'miscAttrs/onStillRotationSpeedFactor', op: 'mul', value: 1.1, specValue: 1.125, condition: 'wheeled' },
        { attribute: 'miscAttrs/centerRotationFwdSpeedFactor', op: 'mul', value: 1.1, specValue: 1.125, condition: 'wheeled' }
      ],
      params: {
        trackRotateSpeedFactor: [1.1, 1.125],
        wheelRotateSpeedFactor: [1.1, 1.125],
        wheelCenterRotationFwdSpeed: [1.1, 1.125],
        trackMoveSpeedFactor: [1.1, 1.125],
        wheelMoveSpeedFactor: [1.1, 1.125]
      }
    },
    {
      name: 'turbocharger_tier1',
      id: 99,
      provisionId: 25593,
      nameKey: 'artefacts:turbocharger_tier1/name',
      displayName: 'turbocharger tier1/name',
      descriptionKey: 'artefacts:turbocharger/long_special',
      icon: 'turbocharger',
      kind: 'standard',
      script: 'StaticOptionalDevice',
      archetype: 'turbocharger',
      tags: ['turbocharger'],
      categories: ['mobility'],
      incompatibleTags: ['turbocharger'],
      price: { amount: 600000, currency: 'credits' },
      removable: true,
      vehicleFilter: {
        include: [{ minLevel: 8, maxLevel: 11, tags: [], mandatoryTags: [], nations: [] }],
        exclude: [{ tags: [], mandatoryTags: ['wheeledVehicle', 'lightTank'], nations: [] }]
      },
      modifiers: [
        { attribute: 'miscAttrs/enginePowerFactor', op: 'mul', value: 1.075, specValue: 1.1 },
        { attribute: 'miscAttrs/forwardMaxSpeedKMHTerm', op: 'add', value: 4, specValue: 5 },
        { attribute: 'miscAttrs/backwardMaxSpeedKMHTerm', op: 'add', value: 2, specValue: 3 }
      ],
      params: {}
    },
    {
      name: 'trophyUpgradedTankRammer',
      id: 53,
      provisionId: 13817,
      nameKey: 'artefacts:trophyBasicTankRammer/name',
      displayName: 'trophyBasicTankRammer/name',
      descriptionKey: 'artefacts:deluxRammer/long_special',
      icon: 'rammer',
      kind: 'trophy',
      script: 'UpgradedStaticDevice',
      archetype: 'tankRammer',
      groupName: 'tankRammer',
      tags: ['rammer', 'firepower', 'trophyUpgraded'],
      categories: [],
      incompatibleTags: ['rammer', 'avgDamage'],
      price: { amount: 100000, currency: 'credits' },
      removable: false,
      vehicleFilter: { include: [{ tags: ['tankRammer_class1_user', 'tankRammer_class2_user'], mandatoryTags: [], nations: [] }], exclude: [] },
      modifiers: [{ attribute: 'miscAttrs/gunReloadTimeFactor', op: 'mul', value: 0.875 }],
      params: {}
    },
    {
      name: 'modernizedAimDrivesAimingStabilizer2',
      id: 151,
      provisionId: 38905,
      nameKey: 'artefacts:modernizedAimDrivesAimingStabilizer2/name',
      displayName: 'modernizedAimDrivesAimingStabilizer2/name',
      descriptionKey: 'artefacts:modernizedAimDrivesAimingStabilizer2/long_special',
      icon: 'modernizedAimDrivesAimingStabilizer',
      kind: 'modernized',
      script: 'UpgradableStaticDevice',
      archetype: 'modernizedAimDrivesAimingStabilizer',
      groupName: 'enhancedAimDrives',
      tags: ['enhancedAimDrives', 'firepower', 'modernized_2'],
      categories: [],
      incompatibleTags: ['enhancedAimDrives'],
      price: { amount: 400, currency: 'equipCoin' },
      removable: false,
      vehicleFilter: {
        include: [{ tags: ['aimingStabilizer_class1_user', 'aimingStabilizer_class2_user'], mandatoryTags: [], nations: [] }],
        exclude: []
      },
      modifiers: [
        { attribute: 'miscAttrs/gunAimingTimeFactor', op: 'mul', value: 0.926 },
        { attribute: 'miscAttrs/additiveShotDispersionFactor', op: 'mul', value: 0.91 }
      ],
      params: {},
      upgradedDevice: 'modernizedAimDrivesAimingStabilizer3'
    }
  ],
  equipment: [
    {
      name: 'autoExtinguishers',
      id: 1,
      provisionId: 507,
      nameKey: 'artefacts:autoExtinguishers/name',
      displayName: 'autoExtinguishers/name',
      descriptionKey: 'artefacts:autoExtinguishers/long_special',
      icon: 'autoExtinguishers',
      kind: 'consumable',
      equipmentType: 'regular',
      script: 'Extinguisher',
      tags: ['extinguisher', 'premium_equipment'],
      incompatibleTags: [],
      price: { amount: 20000, currency: 'credits' },
      notInShop: false,
      vehicleFilter: { include: [{ minLevel: 4, tags: [], mandatoryTags: [], nations: [] }], exclude: [] },
      modifiers: [{ attribute: 'engine/fireStartingChance', op: 'mul', value: 0.9 }],
      params: { fireStartingChanceFactor: 0.9, autoactivate: true, cooldownSeconds: 90, reuseCount: -1, activeSeconds: 3 }
    },
    {
      name: 'largeRepairkit',
      id: 5,
      provisionId: 1531,
      nameKey: 'artefacts:largeRepairkit/name',
      displayName: 'largeRepairkit/name',
      descriptionKey: 'artefacts:largeRepairkit/long_special',
      icon: 'largeRepairkit',
      kind: 'consumable',
      equipmentType: 'regular',
      script: 'Repairkit',
      tags: ['repairkit', 'premium_equipment'],
      incompatibleTags: [],
      price: { amount: 20000, currency: 'credits' },
      notInShop: false,
      vehicleFilter: { include: [], exclude: [{ tags: ['builtinRepairkit_user'], mandatoryTags: [], nations: [] }] },
      modifiers: [{ attribute: 'repairSpeed', op: 'mul', value: 1.1 }],
      params: { repairAll: true, bonusValue: 0.1, cooldownSeconds: 90, activeSeconds: 3, reuseCount: -1 }
    },
    {
      name: 'gasoline100',
      id: 7,
      provisionId: 2043,
      nameKey: 'artefacts:gasoline100/name',
      displayName: 'gasoline100/name',
      descriptionKey: 'artefacts:gasoline100/long_special',
      icon: 'gasoline100',
      kind: 'consumable',
      equipmentType: 'regular',
      script: 'Fuel',
      tags: ['fuel'],
      incompatibleTags: ['fuel'],
      price: { amount: 3000, currency: 'credits' },
      notInShop: false,
      vehicleFilter: {
        include: [{ tags: [], mandatoryTags: [], nations: ['usa', 'germany', 'france', 'uk', 'czech', 'sweden', 'poland', 'italy'] }],
        exclude: []
      },
      modifiers: [
        { attribute: 'engine/power', op: 'mul', value: 1.05 },
        { attribute: 'turret/rotationSpeed', op: 'mul', value: 1.05 }
      ],
      params: { enginePowerFactor: 1.05, turretRotationSpeedFactor: 1.05 }
    },
    {
      name: 'ration',
      id: 11,
      provisionId: 3067,
      nameKey: 'artefacts:ration/name',
      displayName: 'ration/name',
      descriptionKey: 'artefacts:ration/long_special',
      icon: 'ration',
      kind: 'consumable',
      equipmentType: 'regular',
      script: 'Stimulator',
      tags: ['stimulator', 'premium_equipment'],
      incompatibleTags: [],
      price: { amount: 20000, currency: 'credits' },
      notInShop: false,
      vehicleFilter: { include: [{ tags: [], mandatoryTags: [], nations: ['ussr'] }], exclude: [] },
      modifiers: [{ attribute: 'crewLevelIncrease', op: 'add', value: 10 }],
      params: { crewLevelIncrease: 10 }
    },
    {
      name: 'removedRpmLimiter',
      id: 12,
      provisionId: 3323,
      nameKey: 'artefacts:removedRpmLimiter/name',
      displayName: 'removedRpmLimiter/name',
      descriptionKey: 'artefacts:removedRpmLimiter/long_special',
      icon: 'removedRpmLimiter',
      kind: 'consumable',
      equipmentType: 'regular',
      script: 'RemovedRpmLimiter',
      tags: ['trigger'],
      incompatibleTags: [],
      price: { amount: 3000, currency: 'credits' },
      notInShop: false,
      vehicleFilter: { include: [{ tags: [], mandatoryTags: [], nations: ['ussr', 'china'] }], exclude: [] },
      modifiers: [{ attribute: 'engine/power', op: 'mul', condition: 'active', value: 1.1 }],
      params: { enginePowerFactor: 1.1, engineHpLossPerSecond: 1.5 }
    },
    {
      name: 'rammerBattleBooster',
      id: 105,
      provisionId: 27131,
      nameKey: 'artefacts:rammerBattleBooster/name',
      displayName: 'rammerBattleBooster/name',
      descriptionKey: 'artefacts:rammerBattleBooster/long_special',
      icon: 'rammer',
      kind: 'directive',
      equipmentType: 'battleBoosters',
      script: 'FactorBattleBooster',
      tags: ['notForSale', 'equipmentBattleBooster', 'firepower'],
      incompatibleTags: [],
      price: { amount: 12, currency: 'crystal' },
      notInShop: false,
      vehicleFilter: { include: [{ tags: ['tankRammer_class1_user', 'tankRammer_class2_user'], mandatoryTags: [], nations: [] }], exclude: [] },
      modifiers: [
        {
          attribute: 'gun/reloadTime',
          op: 'mul',
          value: 0.972,
          requiresDevice: { required: ['rammer'], incompatible: ['deluxe', 'trophyUpgraded'] }
        },
        { attribute: 'gun/reloadTime', op: 'mul', value: 0.971, requiresDevice: { required: ['rammer', 'deluxe'], incompatible: [] } },
        { attribute: 'gun/reloadTime', op: 'mul', value: 0.971, requiresDevice: { required: ['rammer', 'trophyUpgraded'], incompatible: [] } }
      ],
      params: {}
    },
    {
      name: 'improvedVentilationBattleBooster',
      id: 104,
      provisionId: 26875,
      nameKey: 'artefacts:improvedVentilationBattleBooster/name',
      displayName: 'improvedVentilationBattleBooster/name',
      descriptionKey: 'artefacts:improvedVentilationBattleBooster/long_special',
      icon: 'improvedVentilation',
      kind: 'directive',
      equipmentType: 'battleBoosters',
      script: 'AdditiveBattleBooster',
      tags: ['notForSale', 'equipmentBattleBooster', 'armor', 'firepower', 'camouflage', 'reconnaissance', 'mobility'],
      incompatibleTags: [],
      price: { amount: 12, currency: 'crystal' },
      notInShop: false,
      vehicleFilter: {
        include: [
          {
            tags: ['improvedVentilation_class1_user', 'improvedVentilation_class2_user', 'improvedVentilation_class3_user'],
            mandatoryTags: [],
            nations: []
          }
        ],
        exclude: []
      },
      modifiers: [
        { attribute: 'crewLevelIncrease', op: 'add', value: 2.5, requiresDevice: { required: ['ventilation'], incompatible: ['deluxe'] } },
        { attribute: 'crewLevelIncrease', op: 'add', value: 2.5, requiresDevice: { required: ['ventilation', 'deluxe'], incompatible: [] } }
      ],
      params: {}
    },
    {
      name: 'additInvisibilityDeviceBattleBooster',
      id: 204,
      provisionId: 52475,
      nameKey: 'artefacts:additInvisibilityDeviceBattleBooster/name',
      displayName: 'additInvisibilityDeviceBattleBooster/name',
      descriptionKey: 'artefacts:additInvisibilityDeviceBattleBooster/long_special',
      icon: 'additionalInvisibilityDevice',
      kind: 'directive',
      equipmentType: 'battleBoosters',
      script: 'InvisibilityBattleBooster',
      tags: ['notForSale', 'equipmentBattleBooster', 'additInvisibilityDevice', 'notBuyWhenAutoEquip'],
      incompatibleTags: [],
      price: { amount: 12, currency: 'crystal' },
      notInShop: true,
      vehicleFilter: { include: [], exclude: [] },
      modifiers: [
        { attribute: 'invisibility/additive', op: 'add', value: 0.02, requiresDevice: { required: ['additInvisibilityDevice'], incompatible: [] } },
        { attribute: 'invisibility/mult', op: 'mul', value: 1, requiresDevice: { required: ['additInvisibilityDevice'], incompatible: [] } }
      ],
      params: {}
    },
    {
      name: 'virtuosoBattleBooster',
      id: 111,
      provisionId: 28667,
      nameKey: 'artefacts:virtuosoBattleBooster/name',
      displayName: 'virtuosoBattleBooster/name',
      descriptionKey: 'artefacts:virtuosoBattleBooster/long_special',
      icon: 'driver_virtuoso',
      kind: 'directive',
      equipmentType: 'battleBoosters',
      script: 'SkillEquipment',
      tags: ['notForSale', 'crewSkillBattleBooster', 'mobility'],
      incompatibleTags: [],
      price: { amount: 10000, currency: 'credits' },
      notInShop: false,
      vehicleFilter: { include: [], exclude: [] },
      modifiers: [],
      skillBoost: { skill: 'driver_virtuoso', perkLevelMultiplier: 2 },
      params: { skillName: 'driver_virtuoso', perkLevelMultiplier: 2 }
    },
    {
      name: 'creditsDirectivesBattleBooster1',
      id: 206,
      provisionId: 52987,
      nameKey: 'artefacts:creditsDirectivesBattleBooster1/name',
      displayName: 'creditsDirectivesBattleBooster1/name',
      descriptionKey: 'artefacts:creditsDirectivesBattleBooster1/long_special',
      icon: 'creditsDirectivesBattleBooster1',
      kind: 'directive',
      equipmentType: 'battleBoosters',
      script: 'EconomicDirectives',
      tags: ['notForSale', 'economicDirectiveBattleBooster', 'notBuyWhenAutoEquip'],
      incompatibleTags: [],
      price: { amount: 10000, currency: 'credits' },
      notInShop: true,
      vehicleFilter: { include: [], exclude: [] },
      modifiers: [{ attribute: 'economy/Credits', op: 'mul', value: 1.25 }],
      params: {}
    },
    {
      name: 'artillery_epic',
      id: 118,
      provisionId: 30459,
      nameKey: 'artefacts:artillery/name',
      displayName: 'artillery/name',
      descriptionKey: 'artefacts:artillery/shortDescr',
      icon: 'artillery',
      kind: 'ability',
      equipmentType: 'battleAbilities',
      script: 'ConsumableArtillery',
      tags: ['notForSale', 'avatar', 'trigger'],
      incompatibleTags: [],
      price: { amount: 150, currency: 'gold' },
      notInShop: true,
      vehicleFilter: { include: [{ minLevel: 8, maxLevel: 8, tags: [], mandatoryTags: [], nations: [] }], exclude: [] },
      modifiers: [],
      params: {
        shortDescription: '#artefacts:artillery/shortDescr',
        longDescription: '#artefacts:artillery/longDescr',
        shortFilterAlert: '',
        longFilterAlert: '',
        tooltips: 'cooldownTime delay areaRadius shotsNumber duration-artillery',
        cooldownTime: 150,
        cooldownFactors: '',
        sharedCooldownTime: 3,
        consumeAmmo: false,
        disableAllyDamage: false,
        delay: 4,
        duration: 4,
        shotsNumber: 40,
        areaRadius: 12,
        shellCompactDescr: 33306,
        piercingPower: '80 80',
        areaVisual: 'content/Interface/TargetPoint/TargetPoint.visual',
        noOwner: false
      }
    }
  ],
  crew: {
    roles: [
      {
        role: 'commander',
        nameKey: 'item_types:tankman/roles/commander',
        displayName: 'tankman/roles/commander',
        icon: 'commander.png',
        skills: ['repair', 'brotherhood', 'commander_eagleEye']
      },
      {
        role: 'radioman',
        nameKey: 'item_types:tankman/roles/radioman',
        displayName: 'tankman/roles/radioman',
        icon: 'radioman.png',
        skills: ['repair', 'brotherhood', 'radioman_finder', 'radioman_inventor']
      },
      {
        role: 'driver',
        nameKey: 'item_types:tankman/roles/driver',
        displayName: 'tankman/roles/driver',
        icon: 'driver.png',
        skills: ['repair', 'brotherhood', 'driver_smoothDriving', 'driver_virtuoso']
      },
      {
        role: 'gunner',
        nameKey: 'item_types:tankman/roles/gunner',
        displayName: 'tankman/roles/gunner',
        icon: 'gunner.png',
        skills: ['repair', 'brotherhood', 'gunner_smoothTurret']
      },
      {
        role: 'loader',
        nameKey: 'item_types:tankman/roles/loader',
        displayName: 'tankman/roles/loader',
        icon: 'loader.png',
        skills: ['repair', 'brotherhood', 'loader_desperado']
      }
    ],
    skills: [
      {
        name: 'repair',
        role: 'common',
        roles: ['commander', 'gunner', 'driver', 'radioman', 'loader'],
        isCommon: true,
        typeName: 'common',
        singleOnVehicle: false,
        params: [{ name: 'vehicleRepairSpeed', perLevel: 0.008, situational: false, measureType: 'percents' }],
        extras: {}
      },
      {
        name: 'brotherhood',
        role: 'common',
        roles: ['commander', 'gunner', 'driver', 'radioman', 'loader'],
        isCommon: true,
        typeName: 'common',
        singleOnVehicle: false,
        params: [{ name: 'crewLevelIncrease', perLevel: 0.0005, situational: false, measureType: 'percents' }],
        extras: { crewLevelIncrease: 5 }
      },
      {
        name: 'commander_eagleEye',
        role: 'commander',
        roles: ['commander'],
        isCommon: false,
        vsePerk: 101,
        singleOnVehicle: false,
        params: [
          { situational: false, name: 'circularVisionRadius', perLevel: 0.0002, measureType: 'percents' },
          { situational: true, name: 'circularVisionRadiusWhileSurveyingDeviceDamaged', perLevel: 0.002, measureType: 'percents' }
        ],
        extras: {}
      },
      {
        name: 'gunner_smoothTurret',
        role: 'gunner',
        roles: ['gunner'],
        isCommon: false,
        vsePerk: 201,
        singleOnVehicle: true,
        params: [{ situational: false, name: 'turretAimingDispersion', perLevel: -0.00075, measureType: 'percents' }],
        extras: {}
      },
      {
        name: 'driver_smoothDriving',
        role: 'driver',
        roles: ['driver'],
        isCommon: false,
        vsePerk: 302,
        singleOnVehicle: false,
        params: [
          { name: 'vehicleGunShotDispersionChassisMovement', perLevel: -0.0004, situational: false, measureType: 'percents' },
          { situational: false, name: 'movingAimingDispersion', perLevel: -0.0004 }
        ],
        extras: {}
      },
      {
        name: 'driver_virtuoso',
        role: 'driver',
        roles: ['driver'],
        isCommon: false,
        vsePerk: 301,
        singleOnVehicle: false,
        params: [{ situational: false, name: 'vehicleAllGroundRotationSpeed', perLevel: 0.0005, measureType: 'percents' }],
        extras: {}
      },
      {
        name: 'radioman_finder',
        role: 'radioman',
        roles: ['radioman'],
        isCommon: false,
        vsePerk: 501,
        singleOnVehicle: true,
        params: [{ situational: false, name: 'vehicleCircularVisionRadius', perLevel: 0.0003, measureType: 'percents' }],
        extras: {}
      },
      {
        name: 'radioman_inventor',
        role: 'radioman',
        roles: ['radioman'],
        isCommon: false,
        vsePerk: 505,
        singleOnVehicle: true,
        params: [{ situational: false, name: 'radioDistance', perLevel: 0.002, measureType: 'percents' }],
        extras: {}
      },
      {
        name: 'loader_desperado',
        role: 'loader',
        roles: ['loader'],
        isCommon: false,
        typeName: 'situational',
        vsePerk: 401,
        singleOnVehicle: true,
        params: [
          { name: 'vehicleGunReloadTime', perLevel: -0.001, situational: true, measureType: 'percents' },
          { name: 'temperatureGunHeating', perLevel: -0.001, situational: true, measureType: 'percents' },
          { name: 'gunReloadSpeed', perLevel: -0.001, situational: true },
          { name: 'reloadTime', perLevel: -0.001, situational: true },
          { name: 'reloadTimeSecs', perLevel: -0.001, situational: true },
          { name: 'avgDamagePerMinute', perLevel: -0.001, situational: true },
          { name: 'autoReloadTime', perLevel: -0.001, situational: true },
          { name: 'clipFireRate', perLevel: -0.001, situational: true },
          { name: 'autoShootFireUntilOverheatTime', perLevel: 0.001, situational: true },
          { name: 'autoShootFlameChangeShellTime', perLevel: -0.001, situational: true }
        ],
        extras: {}
      }
    ]
  },
  postProgression: {
    trees: [
      {
        name: 'role_HT_break',
        id: 1206,
        rootStep: 1,
        steps: [
          { id: 1, level: 1, priceKey: 'unlockBaseModificationCost', action: { type: 'feature', value: 'shells_consumables_switch' }, unlocks: [2] },
          {
            id: 2,
            level: 2,
            priceKey: 'unlockBaseModificationCost',
            action: { type: 'modification', value: 'role_heavyTank_base_1' },
            unlocks: [3, 101]
          },
          {
            id: 101,
            level: 2,
            priceKey: 'unlockPairModificationCost',
            action: { type: 'pair_modification', value: 'role_heavyTank_pair_1' },
            unlocks: []
          },
          { id: 3, level: 3, priceKey: 'unlockBaseModificationCost', action: { type: 'feature', value: 'opt_dev_boosters_switch' }, unlocks: [4] },
          {
            id: 4,
            level: 4,
            priceKey: 'unlockBaseModificationCost',
            action: { type: 'modification', value: 'role_heavyTank_base_2' },
            unlocks: [5, 102]
          },
          {
            id: 102,
            level: 4,
            priceKey: 'unlockPairModificationCost',
            action: { type: 'pair_modification', value: 'role_heavyTank_pair_2' },
            unlocks: []
          },
          {
            id: 5,
            level: 5,
            priceKey: 'unlockBaseModificationCost',
            action: { type: 'modification', value: 'role_heavyTank_base_3' },
            unlocks: [6, 103]
          },
          {
            id: 103,
            level: 5,
            priceKey: 'unlockPairModificationCost',
            action: { type: 'pair_modification', value: 'role_heavyTank_pair_3' },
            unlocks: []
          },
          {
            id: 6,
            level: 6,
            priceKey: 'unlockBaseModificationCost',
            action: { type: 'feature', value: 'roleSlot' },
            unlocks: [7],
            minVehicleLevel: 8
          },
          {
            id: 7,
            level: 7,
            priceKey: 'unlockBaseModificationCost',
            action: { type: 'modification', value: 'role_HT_break_base_4' },
            unlocks: [8, 124],
            minVehicleLevel: 9
          },
          {
            id: 124,
            level: 7,
            priceKey: 'unlockPairModificationCost',
            action: { type: 'pair_modification', value: 'role_HT_break_pair_4' },
            unlocks: [],
            minVehicleLevel: 9
          },
          {
            id: 8,
            level: 8,
            priceKey: 'unlockBaseModificationCost',
            action: { type: 'modification', value: 'role_HT_break_base_5' },
            unlocks: [125],
            minVehicleLevel: 10
          },
          {
            id: 125,
            level: 8,
            priceKey: 'unlockPairModificationCost',
            action: { type: 'pair_modification', value: 'role_HT_break_pair_5' },
            unlocks: [],
            minVehicleLevel: 10
          }
        ]
      }
    ],
    modifications: [
      {
        name: 'role_heavyTank_base_1',
        id: 101,
        provisionId: 26096,
        locName: 'additional_armor_plates_1',
        modifiers: [{ attribute: 'miscAttrs/healthFactor', op: 'mul', value: 1.01 }]
      },
      {
        name: 'role_heavyTank_base_2',
        id: 102,
        provisionId: 26352,
        locName: 'additional_armor_plates_1',
        modifiers: [{ attribute: 'miscAttrs/healthFactor', op: 'mul', value: 1.01 }]
      },
      {
        name: 'role_heavyTank_base_3',
        id: 103,
        provisionId: 26608,
        locName: 'additional_armor_plates_1',
        modifiers: [{ attribute: 'miscAttrs/healthFactor', op: 'mul', value: 1.01 }]
      },
      {
        name: 'role_HT_break_base_4',
        id: 124,
        provisionId: 31984,
        locName: 'fuel_system_revision_1',
        modifiers: [{ attribute: 'miscAttrs/enginePowerFactor', op: 'mul', value: 1.01 }]
      },
      {
        name: 'role_HT_break_base_5',
        id: 125,
        provisionId: 32240,
        locName: 'fuel_system_revision_1',
        modifiers: [{ attribute: 'miscAttrs/enginePowerFactor', op: 'mul', value: 1.01 }]
      },
      {
        name: 'role_heavyTank_pair_1_1',
        id: 1011,
        provisionId: 259056,
        imgName: 'additionalGrousers',
        modifiers: [
          { attribute: 'miscAttrs/rollingFrictionFactor', op: 'mul', value: 0.934 },
          { attribute: 'miscAttrs/onStillRotationSpeedFactor', op: 'mul', value: 0.95 },
          { attribute: 'miscAttrs/onMoveRotationSpeedFactor', op: 'mul', value: 0.95 },
          { attribute: 'miscAttrs/chassisHealthFactor', op: 'mul', value: 0.9 }
        ]
      },
      {
        name: 'role_heavyTank_pair_1_2',
        id: 1012,
        provisionId: 259312,
        imgName: 'betterFriction',
        modifiers: [
          { attribute: 'miscAttrs/onStillRotationSpeedFactor', op: 'mul', value: 1.05 },
          { attribute: 'miscAttrs/onMoveRotationSpeedFactor', op: 'mul', value: 1.05 },
          { attribute: 'miscAttrs/chassisHealthFactor', op: 'mul', value: 1.1 },
          { attribute: 'miscAttrs/rollingFrictionFactor', op: 'mul', value: 1.075 }
        ]
      },
      {
        name: 'role_heavyTank_pair_2_1',
        id: 1021,
        provisionId: 261616,
        imgName: 'improvedScope',
        modifiers: [
          { attribute: 'miscAttrs/multShotDispersionFactor', op: 'mul', value: 0.97 },
          { attribute: 'miscAttrs/gunAimingTimeFactor', op: 'mul', value: 1.05 }
        ]
      },
      {
        name: 'role_heavyTank_pair_2_2',
        id: 1022,
        provisionId: 261872,
        imgName: 'improvedAimingHandling',
        modifiers: [
          { attribute: 'miscAttrs/gunAimingTimeFactor', op: 'mul', value: 0.95 },
          { attribute: 'miscAttrs/multShotDispersionFactor', op: 'mul', value: 1.03 }
        ]
      },
      {
        name: 'role_heavyTank_pair_3_1',
        id: 1031,
        provisionId: 264176,
        imgName: 'improvedSpallingResistance',
        modifiers: [
          { attribute: 'miscAttrs/crewChanceToHitFactor', op: 'mul', value: 1.1 },
          { attribute: 'miscAttrs/circularVisionRadiusBaseFactor', op: 'mul', value: 0.97 }
        ]
      },
      {
        name: 'role_heavyTank_pair_3_2',
        id: 1032,
        provisionId: 264432,
        imgName: 'improvedObservationDevice',
        modifiers: [
          { attribute: 'miscAttrs/circularVisionRadiusBaseFactor', op: 'mul', value: 1.03 },
          { attribute: 'miscAttrs/crewChanceToHitFactor', op: 'mul', value: 0.9 }
        ]
      },
      {
        name: 'role_HT_break_pair_4_1',
        id: 1241,
        provisionId: 317936,
        imgName: 'improvedSpeedIndicator',
        modifiers: [
          { attribute: 'miscAttrs/forwardMaxSpeedKMHTerm', op: 'add', value: 4 },
          { attribute: 'miscAttrs/turretRotationSpeed', op: 'mul', value: 0.93 },
          { attribute: 'miscAttrs/gunAimingTimeFactor', op: 'mul', value: 1.05 }
        ]
      },
      {
        name: 'role_HT_break_pair_4_2',
        id: 1242,
        provisionId: 318192,
        imgName: 'improvedTurretTurningWheels',
        modifiers: [
          { attribute: 'miscAttrs/turretRotationSpeed', op: 'mul', value: 1.07 },
          { attribute: 'miscAttrs/gunAimingTimeFactor', op: 'mul', value: 0.95 },
          { attribute: 'miscAttrs/forwardMaxSpeedKMHTerm', op: 'add', value: -4 }
        ]
      },
      {
        name: 'role_HT_break_pair_5_1',
        id: 1251,
        provisionId: 320496,
        imgName: 'increasedThickness',
        modifiers: [
          { attribute: 'miscAttrs/healthFactor', op: 'mul', value: 1.02 },
          { attribute: 'miscAttrs/chassis/shotDispersionFactors/movement', op: 'mul', value: 1.04 },
          { attribute: 'miscAttrs/chassis/shotDispersionFactors/rotation', op: 'mul', value: 1.04 }
        ]
      },
      {
        name: 'role_HT_break_pair_5_2',
        id: 1252,
        provisionId: 320752,
        imgName: 'improvedChassisStability',
        modifiers: [
          { attribute: 'miscAttrs/chassis/shotDispersionFactors/movement', op: 'mul', value: 0.96 },
          { attribute: 'miscAttrs/chassis/shotDispersionFactors/rotation', op: 'mul', value: 0.96 },
          { attribute: 'miscAttrs/healthFactor', op: 'mul', value: 0.98 }
        ]
      }
    ],
    pairs: [
      {
        name: 'role_heavyTank_pair_1',
        id: 6101,
        first: 'role_heavyTank_pair_1_1',
        second: 'role_heavyTank_pair_1_2',
        priceKey: 'buyPairModificationCost'
      },
      {
        name: 'role_heavyTank_pair_2',
        id: 6102,
        first: 'role_heavyTank_pair_2_1',
        second: 'role_heavyTank_pair_2_2',
        priceKey: 'buyPairModificationCost'
      },
      {
        name: 'role_heavyTank_pair_3',
        id: 6103,
        first: 'role_heavyTank_pair_3_1',
        second: 'role_heavyTank_pair_3_2',
        priceKey: 'buyPairModificationCost'
      },
      {
        name: 'role_HT_break_pair_4',
        id: 6124,
        first: 'role_HT_break_pair_4_1',
        second: 'role_HT_break_pair_4_2',
        priceKey: 'buyPairModificationCost'
      },
      {
        name: 'role_HT_break_pair_5',
        id: 6125,
        first: 'role_HT_break_pair_5_1',
        second: 'role_HT_break_pair_5_2',
        priceKey: 'buyPairModificationCost'
      }
    ],
    features: [
      { name: 'shells_consumables_switch', id: 1, imgName: 'shellsConsumablesSwitch', locName: 'shells_consumables_switch' },
      { name: 'opt_dev_boosters_switch', id: 2, imgName: 'optDevBoostersSwitch', locName: 'opt_dev_boosters_switch' },
      { name: 'roleSlot', id: 3, imgName: 'roleSlot', locName: 'roleSlot' }
    ],
    prices: {
      unlockBaseModificationCost: {
        '6': { amount: 3500, currency: 'xp' },
        '7': { amount: 7000, currency: 'xp' },
        '8': { amount: 11500, currency: 'xp' },
        '9': { amount: 20000, currency: 'xp' },
        '10': { amount: 28000, currency: 'xp' },
        '11': { amount: 50000, currency: 'xp' }
      },
      unlockPairModificationCost: {
        '6': { amount: 0, currency: 'xp' },
        '7': { amount: 0, currency: 'xp' },
        '8': { amount: 0, currency: 'xp' },
        '9': { amount: 0, currency: 'xp' },
        '10': { amount: 0, currency: 'xp' },
        '11': { amount: 0, currency: 'xp' }
      },
      buyPairModificationCost: {
        '6': { amount: 10000, currency: 'credits' },
        '7': { amount: 25000, currency: 'credits' },
        '8': { amount: 50000, currency: 'credits' },
        '9': { amount: 100000, currency: 'credits' },
        '10': { amount: 150000, currency: 'credits' },
        '11': { amount: 200000, currency: 'credits' }
      }
    }
  }
};
