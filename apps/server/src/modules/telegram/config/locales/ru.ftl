cmd-me = Моя статистика
cmd-session = Текущая сессия
cmd-marks = Отметки
cmd-clan = Мой клан
cmd-tank = Танк: /tank название
cmd-top = Топ игроков по WN8
cmd-settings = Уведомления
cmd-login = Войти на сайт
cmd-help = Помощь

start-welcome =
    Привет! Я бот Броневика — статистика «Мира танков» прямо в Telegram.

    Привяжите аккаунт: откройте сайт → Профиль → Telegram и отправьте мне код, или просто войдите на сайт кнопкой ниже.
start-linked = Готово! Telegram привязан к аккаунту Броневика. Команды: /me /session /marks /clan /tank /top /settings
start-code-invalid = Код не найден, уже использован или истёк. Получите новый на сайте.
start-code-taken = Этот Telegram уже привязан к другому аккаунту Броневика.
login-link = Ссылка для входа на сайт (действует { $minutes } мин.):
login-button = Войти на сайт
open-site = Открыть на сайте
open-app = Открыть Броневик
help =
    /me [ник] — статистика игрока
    /session — текущая сессия
    /marks — отметки и ближайшие к следующей
    /clan — ваш клан
    /tank название — пороги отметок танка
    /top — топ игроков по WN8
    /settings — уведомления
    /login — ссылка для входа на сайт

    В любом чате: @{ $bot } ник — карточка игрока.
not-linked = Сначала привяжите аккаунт Леста на сайте, или укажите ник: /me ник
player-not-found = Игрок не найден.
player-card =
    { $nickname } { $clan }
    Боёв: { $battles }
    Победы: { $winRate }
    Средний урон: { $avgDamage }
    WN8: { $wn8 }
session-none = Сессий пока нет. Сыграйте пару боёв — с модом Броневика сессия появится сразу.
session-card =
    Сессия с { $startedAt } { $state }
    Боёв: { $battles }, победы: { $winRate }
    Средний урон: { $avgDamage }
    WN8: { $wn8 }
session-open = (идёт)
session-closed = (завершена)
marks-none = Отметок пока нет.
marks-card =
    Три отметки: { $moe3 }
    Две отметки: { $moe2 }
    Одна отметка: { $moe1 }
marks-closest = Ближе всего к следующей:
marks-line = { $tank }: { $percent }% ({ $marks } отм.)
clan-none = Игрок не состоит в клане.
clan-card =
    [{ $tag }] { $name }
    Участников: { $members }
    Роль: { $role }
tank-usage = Укажите название: /tank Об. 140
tank-not-found = Танк не найден.
tank-card =
    { $name } — { $tier } уровень, { $type }
    Отметки: 1 — { $p65 }, 2 — { $p85 }, 3 — { $p95 }
tank-no-thresholds = Порогов отметок пока нет.
top-empty = Рейтинг ещё считается.
top-header = Топ по WN8:
top-line = { $place }. { $nickname } — { $wn8 } ({ $battles } боёв)
settings-title = Уведомления в Telegram и браузере. Нажмите, чтобы переключить.
settings-channel-telegram = Telegram
settings-channel-webPush = Push в браузере
settings-event-moeGained = Новые отметки
settings-event-moeThresholdDropped = Падение порогов
settings-event-sessionFinished = Итоги сессии
settings-event-bonusCode = Бонус-коды
settings-event-premiumOffer = Скидки на танки
settings-event-challengeResolved = Челленджи
settings-weekly-digest = Недельный дайджест
settings-on = ✅ { $label }
settings-off = ▫️ { $label }
settings-not-linked = Настройки доступны после привязки аккаунта: /start
inline-not-found = Игрок не найден
inline-card-description = WN8 { $wn8 } · { $winRate } побед · { $battles } боёв
notification-open = Открыть
error-generic = Что-то пошло не так. Попробуйте позже.
missing = —
