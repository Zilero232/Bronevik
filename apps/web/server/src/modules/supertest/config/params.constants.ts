export const SUPERTEST_UNITS = {
  s: 's',
  m: 'm',
  mm: 'mm',
  hp: 'hp',
  kmh: 'kmh',
  deg: 'deg',
  degS: 'deg_s',
  t: 't',
  hpT: 'hp_t',
  perMin: 'per_min',
  percent: 'percent'
} as const;

export const SHELL_QUALIFIERS = [
  { kind: 'ARMOR_PIERCING_CR', pattern: /подкалиберн/iu },
  { kind: 'HOLLOW_CHARGE', pattern: /кумулятивн/iu },
  { kind: 'HIGH_EXPLOSIVE', pattern: /фугасн/iu },
  { kind: 'ARMOR_PIERCING', pattern: /бронебойн/iu }
] as const;

export const SUPERTEST_PARAMS = [
  { key: 'damagePerMinute', pattern: /урон\p{L}*\s+в\s+минуту|dpm|дпм/iu, unit: SUPERTEST_UNITS.hp, isLowerBetter: false },
  { key: 'clipReloadTime', pattern: /перезарядк\p{L}*\s+(?:кассет|магазин|барабан|обойм)/iu, unit: SUPERTEST_UNITS.s, isLowerBetter: true },
  { key: 'clipInterval', pattern: /(?:между\s+выстрел|внутри\s*кассет)/iu, unit: SUPERTEST_UNITS.s, isLowerBetter: true },
  { key: 'reloadTime', pattern: /перезарядк/iu, unit: SUPERTEST_UNITS.s, isLowerBetter: true },
  { key: 'rateOfFire', pattern: /скорострельн/iu, unit: SUPERTEST_UNITS.perMin, isLowerBetter: false },
  { key: 'aimingTime', pattern: /сведени/iu, unit: SUPERTEST_UNITS.s, isLowerBetter: true },
  { key: 'dispersionMovement', pattern: /разброс.*(?:движени|ходу|перемещени)/iu, unit: null, isLowerBetter: true },
  { key: 'dispersionHullRotation', pattern: /разброс.*поворот\p{L}*\s+(?:корпус|шасси|машин)/iu, unit: null, isLowerBetter: true },
  { key: 'dispersionTurretRotation', pattern: /разброс.*поворот\p{L}*\s+башн/iu, unit: null, isLowerBetter: true },
  { key: 'dispersion', pattern: /разброс/iu, unit: SUPERTEST_UNITS.m, isLowerBetter: true },
  { key: 'shellVelocity', pattern: /скорост\p{L}*\s+полёта|скорост\p{L}*\s+полета|скорост\p{L}*\s+снаряд/iu, unit: null, isLowerBetter: false },
  { key: 'shellPenetration', pattern: /пробити|бронепробива/iu, unit: SUPERTEST_UNITS.mm, isLowerBetter: false },
  { key: 'shellDamage', pattern: /урон/iu, unit: SUPERTEST_UNITS.hp, isLowerBetter: false },
  { key: 'depression', pattern: /склонени|вниз/iu, unit: SUPERTEST_UNITS.deg, isLowerBetter: false },
  { key: 'elevation', pattern: /возвышени|вверх/iu, unit: SUPERTEST_UNITS.deg, isLowerBetter: false },
  { key: 'armorTurretFront', pattern: /(?:брон|толщин).*(?:лоб|лобов).*башн/iu, unit: SUPERTEST_UNITS.mm, isLowerBetter: false },
  { key: 'armorTurretSide', pattern: /(?:брон|толщин).*борт.*башн/iu, unit: SUPERTEST_UNITS.mm, isLowerBetter: false },
  { key: 'armorTurretRear', pattern: /(?:брон|толщин).*корм.*башн/iu, unit: SUPERTEST_UNITS.mm, isLowerBetter: false },
  { key: 'armorHullFront', pattern: /(?:брон|толщин).*(?:лоб|лобов|влд|нлд)\p{L}*/iu, unit: SUPERTEST_UNITS.mm, isLowerBetter: false },
  { key: 'armorHullSide', pattern: /(?:брон|толщин).*борт/iu, unit: SUPERTEST_UNITS.mm, isLowerBetter: false },
  { key: 'armorHullRear', pattern: /(?:брон|толщин).*корм/iu, unit: SUPERTEST_UNITS.mm, isLowerBetter: false },
  { key: 'armor', pattern: /бронировани|толщин\p{L}*\s+брони/iu, unit: SUPERTEST_UNITS.mm, isLowerBetter: false },
  { key: 'maxHealth', pattern: /прочност|очк\p{L}*\s+здоровья|^hp$/iu, unit: SUPERTEST_UNITS.hp, isLowerBetter: false },
  { key: 'viewRange', pattern: /обзор/iu, unit: SUPERTEST_UNITS.m, isLowerBetter: false },
  { key: 'radioRange', pattern: /дальност\p{L}*\s+связи|радиостанц/iu, unit: SUPERTEST_UNITS.m, isLowerBetter: false },
  { key: 'powerToWeight', pattern: /удельн\p{L}*\s+мощност/iu, unit: SUPERTEST_UNITS.hpT, isLowerBetter: false },
  { key: 'enginePower', pattern: /мощност\p{L}*\s+двигател/iu, unit: SUPERTEST_UNITS.hp, isLowerBetter: false },
  { key: 'turretTraverse', pattern: /(?:поворот|вращени)\p{L}*\s+башн/iu, unit: SUPERTEST_UNITS.degS, isLowerBetter: false },
  { key: 'hullTraverse', pattern: /(?:поворот|вращени)\p{L}*\s+(?:корпус|шасси|машин|ходов)/iu, unit: SUPERTEST_UNITS.degS, isLowerBetter: false },
  { key: 'speedBackward', pattern: /скорост.*(?:назад|задн)/iu, unit: SUPERTEST_UNITS.kmh, isLowerBetter: false },
  { key: 'speedForward', pattern: /скорост/iu, unit: SUPERTEST_UNITS.kmh, isLowerBetter: false },
  { key: 'weight', pattern: /масса|вес(?!\p{L})/iu, unit: SUPERTEST_UNITS.t, isLowerBetter: true },
  { key: 'camouflage', pattern: /маскировк|незаметност/iu, unit: SUPERTEST_UNITS.percent, isLowerBetter: false }
] as const;

