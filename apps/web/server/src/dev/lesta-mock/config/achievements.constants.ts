export const ACHIEVEMENT_IMAGES = {
  base: 'https://api.tanki.su/static/2.80.0/wot/encyclopedia/achievement',
  big: 'big'
} as const;

export const ACHIEVEMENT_SECTIONS = {
  battle: { name: 'Герои битвы', order: 1 },
  epic: { name: 'Эпические достижения', order: 2 },
  group: { name: 'Групповые достижения', order: 3 },
  special: { name: 'Особые', order: 4 },
  class: { name: 'Этапные', order: 5 },
  memorial: { name: 'Памятные', order: 6 },
  action: { name: 'Памятные события', order: 7 }
} as const;

export const STAGE_METRICS = ['heroes', 'frags', 'damage', 'spotted', 'survivedWins', 'capture', 'defense', 'highTierFrags'] as const;

export const MOCK_ACHIEVEMENTS = [
  {
    name: 'warrior',
    section: 'battle',
    type: 'repeatable',
    title: 'Воин',
    description: 'Уничтожить не менее 6 машин противника.',
    rule: { kind: 'rate', base: 0.0045, power: 3 }
  },
  {
    name: 'invader',
    section: 'battle',
    type: 'repeatable',
    title: 'Захватчик',
    description: 'Набрать 80 очков захвата базы и не погибнуть до конца боя.',
    rule: { kind: 'rate', base: 0.004, power: 1 }
  },
  {
    name: 'sniper2',
    section: 'battle',
    type: 'repeatable',
    title: 'Снайпер',
    description: 'Не менее 10 попаданий подряд с нанесением урона при точности от 85%.',
    rule: { kind: 'rate', base: 0.0016, power: 2 }
  },
  {
    name: 'defender',
    section: 'battle',
    type: 'repeatable',
    title: 'Защитник',
    description: 'Сбить 70 и более очков захвата своей базы.',
    rule: { kind: 'rate', base: 0.0022, power: 1 }
  },
  {
    name: 'steelwall',
    section: 'battle',
    type: 'repeatable',
    title: 'Стальная стена',
    description: 'Получить не менее 11 попаданий и заблокировать более 1000 урона, не погибнув.',
    rule: { kind: 'rate', base: 0.02, power: 1.5, type: 'heavyTank' }
  },
  {
    name: 'supporter',
    section: 'battle',
    type: 'repeatable',
    title: 'Поддержка',
    description: 'Нанести урон не менее чем шести машинам, уничтоженным союзниками.',
    rule: { kind: 'rate', base: 0.0024, power: 1.5 }
  },
  {
    name: 'scout',
    section: 'battle',
    type: 'repeatable',
    title: 'Разведчик',
    description: 'Обнаружить не менее 9 машин противника.',
    rule: { kind: 'rate', base: 0.03, power: 1.5, type: 'lightTank' }
  },
  {
    name: 'evileye',
    section: 'battle',
    type: 'repeatable',
    title: 'Дозорный',
    description: 'Помочь союзникам уничтожить не менее двух машин, обнаружив их.',
    rule: { kind: 'rate', base: 0.012, power: 1.5, type: 'lightTank' }
  },
  {
    name: 'mainGun',
    section: 'battle',
    type: 'repeatable',
    title: 'Основной калибр',
    description: 'Нанести больше всех урона в бою и не менее 20% суммарной прочности противника.',
    rule: { kind: 'rate', base: 0.008, power: 2.5 }
  },
  {
    name: 'medalKolobanov',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Колобанова',
    description: 'Одному сражаться против пяти и более противников и победить.',
    rule: { kind: 'rate', base: 0.00012, power: 3 }
  },
  {
    name: 'medalRadleyWalters',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Рэдли-Уолтерса',
    description: 'Уничтожить от 8 до 9 машин противника на машине V уровня и выше.',
    rule: { kind: 'rate', base: 0.0001, power: 3.5 }
  },
  {
    name: 'medalPascucci',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Паскуччи',
    description: 'Уничтожить 2 и более САУ противника в одном бою.',
    rule: { kind: 'rate', base: 0.0003, power: 2 }
  },
  {
    name: 'medalOrlik',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Орлика',
    description: 'Уничтожить 3 и более машины противника уровнем выше.',
    rule: { kind: 'rate', base: 0.0002, power: 2 }
  },
  {
    name: 'medalOskin',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Оськина',
    description: 'Уничтожить 3 и более машины противника уровнем выше на среднем танке.',
    rule: { kind: 'rate', base: 0.00015, power: 2 }
  },
  {
    name: 'medalHalonen',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Халонена',
    description: 'Уничтожить 3 и более машины противника уровнем выше на ПТ-САУ.',
    rule: { kind: 'rate', base: 0.0001, power: 2 }
  },
  {
    name: 'medalBurda',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Бурды',
    description: 'Уничтожить 5 и более машин противника уровнем выше на лёгком танке.',
    rule: { kind: 'rate', base: 0.0003, power: 2 }
  },
  {
    name: 'medalBillotte',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Бийота',
    description: 'Выжить с малым запасом прочности и уничтожить не менее 3 машин.',
    rule: { kind: 'rate', base: 0.0003, power: 2 }
  },
  {
    name: 'medalFadin',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Фадина',
    description: 'Последним выстрелом в бою уничтожить машину противника.',
    rule: { kind: 'rate', base: 0.00005, power: 1 }
  },
  {
    name: 'medalNikolas',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Николса',
    description: 'Одному уничтожить 4 и более машины противника и победить.',
    rule: { kind: 'rate', base: 0.0001, power: 3 }
  },
  {
    name: 'medalLafayettePool',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Пула',
    description: 'Уничтожить 10-14 машин противника.',
    rule: { kind: 'rate', base: 0.00006, power: 4 }
  },
  {
    name: 'medalBrunoPietro',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Бруно',
    description: 'Уничтожить не менее 5 машин и не погибнуть.',
    rule: { kind: 'rate', base: 0.0002, power: 3 }
  },
  {
    name: 'medalTarczay',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Тарцая',
    description: 'Уничтожить 4 и более машины противника с малым запасом прочности.',
    rule: { kind: 'rate', base: 0.0001, power: 3 }
  },
  {
    name: 'medalDeLanglade',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль де Ланглада',
    description: 'Уничтожить 4 и более машины противника, захватывающие базу.',
    rule: { kind: 'rate', base: 0.0003, power: 1.5 }
  },
  {
    name: 'medalTamadaYoshio',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Тамады Йошио',
    description: 'Уничтожить 2 и более машины противника уровнем выше на лёгком танке.',
    rule: { kind: 'rate', base: 0.0002, power: 2 }
  },
  {
    name: 'heroesOfRassenay',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль героев Расейняя',
    description: 'Уничтожить 14 и более машин противника.',
    rule: { kind: 'rate', base: 0.000004, power: 5 }
  },
  {
    name: 'medalBoelter',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Бёльтера',
    description: 'Уничтожить 6 и более машин противника на машине уровнем не выше VI.',
    rule: { kind: 'rate', base: 0.0003, power: 3 }
  },
  {
    name: 'medalDumitru',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Думитру',
    description: 'Победить во взводе, уничтожив 4 и более машины.',
    rule: { kind: 'rate', base: 0.0002, power: 2.5 }
  },
  {
    name: 'medalLehvaslaiho',
    section: 'epic',
    type: 'repeatable',
    title: 'Медаль Лехвеслайхо',
    description: 'Уничтожить 2 и более машины противника уровнем выше на среднем танке.',
    rule: { kind: 'rate', base: 0.0002, power: 2 }
  },
  {
    name: 'medalBrothersInArms',
    section: 'group',
    type: 'repeatable',
    title: 'Братья по оружию',
    description: 'Победить во взводе, в котором каждый уничтожил 3 и более машины и выжил.',
    rule: { kind: 'rate', base: 0.0006, power: 2 }
  },
  {
    name: 'medalCrucialContribution',
    section: 'group',
    type: 'repeatable',
    title: 'Решающий вклад',
    description: 'Взвод уничтожил 12 и более машин противника.',
    rule: { kind: 'rate', base: 0.0002, power: 2 }
  },
  {
    name: 'lumberjack',
    section: 'special',
    type: 'repeatable',
    title: 'Лесоруб',
    description: 'Повалить 30 и более деревьев за бой.',
    rule: { kind: 'rate', base: 0.002, power: 0 }
  },
  {
    name: 'kamikaze',
    section: 'special',
    type: 'repeatable',
    title: 'Камикадзе',
    description: 'Уничтожить тараном машину противника уровнем выше.',
    rule: { kind: 'rate', base: 0.0001, power: 1 }
  },
  {
    name: 'raider',
    section: 'special',
    type: 'repeatable',
    title: 'Рейдер',
    description: 'Захватить базу, не получив урона.',
    rule: { kind: 'rate', base: 0.0002, power: 1 }
  },
  {
    name: 'beasthunter',
    section: 'special',
    type: 'repeatable',
    title: 'Зверобой',
    description: 'Уничтожить 100 машин «Тигр», «Пантера» и их производных.',
    rule: { kind: 'per', metric: 'frags', every: 1400 }
  },
  {
    name: 'sinai',
    section: 'special',
    type: 'repeatable',
    title: 'Лев Синая',
    description: 'Уничтожить 100 машин ИС и производных.',
    rule: { kind: 'per', metric: 'frags', every: 1900 }
  },
  {
    name: 'pattonValley',
    section: 'special',
    type: 'repeatable',
    title: 'Долина Паттонов',
    description: 'Уничтожить 100 машин семейства «Паттон».',
    rule: { kind: 'per', metric: 'frags', every: 2400 }
  },
  {
    name: 'mousebane',
    section: 'special',
    type: 'repeatable',
    title: 'Гроза мышей',
    description: 'Уничтожить 10 машин «Маус».',
    rule: { kind: 'per', metric: 'frags', every: 3100 }
  },
  {
    name: 'medalKay',
    section: 'class',
    type: 'class',
    title: 'Медаль Кея',
    description: 'Стать героем битвы.',
    rule: { kind: 'stage', metric: 'heroes', thresholds: [1, 10, 100, 1000] }
  },
  {
    name: 'medalCarius',
    section: 'class',
    type: 'class',
    title: 'Медаль Кариуса',
    description: 'Уничтожить машины противника.',
    rule: { kind: 'stage', metric: 'frags', thresholds: [10, 100, 1000, 10_000] }
  },
  {
    name: 'medalKnispel',
    section: 'class',
    type: 'class',
    title: 'Медаль Книспеля',
    description: 'Нанести и получить урон.',
    rule: { kind: 'stage', metric: 'damage', thresholds: [10_000, 100_000, 1_000_000, 10_000_000] }
  },
  {
    name: 'medalPoppel',
    section: 'class',
    type: 'class',
    title: 'Медаль Попеля',
    description: 'Обнаружить машины противника.',
    rule: { kind: 'stage', metric: 'spotted', thresholds: [20, 200, 2000, 20_000] }
  },
  {
    name: 'medalAbrams',
    section: 'class',
    type: 'class',
    title: 'Медаль Абрамса',
    description: 'Победить и выжить.',
    rule: { kind: 'stage', metric: 'survivedWins', thresholds: [5, 500, 5000, 50_000] }
  },
  {
    name: 'medalLeClerc',
    section: 'class',
    type: 'class',
    title: 'Медаль Леклерка',
    description: 'Набрать очки захвата базы.',
    rule: { kind: 'stage', metric: 'capture', thresholds: [30, 300, 3000, 30_000] }
  },
  {
    name: 'medalLavrinenko',
    section: 'class',
    type: 'class',
    title: 'Медаль Лавриненко',
    description: 'Сбить очки захвата своей базы.',
    rule: { kind: 'stage', metric: 'defense', thresholds: [30, 300, 3000, 30_000] }
  },
  {
    name: 'medalEkins',
    section: 'class',
    type: 'class',
    title: 'Медаль Экинса',
    description: 'Уничтожить машины VIII–X уровней.',
    rule: { kind: 'stage', metric: 'highTierFrags', thresholds: [3, 30, 300, 3000] }
  },
  {
    name: 'markOfMastery',
    section: 'special',
    type: 'custom',
    title: 'Мастер',
    description: 'Знак классности «Мастер».',
    rule: { kind: 'mastery', level: 4 }
  },
  {
    name: 'markOfMasteryI',
    section: 'special',
    type: 'custom',
    title: 'Знак классности I степени',
    description: 'Знак классности I степени.',
    rule: { kind: 'mastery', level: 3 }
  },
  {
    name: 'markOfMasteryII',
    section: 'special',
    type: 'custom',
    title: 'Знак классности II степени',
    description: 'Знак классности II степени.',
    rule: { kind: 'mastery', level: 2 }
  },
  {
    name: 'markOfMasteryIII',
    section: 'special',
    type: 'custom',
    title: 'Знак классности III степени',
    description: 'Знак классности III степени.',
    rule: { kind: 'mastery', level: 1 }
  },
  {
    name: 'marksOnGun',
    section: 'special',
    type: 'custom',
    title: 'Отметки на орудии',
    description: 'Отметки на орудии за высокий средний урон.',
    rule: { kind: 'marks' }
  },
  {
    name: 'titleSniper',
    section: 'special',
    type: 'single',
    title: 'Стрелок',
    description: 'Попасть 10 раз подряд.',
    rule: { kind: 'series', series: 'sniper', threshold: 10 }
  },
  {
    name: 'invincible',
    section: 'special',
    type: 'single',
    title: 'Неуязвимый',
    description: 'Провести 5 боёв подряд, не получив урона.',
    rule: { kind: 'series', series: 'invincible', threshold: 5 }
  },
  {
    name: 'diehard',
    section: 'special',
    type: 'single',
    title: 'Живучий',
    description: 'Выжить в 20 боях подряд.',
    rule: { kind: 'series', series: 'diehard', threshold: 20 }
  },
  {
    name: 'handOfDeath',
    section: 'special',
    type: 'single',
    title: 'Коса смерти',
    description: 'Уничтожить 5 машин подряд.',
    rule: { kind: 'series', series: 'killing', threshold: 5 }
  },
  {
    name: 'armorPiercer',
    section: 'special',
    type: 'single',
    title: 'Бронебойщик',
    description: 'Пробить броню 10 раз подряд.',
    rule: { kind: 'series', series: 'piercing', threshold: 10 }
  },
  {
    name: 'mechanicEngineer',
    section: 'special',
    type: 'single',
    title: 'Инженер-механик',
    description: 'Исследовать все машины в игре.',
    rule: { kind: 'veteran', battles: 45_000 }
  },
  {
    name: 'tankExpert',
    section: 'special',
    type: 'single',
    title: 'Эксперт',
    description: 'Уничтожить по одной машине каждого типа.',
    rule: { kind: 'veteran', battles: 25_000 }
  }
] as const;

export const MOCK_SERIES = {
  sniper: { base: 6, perf: 6, log: 1.2 },
  invincible: { base: 1, perf: 2, log: 0.5 },
  diehard: { base: 3, perf: 6, log: 1.4 },
  killing: { base: 2, perf: 3, log: 0.5 },
  piercing: { base: 5, perf: 6, log: 1.1 }
} as const;
