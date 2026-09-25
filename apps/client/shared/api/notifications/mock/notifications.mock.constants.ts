export const NOTIFICATIONS_MOCK = {
  vapidKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
  items: [
    {
      event: 'moe_gained',
      title: 'Третья отметка на Объект 140',
      body: '95,02% после боя на Прохоровке — 3 184 урона и 4 фрага.',
      url: '/marks',
      minutesAgo: 12,
      isRead: false
    },
    {
      event: 'session_finished',
      title: 'Сессия закрыта: 14 боёв',
      body: 'WR 64,3%, средний урон 3 212, WN8 3 540. Лучший бой — ИС-7, 6 104 урона.',
      url: '/players',
      minutesAgo: 47,
      isRead: false
    },
    {
      event: 'moe_threshold_dropped',
      title: 'Порог 2 отметок на Т-100 ЛТ снизился',
      body: 'Теперь 2 870 комбинированного урона (−64 за неделю). Хорошее окно для рывка.',
      url: '/marks',
      minutesAgo: 190,
      isRead: false
    },
    {
      event: 'goal_reached',
      title: 'Цель выполнена: 500 боёв за месяц',
      body: 'До конца срока оставалось 6 дней. Поставь следующую цель в кабинете.',
      url: '/me',
      minutesAgo: 380,
      isRead: true
    },
    {
      event: 'bonus_code',
      title: 'Новый бонус-код',
      body: 'Код на 3 дня премиума и 5 бонов — действует до конца недели.',
      url: null,
      minutesAgo: 720,
      isRead: true
    },
    {
      event: 'clan_roster_changed',
      title: 'В клан [RED] вступили 2 игрока',
      body: 'StalnoyKulak и Shturman_77 пополнили состав.',
      url: '/clans',
      minutesAgo: 1_300,
      isRead: true
    },
    {
      event: 'mastery_gained',
      title: 'Мастер на Leopard 1',
      body: 'Знак классности «Мастер» — 5 312 опыта за бой.',
      url: null,
      minutesAgo: 2_100,
      isRead: true
    },
    {
      event: 'premium_offer',
      title: 'Скидка на отслеживаемый танк',
      body: 'Škoda T 56 — −30% в магазине до воскресенья.',
      url: null,
      minutesAgo: 3_000,
      isRead: true
    },
    {
      event: 'badge_awarded',
      title: 'Новый бейдж: «Снайпер недели»',
      body: 'Лучшая точность среди друзей за неделю — 87%.',
      url: '/me',
      minutesAgo: 4_400,
      isRead: true
    },
    {
      event: 'challenge_resolved',
      title: 'Челлендж выполнен',
      body: '«3000 урона на ЛТ» — засчитано модом, донат зачислен.',
      url: '/me/streamer',
      minutesAgo: 6_000,
      isRead: true
    },
    {
      event: 'tank_changed',
      title: 'Патч: изменения ТТХ Т-54',
      body: 'Разброс орудия 0,38 → 0,36, скорость сведения 2,3 → 2,1 с.',
      url: '/tanks',
      minutesAgo: 8_200,
      isRead: true
    },
    {
      event: 'clan_event_reminder',
      title: 'Через час — Укрепрайон',
      body: 'Сбор в 20:00 МСК, нужны 7 игроков X уровня.',
      url: '/clans',
      minutesAgo: 9_900,
      isRead: true
    }
  ]
} as const;