export const PARSED_UNITS = [
  { unit: SUPERTEST_UNITS.kmh, pattern: /^км\s*\/\s*ч/iu },
  { unit: SUPERTEST_UNITS.degS, pattern: /^(?:°|град\p{L}*\.?)\s*\/\s*с/iu },
  { unit: SUPERTEST_UNITS.perMin, pattern: /^выстр\p{L}*\.?\s*\/\s*мин/iu },
  { unit: SUPERTEST_UNITS.hpT, pattern: /^л\.\s*с\.\s*\/\s*т/iu },
  { unit: SUPERTEST_UNITS.mm, pattern: /^мм(?!\p{L})/iu },
  { unit: SUPERTEST_UNITS.s, pattern: /^(?:сек\p{L}*\.?|с\.?)(?!\p{L})/iu },
  { unit: SUPERTEST_UNITS.m, pattern: /^(?:м\.?|метр\p{L}*)(?!\p{L})/iu },
  { unit: SUPERTEST_UNITS.hp, pattern: /^(?:ед\.?|hp|л\.\s*с\.?)/iu },
  { unit: SUPERTEST_UNITS.deg, pattern: /^(?:°|град\p{L}*\.?)/iu },
  { unit: SUPERTEST_UNITS.t, pattern: /^(?:т\.?|тонн\p{L}*)(?!\p{L})/iu },
  { unit: SUPERTEST_UNITS.percent, pattern: /^%/u }
] as const;
