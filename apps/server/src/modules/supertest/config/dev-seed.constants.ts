export const SUPERTEST_DEV = {
  tier: 10,
  tanksPerAnnouncement: 3,
  announcements: 2,
  path: '/dev/supertest',
  daysApart: 6,
  newVehicleName: 'DEV Прототип СТ-1',
  plans: [
    [
      { param: 'reloadTime', label: 'Время перезарядки', shift: -0.05, digits: 2 },
      { param: 'aimingTime', label: 'Время сведения', shift: -0.08, digits: 2 },
      { param: 'dispersion', label: 'Разброс на 100 м', shift: 0.05, digits: 3 },
      { param: 'maxHealth', label: 'Прочность', shift: 0.04, digits: 0 }
    ],
    [
      { param: 'shellDamage', label: 'Урон', shift: 0.06, digits: 0 },
      { param: 'shellPenetration', label: 'Бронепробиваемость', shift: -0.04, digits: 0 },
      { param: 'viewRange', label: 'Обзор', shift: 0.025, digits: 0 }
    ],
    [
      { param: 'speedForward', label: 'Максимальная скорость', shift: 0.08, digits: 0 },
      { param: 'hullTraverse', label: 'Скорость поворота корпуса', shift: 0.1, digits: 1 },
      { param: 'turretTraverse', label: 'Скорость поворота башни', shift: -0.06, digits: 1 },
      { param: 'dispersionMovement', label: 'Разброс при движении', shift: -0.1, digits: 3 }
    ]
  ],
  newVehicle: [
    { param: 'maxHealth', label: 'Прочность', value: 1950, unit: 'hp' },
    { param: 'shellDamage', label: 'Урон', value: 390, unit: 'hp' },
    { param: 'shellPenetration', label: 'Бронепробиваемость', value: 258, unit: 'mm' },
    { param: 'reloadTime', label: 'Время перезарядки', value: 9.6, unit: 's' },
    { param: 'viewRange', label: 'Обзор', value: 390, unit: 'm' },
    { param: 'speedForward', label: 'Максимальная скорость', value: 50, unit: 'kmh' }
  ]
} as const;
