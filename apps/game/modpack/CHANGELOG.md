# Changelog

The modpack's release notes. Every package has its own entry, `## <id> <version>`, where `<id>` is its key in `catalog/catalog.json` and `<version>` the `VERSION` of its package. A modpack-wide `## <version>` entry describes a release as a whole. Each entry has a `### ru` and a `### en` section with the same content in Russian and English. `tools/most` copies a component's entry into its МОСТ submission (`dist/most/<id>/changelog.md`, the «Изменения» section of `description.ru.md` from the Russian text and «Changes» of `description.en.md` from the English one), and `tools/most/texts/tests/test_most_changelog.py` fails when a catalogued component has no entry for its current version or an entry lacks one of the languages.

Add the new entry on top of the component's previous ones when you bump a `VERSION`.

## 0.1.0

### ru

Первый выпуск «Трёх отметок» для «Мира танков» 1.45 (Леста) в виде отдельных пакетов `.mtmod`: ядро, компаньон, внутриигровой интерфейс и 22 компонента. До привязки мода кодом с triotmetki.ru ничего не отправляется, у каждого компонента свой переключатель, и ничто не читает и не показывает информацию о противниках.

- Итоги боёв, отметки и статистика сессии по собственным боям игрока, отправляются на сайт подписанными пакетами.
- Боевой интерфейс на общем перетаскиваемом слое (GUIFlash): лог урона, лог попаданий, часы и таймер боя, HP команд, сигнал шестого чувства; звуки событий и фильтр боевого чата.
- Компоненты ангара: итоги боя, история отметок, собственные рейтинги, часы и сервер, менеджер реплеев, быстрые действия, флаги автопополнения, фильтр уведомлений, очистка ангара.
- Пресеты настроек клиента (миникарта, камера, прицел), которые меняют только собственные настройки игры — в ангаре и по действию игрока.
- Окно настроек на Gameface с профилями и экранным редактором боевого интерфейса; ModsSettingsAPI остаётся запасным вариантом.
- Настройки переживают очистку `mods/configs`: привязка, config.json, components.json, profiles.json и состояние приложения копируются в `%APPDATA%\TriOtmetki` и восстанавливаются при следующем запуске.

### en

The first release of Три отметки for «Мир танков» 1.45 (Lesta), as split `.mtmod` packages: the core, the companion, the in-game UI and 22 components. Nothing is sent before the player binds the mod with a code from triotmetki.ru, every component has its own switch, and nothing reads or shows enemy information.

- Battle results, marks of excellence and session stats of the player's own battles, sent to the site in signed batches.
- Battle HUD on a shared draggable layer (GUIFlash): damage log, hit log, clock and battle timer, team HP, sixth-sense alert; event sounds and a battle chat filter.
- Hangar components: battle summary, marks history, own ratings, clock and server, replay manager, quick actions, auto-resupply flags, notification filter, cleaner hangar.
- Client-settings presets (minimap, camera, crosshair) that only set the game's own options, in the hangar, on the player's change.
- The Gameface settings window with profiles and an on-screen HUD editor; ModsSettingsAPI stays the fallback.
- Settings survive a wiped `mods/configs`: the binding, config.json, components.json, profiles.json and the app state are mirrored into `%APPDATA%\TriOtmetki` and restored on the next start.

## battle_hits 0.1.0

### ru

- «Боевые раны»: попадания по вашему танку записываются в бою (только своя машина) и показываются в ангаре после боя — итог последнего боя и схема сверху (корпус, башня, орудие, ходовая) с точками попаданий, стороной, исходом, уроном и стрелявшим в окне модпака. Хранятся последние бои (до 30), каждый можно удалить.

### en

- «Battle wounds»: the hits on your tank are recorded in battle (your own vehicle only) and shown in the hangar after it: the last battle's summary and, in the modpack window, a schematic from above (hull, turret, gun, running gear) with the hit points, the side, the outcome, the damage and who fired. The last battles are kept (up to 30), each can be deleted.

## gun_arc 0.1.0

### ru

- УГН своего орудия: сколько градусов осталось до упора влево и вправо, полоса с положением орудия и подсветка у края. Только на машинах с ограниченной горизонтальной наводкой.

### en

- Your gun's traverse limits: the degrees left to each side, a bar with the gun position and a highlight near the edge. Only on vehicles with a limited traverse.

## bush_circle 0.1.0

### ru

- Круг 15 м на земле вокруг вашего танка: постоянно или по клавише (Ctrl+Shift+B, Ctrl+Shift+C, F7, F8), четыре цвета; исчезает, когда танк уничтожен.

### en

- A 15 m circle on the ground around your tank: always on or by a hotkey (Ctrl+Shift+B, Ctrl+Shift+C, F7, F8), four colours; gone when the tank is destroyed.

## consumables 0.2.0

### ru

- ТТХ своих снарядов (выключено по умолчанию): пробитие, урон и скорость заряженного снаряда или всех типов — те же числа, что в подсказке снаряда в бою.

### en

- Your shells' stats (off by default): the penetration, damage and velocity of the loaded shell or of every type, the numbers the shell tooltip shows in battle.

## hangar_info 0.3.0

### ru

- Кнопка «Броня на сайте» в окне модпака: открывает 3D-броню выбранного танка на triotmetki.ru.

### en

- An «Armour on the site» button in the modpack window: opens the selected tank's 3D armour on triotmetki.ru.

## received_hits 0.1.0

### ru

- Лог попаданий по вашему танку: класс и название стрелявшей машины, снаряд, урон и исход (пробитие, крит, не пробил, рикошет), криты присоединяются к своему выстрелу; итог за бой и свой шаблон строки.

### en

- A log of the hits on your tank: the class and name of the vehicle that fired, the shell, the damage and the outcome (penetrated, critical, no pen, ricochet); crits join their shot; battle totals and a custom line template.

## death_card 0.1.0

### ru

- Карточка после уничтожения вашего танка: кто сделал последний выстрел (или кого назвала лента убийств), снаряд или причина (пожар, таран), урон, повреждённые модули и экипаж и сторона корпуса, как её показал индикатор попаданий игры. Пока танк жив, ничего не рисуется; ни позиций, ни траекторий.

### en

- A card after your tank is destroyed: who fired the last shot (or whom the kill feed named), the shell or the cause (fire, ram), the damage, the damaged modules and crew and the side of the hull as the game's hit indicator showed it. Nothing is drawn while the tank is alive; no positions, no trajectories.

## battle_loadout 0.1.0

### ru

- Оборудование своего танка в бою со значками предметов игры (★ — в слоте со своим бонусом), полевая модернизация и директивы; компактный вид значками или подробный по группам, место — в редакторе HUD.

### en

- Your tank's equipment in battle with the game's item icons (★: in a slot with its own bonus), field modifications and directives; a compact icon row or a detailed list by group, placed in the HUD editor.

## personal_missions 0.1.0

### ru

- Помощник ЛБЗ: задачи в работе с основным условием и условием «с отличием» — подпись в ангаре, строка в бою для задач класса вашего танка и список всех задач с их состоянием в окне мода.

### en

- Personal missions helper: the missions in progress with their main and «with honours» conditions: a hangar label, a battle line for the missions of your tank's class and every mission with its state in the mod window.

## streamer_mode 0.1.0

### ru

- Клавиша (по умолчанию Ctrl+Shift+H) убирает с экрана все панели мода и подписи ангара и возвращает их с последним текстом; по желанию панели остаются скрытыми и в следующем бою.
- Приватный режим: чат боя других игроков не показывается, подписи ангара с вашими цифрами (рейтинги, сессия, цели, ЛБЗ, история отметок) скрыты. Ник и клан в интерфейсе игры не скрываются.

### en

- A key (Ctrl+Shift+H by default) takes every panel and hangar label of the mod off the screen and brings them back with their latest text; optionally the panels stay hidden in the next battle too.
- Private mode: the battle chat of other players is not drawn and the hangar labels with your numbers (ratings, session, goals, personal missions, marks history) are hidden. Your name and clan in the game's interface stay.

## platoon_helper 0.1.0

### ru

- Подпись в ангаре: кто во взводе нажал «Готов», как в окне взвода, и ваши бои за сессию во взводе и в клановых режимах (боёв, процент побед, средний урон).

### en

- A hangar label: who in the platoon pressed «Ready», as in the platoon window, and your battles of the session in a platoon and in clan modes (battles, win rate, average damage).

## tilt_guard 0.1.0

### ru

- Мягкое напоминание в ангаре сделать перерыв: после серии поражений, после долгой сессии и при заметном падении урона в последних боях; пороги настраиваются, каждое напоминание — один раз.

### en

- A gentle hangar reminder to take a break: after a losing streak, after a long session and on a clear drop in the damage of the last battles; the thresholds are yours, each reminder comes once.

## crosshair 0.2.0

### ru

- Пять новых своих одноцветных центральных меток (точка, крест, пунктирное кольцо, скобки, ромб) и выбор их цвета: белый, зелёный, жёлтый, голубой, пурпурный, красный.

### en

- Five new one-colour centre marks of our own (dot, cross, dashed ring, brackets, diamond) and a choice of their colour: white, green, yellow, cyan, magenta, red.

## personal_best 0.1.0

### ru

- Рекорд урона, помощи и фрагов на танке в бою: «рекорд 6 812, осталось 1 200», после рекорда — «Новый рекорд».
- После боя, побившего рекорд, — уведомление-карточка в ангаре и наш звук.
- Рекорды берутся из досье своего танка, своих итогов боёв и копии рекордов на сайте (`/mod/me/tanks`); при переполнении забывается танк, который дольше всех не встречался.

### en

- The tank's damage, assist and frags record in battle: «record 6,812, 1,200 to go», then «New record».
- After a battle that beat a record, a card notification in the hangar and our sound.
- Records come from the own tank dossier, the own battle results and the site's copy of them (`/mod/me/tanks`); when full, the tank not seen for the longest is forgotten.

## session_goals 0.1.0

### ru

- Цели из кабинета на сайте: прогресс в ангаре, строка в бою (для цели по среднему урону — сколько урона нужно в этом бою) и звук, когда сайт отметил цель выполненной.
- Чтение `/mod/me/goals` после привязки, в ангаре; сервер ещё не отдаёт этот запрос (контракт `contract/goals.schema.json`).

### en

- Goals from your site dashboard: progress in the hangar, a battle line (for an average-damage goal, the damage this battle needs) and a sound when the site marks a goal met.
- Reads `/mod/me/goals` once bound, in the hangar; the server does not serve it yet (contract `contract/goals.schema.json`).

## main_gun 0.1.0

### ru

- Счётчик «Основного калибра»: ваш урон против порога медали (20% ХП противника, не меньше 1 000), урон команды и ваша доля.

### en

- The High Caliber counter: your damage against the medal threshold (20% of the enemy HP, at least 1,000), the team damage and your share.

## battle_efficiency 0.1.0

### ru

- Эффективность боя: оценка WN8 этого боя по ожидаемым значениям танка и урон против своего среднего на нём, цветом выше или ниже своего.
- Без известного среднего урона (0 или нет данных) строка урона не показывается.

### en

- Battle efficiency: a WN8 estimate of this battle from the tank's expected values and the damage against your own average on it, coloured above or below your own.
- Without a known average damage (0 or missing) the damage line is left out.

## consumables 0.1.0

### ru

- Своё снаряжение с откатом и оставшиеся снаряды каждого типа одной перетаскиваемой строкой; откат считается по времени игры.

### en

- Your consumables with their cooldowns and the shells left of each type on one movable line; cooldowns count by game time.

## reload_timer 0.1.0

### ru

- Отсчёт перезарядки своего орудия с полоской и снаряды в кассете; только своё орудие. Отсчёт идёт по времени игры и не отстаёт от прицела.

### en

- Your gun's reload countdown with a bar and the shells in the magazine; your own gun only. It counts by game time and keeps pace with the reticle.

## core 0.3.0

### ru

- Общие чтения своего аккаунта с сайта (`core/me`, `core/client/me`): подписанный запрос `/mod/me/*`, отбрасывание ответов о чужом аккаунте, задержки повторов и общее чтение строк своих танков (`/mod/me/tanks`) — оно одно на всю игру для рейтингов, рекордов и эффективности.
- ХП команд (`core/teams`, `core/client/battle/teams`) вынесены из панели ХП, чтобы ими пользовался и счётчик «Основного калибра».
- Звуки в MP3 (`play_mp3`): наши звуки из `res/audioww/` проигрываются через собственное MP3-событие клиента, без банков Wwise.
- Заголовок реплея теперь даёт итог боя и урон записавшего игрока (только его собственная запись итогов).
- `Ticker.elapsed()`: время игры с прошлого тика, чтобы отсчёты не отставали (обратный вызов приходит на первом кадре после задержки).
- Общие помощники для новых компонентов: классы техники (`core/classes`), классы боевого чата и проверка своих строк (`core/client/chat`), горячие клавиши (`core/client/hotkey`), источник урона и курс своего корпуса (`core/client/battle`).
- Слой HUD и подписи ангара умеют временно убирать панели (`set_muted`, `set_blocked`) и возвращать их с последним текстом — для режима стримера.

### en

- Shared reads of the own account from the site (`core/me`, `core/client/me`): the signed `/mod/me/*` request, dropping answers about another account, retry delays and one shared read of the own tank rows (`/mod/me/tanks`) for the ratings, records and efficiency.
- Team HP (`core/teams`, `core/client/battle/teams`) moved out of the team HP panel so the High Caliber counter can use it too.
- MP3 sounds (`play_mp3`): our sounds from `res/audioww/` play through the client's own custom-MP3 event, no Wwise bank needed.
- The replay header now gives the battle result and damage of the recorder (only its own results entry).
- `Ticker.elapsed()`: the game time since the previous tick, so countdowns do not lag (a callback fires on the first frame after its delay).
- Shared helpers for the new components: vehicle classes (`core/classes`), the battle chat classes and the own-line check (`core/client/chat`), hotkeys (`core/client/hotkey`), the damage source and the own hull yaw (`core/client/battle`).
- The HUD layer and the hangar labels can take panels off the screen for a while (`set_muted`, `set_blocked`) and bring them back with their latest text, for the streamer mode.

## core 0.2.0

### ru

- Общая математика отметок (`core/moe`) для панели в бою и вида в ангаре, и сторона Gameface-страницы HUD (`core/hud/surface`).
- HTTP: заголовки ответа `BigWorld.fetchURL` читаются так, как их отдаёт клиент 1.45 (`response.headers()`), поэтому снова работают повторная подпись после 428 со сдвигом часов и `Retry-After`.
- Настройки клиента записываются в том же порядке, что и в окне настроек игры (применить, сохранить, подтвердить, очистить); размер мини-карты пишется в `AccountSettings`.
- Одинаковая ошибка пишется в журнал раз в минуту, дальше только счётчик повторов.
- Снятие оборудования и другие действия в ангаре идут по одному запросу и показывают собственный текст ответа клиента.
- Добавлен тип снаряда `HE_MODERN_DF` журнала боя 1.45; папка реплеев больше не читается из приватного поля клиента.

### en

- Shared MoE maths (`core/moe`) for the in-battle panel and the hangar view, and the Gameface HUD page's side (`core/hud/surface`).
- HTTP: the `BigWorld.fetchURL` response headers are read the way the 1.45 client exposes them (`response.headers()`), so the 428 clock re-sync and `Retry-After` work again.
- Client settings are written in the order of the game's own settings window (apply, store, confirm, clear); the minimap size goes to `AccountSettings`.
- An identical error is written to the log once a minute, then only a repeat count.
- Demounting and the other hangar actions send one request at a time and show the client's own answer text.
- Added the 1.45 battle-log shell type `HE_MODERN_DF`; the replay folder is no longer read from a private client field.

## core 0.1.0

### ru

- Общая основа всех пакетов: шина событий, защищённые хуки и переопределения клиента, ленивый реестр компонентов (любой порядок загрузки), настройки с проверкой по схеме, локализация, журнал, JSON-хранилище с атомарной записью, подпись запросов и HTTP-транспорт.
- Слой боевого интерфейса с `components.json` (у каждого компонента своя секция с проверкой по схеме) и протокол редактирования интерфейса.
- Надёжное хранение настроек: файлы, которые игрок не сможет восстановить сам, копируются в `%APPDATA%\TriOtmetki`, а отсутствующая или более старая копия в `mods/configs/otmetki` восстанавливается при загрузке.
- Закреплённые библиотеки Python 2.7: six, blinker, attrs, enum34.

### en

- The shared runtime of every package: the event bus, guarded client hooks and overrides, the lazy feature registry (any load order), schema-checked settings, i18n, logging, JSON storage with atomic writes, request signing and the HTTP transport.
- The battle HUD layer with `components.json` (one schema-checked section per component) and the HUD edit protocol.
- Durable settings: the files a player cannot recreate are mirrored into `%APPDATA%\TriOtmetki`, and a missing or older copy in `mods/configs/otmetki` is restored on load.
- Pinned Python 2.7 libraries: six, blinker, attrs, enum34.

## companion 0.3.0

### ru

- Переключатели новых компонентов: `battle_personal_best`, `hangar_session_goals`, `battle_main_gun`, `battle_efficiency`, `battle_consumables`, `battle_reload_timer`.
- `share_session_report` (выключен по умолчанию) и `share_session_channel`: отчёт о сессии в свой Telegram или Discord через сайт. Профили и коды его не переносят.
- Переключатели компонентов четвёртого круга: `battle_received_hits`, `battle_death_card`, `battle_loadout`, `hangar_personal_missions`, `streamer_mode`, `hangar_platoon_helper`, `hangar_tilt_guard`.
- Переключатели компонентов пятого круга: `hangar_battle_hits`, `battle_gun_arc`, `battle_bush_circle`.

### en

- Switches of the new components: `battle_personal_best`, `hangar_session_goals`, `battle_main_gun`, `battle_efficiency`, `battle_consumables`, `battle_reload_timer`.
- `share_session_report` (off by default) and `share_session_channel`: the session report to your own Telegram or Discord through the site. Profiles and codes never carry it.
- Switches of the round-four components: `battle_received_hits`, `battle_death_card`, `battle_loadout`, `hangar_personal_missions`, `streamer_mode`, `hangar_platoon_helper`, `hangar_tilt_guard`.
- Switches of the round-five components: `hangar_battle_hits`, `battle_gun_arc`, `battle_bush_circle`.

## companion 0.2.0

### ru

- Переключатель `hangar_marks` для вида отметки в ангаре.
- Итоги боя, из которого вышли раньше, берутся только из того, что игра уже сохранила сама (событие окна итогов и кэш на диске). Мод больше не запрашивает итоги у сервера и не мешает окну итогов игры.
- Распределение урона для отметок больше не запрашивается закрытой командой клиента; переключатель `send_moe_distribution` убран. Пороги отметок считаются по открытым данным: досье и итогам своих боёв.
- Из взвода отправляется только его размер, без идентификаторов других игроков.
- Модификации в сборке танка читаются из `descriptor.modifications` клиента 1.45; устаревшая настройка камеры после гибели убрана из обмена настройками.

### en

- The `hangar_marks` switch for the hangar MoE view.
- The results of a battle left early are taken only from what the game itself already saved (the results window event and the on-disk cache). The mod no longer asks the server for results and no longer gets in the way of the game's results window.
- The MoE damage distribution is no longer asked with a private client command; the `send_moe_distribution` switch is gone. MoE thresholds come from public data: the dossier and the own battle results.
- Only the platoon's size is sent, without other players' ids.
- Field modifications in the loadout are read from the 1.45 `descriptor.modifications`; the obsolete post-mortem camera setting is gone from the settings share.

## companion 0.1.0

### ru

- Привязка к triotmetki.ru одноразовым кодом с сайта; до неё ничего не собирается и не отправляется.
- После каждого собственного боя: блок `personal` итогов боя, снимки и распределение отметок, время в очереди, сборка танка и выстрелы. Всё уходит подписанными пакетами через очередь отправки, которая переживает перезапуск и делает паузы при ошибках.
- Переключатели отправки данных для каждого компонента в `config.json`, окно ModsSettingsAPI как запасной интерфейс настроек и обмен настройками для стримеров (выгрузка, применение с подтверждением, откат).

### en

- Binding to triotmetki.ru with a one-time code from the site; nothing is collected or sent before it.
- After each own battle: the `personal` block of the battle results, MoE snapshots and distribution, queue times, the loadout and shots, sent in signed batches through an outbox that survives a restart and backs off on errors.
- Per-feature data switches in `config.json`, the ModsSettingsAPI window as the fallback settings UI, and the streamer settings share (export, apply with a confirmation, restore).

## ui 0.1.2

### ru

- Профили и коды не переносят `share_session_report`, как и другие сетевые переключатели.

### en

- Profiles and codes do not carry `share_session_report`, like the other network switches.

## ui 0.1.1

### ru

- Ссылки открываются во встроенном браузере игры (`BigWorld.openWebBrowser`); кнопка в ангаре встраивается только в виджет экипажа, который есть в клиенте 1.45.

### en

- Links open in the game's own browser (`BigWorld.openWebBrowser`); the hangar button is injected only into the crew widget the 1.45 client has.

## ui 0.1.0

### ru

- Окно настроек на Gameface (OpenWG Gameface): карточка для каждого установленного компонента по его собственной схеме, страницы со списками, профили (сохранение, загрузка, переименование, выгрузка и загрузка кодом) и экранный редактор боевого интерфейса.
- Точки входа: кнопка «///» в ангаре, пункт в ModsList и сочетание клавиш Ctrl+Shift+T.

### en

- The Gameface settings window (OpenWG Gameface): a card per installed component built from its own schema, list pages, profiles (save, load, rename, export and import as a code) and the on-screen HUD editor.
- Entry points: the «///» button in the hangar, a ModsList entry and the hotkey Ctrl+Shift+T.

## marks_panel 0.2.0

### ru

- Панель отметки стала полноценным компонентом боевого интерфейса: перетаскивается в редакторе HUD, показывается в режиме редактирования, настраивается в окне.
- Процент на начало боя и прогноз после него, изменение, урон до 65, 85 и 95 % (и до 100 %, когда она следующая), урон на +0,1/0,5/1 %, среднее до и после боя, прогноз боёв до следующей отметки по темпу последних боёв на этом танке.
- Виды «Подробный», «Компактный», «Минимальный» и свой шаблон с макросами; цвет по изменению, по отметке или без цвета.
- Засвет и урон по гусеницам после гибели танка теперь учитываются, итоговая сводка клиента поднимает урон и оглушение до своих значений.

### en

- The MoE panel is now a full battle HUD component: movable in the HUD editor, shown in the edit mode, configured in the window.
- The percent at the start of the battle and the projection after it, the change, the damage to 65, 85 and 95% (and to 100% when it is next), the damage for +0.1/0.5/1%, the average before and after the battle, and a forecast of the battles to the next mark at the pace of your last battles on the tank.
- Styles «Extended», «Compact», «Minimal» and your own macro template; colour by change, by mark or none.
- Spotting and tracking assist earned after the tank is destroyed now counts; the client's end-of-life summary raises the damage and stun to its values.

## hangar_marks 0.1.0

### ru

- В ангаре для выбранного танка: процент отметки и звёзды, среднее, темп последних боёв, урон за бой до 65/85/95 % и на +0,5 %, прогноз боёв до следующей отметки. Перетаскивается в редакторе HUD, три вида и свой шаблон.

### en

- In the hangar for the selected tank: the MoE percent and stars, the average, the pace of your last battles, the damage per battle to 65/85/95% and for +0.5%, and a forecast of the battles to the next mark. Movable in the HUD editor, three styles and your own template.

## marks_panel 0.1.0

### ru

- В бою: текущий процент отметки, прогноз после боя и урон, которого не хватает до следующей отметки; урон команды не учитывается.

### en

- In battle: the current MoE percentage, the projection after the battle and the damage still needed for the next mark; team damage is not counted.

## session_stats 0.2.0

### ru

- Отчёт о сессии в свой Telegram или Discord через сайт: включается в карточке (по умолчанию выключен), кнопка «Отправить отчёт о сессии».
- Если выбранный канал не привязан на сайте, мод один раз сообщает об этом и не повторяет запрос, пока не изменится выбор.

### en

- The session report to your own Telegram or Discord through the site: turned on in the card (off by default), with a «Send the session report» button.
- When the chosen channel is not linked on the site, the mod says so once and does not ask again until the choice changes.

## session_stats 0.1.0

### ru

- В ангаре: бои, процент побед, средний урон и WN8 текущей сессии; новая сессия начинается после `session_idle_minutes` минут простоя.

### en

- In the hangar: battles, win rate, average damage and WN8 of the current session; a new session starts after `session_idle_minutes` of idle time.

## replay_upload 0.1.1

### ru

- Загрузка встаёт на паузу при входе в бой (идущая останавливается на следующем блоке) и продолжается в ангаре.
- Реплей, переименованный между поиском и чтением, ищется ещё раз по заголовку.

### en

- The upload pauses when a battle starts (a running one stops at its next block) and resumes in the hangar.
- A replay renamed between the search and the read is looked up again by its header.

## replay_upload 0.1.0

### ru

- По желанию, по умолчанию выключено: загружает реплеи собственных боёв игрока, которые записала сама игра, сопоставляя их по заголовку реплея; реплей остаётся закрытым, пока не включён `publish_replays`. Запись реплеев никогда не включается; файлы больше 50 МиБ отклоняются.

### en

- Opt-in, off by default: uploads the replays the game itself recorded of the player's own battles, matched by the replay header, private unless `publish_replays` is on. Never turns replay recording on; files above 50 MiB are refused.

## damage_log 0.2.0

### ru

- Источник полученного урона: пожар, таран, падение, попадание в боеукладку; значок класса техники противника.
- Строки лога цветом своего вида (из набора цветов или свои цвета).
- Всплывающая строка «Последнее попадание» — отдельная перетаскиваемая панель со своим временем показа.

### en

- The source of received damage: fire, ram, a fall, a hit on the ammo rack; the enemy vehicle class glyph.
- Log lines coloured by their kind (from the colour set or your own colours).
- The «Last hit» pop-up, a movable panel of its own with its own display time.

## damage_log 0.1.0

### ru

- В бою: суммы нанесённого, заблокированного, ассистированного (разведка, гусеница, оглушение) и полученного урона и последние записи (тип, величина, техника, снаряд). Стили `full`, `compact`, `minimal` и свой шаблон.
- Палитры `classic`, `graphite`, `contrast`, `colorblind` (макросы `{c_dealt}`, `{c_blocked}`, `{c_assisted}`, `{c_received}`) и свои значки видов урона (`{icon}`).
- Ассист, заработанный после гибели, пока камера следит за союзником, тоже учитывается.

### en

- In battle: totals of damage dealt, blocked, assisted (radio, track, stun) and received, with the latest entries (kind, amount, vehicle, shell). Styles `full`, `compact`, `minimal` and a custom template.
- Palettes `classic`, `graphite`, `contrast`, `colorblind` (macros `{c_dealt}`, `{c_blocked}`, `{c_assisted}`, `{c_received}`) and our own damage-kind icons (`{icon}`).
- Assist earned after death, while the camera follows an ally, still counts.

## hit_log 0.1.0

### ru

- В бою: каждое собственное попадание по противнику (пробитие, крит, непробитие, рикошет и остальные) с уроном, снарядом, критами и HP цели после попадания — ровно как показывает маркер противника; по желанию с группировкой по цели.
- Цвет исхода по палитре (`{c_outcome}`: `classic`, `graphite`, `contrast`, `colorblind`); HP цели берётся только из собственного попадания.

### en

- In battle: each own hit on an enemy (penetration, critical, no penetration, ricochet and the rest) with damage, shell, crits and the target's HP after the hit, exactly as the enemy marker shows it; optionally grouped by target.
- Outcome colour by palette (`{c_outcome}`: `classic`, `graphite`, `contrast`, `colorblind`); the target's HP is taken only from the player's own hit.

## battle_clock 0.1.0

### ru

- В бою: местное время, по желанию дата, и время до конца текущего этапа боя.

### en

- In battle: the local time, optionally the date, and the time left in the current arena period.

## team_hp 0.2.0

### ru

- Стиль «Полоска на каждый танк»: по полоске ХП на каждую машину обеих команд и счёт между ними.

### en

- The «A bar per tank» style: an HP bar for every vehicle of both teams with the score between them.

## team_hp 0.1.0

### ru

- В бою: HP каждой команды относительно максимума полосами и/или числами, счёт фрагов и разница HP — по значениям, которые клиент и так показывает на маркерах и в ушах.

### en

- In battle: each team's HP against its maximum as bars and/or numbers, the frag score and the HP difference, from the values the client already shows on markers and team panels.

## sixth_sense 0.1.0

### ru

- В бою: текст или значок с секундами с момента, когда загорелась собственная лампа шестого чувства клиента, и по желанию звук из звукового мода. Без направления, дистанции и «ближайшего противника».
- Четыре своих значка (лампа, глаз, знак «!», «///») с пульсацией и свой сигнал (CC0) через слот «пользовательского звука» засвета в настройках игры, без Wwise.

### en

- In battle: a text or icon with the seconds since the client's own sixth-sense lamp lit, and an optional sound from a sound mod. No direction, distance or "nearest enemy".
- Four icons of our own (lamp, eye, «!» badge, «///») with a pulse, and our own chime (CC0) through the game's user detection-sound slot, no Wwise.

## battle_results 0.1.0

### ru

- В ангаре: уведомление после каждого собственного боя с результатом, опытом и кредитами, боевой статистикой и изменением отметки; окно мода показывает бои сессии с подробностями.

### en

- In the hangar: a notification after each own battle with the result, XP and credits, combat stats and the MoE change; the mod window lists the session's battles with details.

## battle_sounds 0.1.0

### ru

- В бою: событие Wwise на выбор игрока для пожара, повреждения модуля, боеукладки, контузии экипажа, первой крови, собственного фрага и уничтожения своей машины. Звуковой банк не входит в пакет.

### en

- In battle: a Wwise event of the player's choice for fire, module damage, the ammo rack, injured crew, first blood, the own frag and the own vehicle's destruction. Ships no sound bank.

## chat_filter 0.1.0

### ru

- В бою: время у сообщений чата и скрытие повторов, флуда, спама быстрыми командами и строк с запрещёнными словами. Собственные сообщения игрока не скрываются никогда.

### en

- In battle: time stamps on chat lines and hiding of repeats, flood, quick-command spam and lines with blocked words. The player's own lines are never hidden.

## replay_manager 0.2.0

### ru

- Поиск по карте, танку и имени файла, фильтры по итогу боя и времени, сортировка по дате, урону и размеру; итог и урон в строке реплея.
- Уведомление в ангаре, когда сайт закончил разбор загруженного реплея (`/mod/me/replays`).

### en

- Search by map, tank and file name, filters by result and period, sorting by date, damage and size; the result and damage on each replay row.
- A hangar notice when the site has finished analysing an uploaded replay (`/mod/me/replays`).

## replay_manager 0.1.0

### ru

- В ангаре: собственные реплеи игрока с картой, техникой, датой и размером; переименование, удаление, открытие папки и ссылка на загруженный реплей на сайте. По желанию автоматические имена по шаблону.

### en

- In the hangar: the player's own replays with map, vehicle, date and size; rename, delete, open the folder, and a link to the uploaded replay on the site. Optional auto names from a template.

## hangar_tweaks 0.2.0

### ru

- Быстрое снятие стиля с выбранного танка (с подтверждением) и масштаб интерфейса из настроек игры.
- Переключатель ускоренного обучения экипажа не добавлен: в клиенте 1.45 его нет, обучение ускоряется само на элитных и премиум-танках.

### en

- Quick style removal from the selected tank (confirmed) and the interface scale from the game settings.
- No accelerated crew training switch: the 1.45 client has none, training speeds up by itself on elite and premium tanks.

## hangar_tweaks 0.1.1

### ru

- Оборудование снимается по одному слоту, каждый запрос строится по свежему состоянию танка; ответы клиента показываются как у кнопок ангара. Проверка мест в казарме — по `freeTankmenBerthsCount()`.

### en

- Equipment is demounted one slot at a time, each request built from the tank's fresh state; the client's answers are shown as for the hangar's buttons. The barracks check uses `freeTankmenBerthsCount()`.

## hangar_tweaks 0.1.0

### ru

- Собственные настройки карусели клиента (ряды, размер плиток) и три быстрых действия с подтверждением для выбранной техники: снять съёмное оборудование, отправить экипаж в казарму, вернуть прежний экипаж.

### en

- The client's own carousel options (rows, tile size) and three confirmed quick actions on the selected vehicle: demount removable equipment, crew to the barracks, return the previous crew.

## minimap 0.1.1

### ru

- Размер мини-карты теперь действительно меняется: он пишется в `AccountSettings`, откуда его читает мини-карта в бою.

### en

- The minimap size now really changes: it is written to `AccountSettings`, where the battle minimap reads it.

## minimap 0.1.0

### ru

- Собственные настройки миникарты игры: размер, прозрачность, названия техники и круги обзора своей машины.

### en

- The game's own minimap options: size, transparency, vehicle names and the player's own range circles.

## camera 0.2.0

### ru

- Вместо несуществующей настройки шагов зума — настройка игры «Зум при входе в снайперский режим» (`sniperZoom`: запоминать, x2, x4, x8); пресеты выставляют её.

### en

- The non-existent zoom-steps setting is replaced by the game's own «zoom on entering sniper mode» option (`sniperZoom`: remember, x2, x4, x8); the presets set it.

## camera 0.1.0

### ru

- Собственные настройки камеры игры: пресеты, шаги снайперского зума, динамическая камера и горизонтальная стабилизация.

### en

- The game's own camera options: presets, sniper zoom steps, the dynamic camera and horizontal stabilisation.

## crosshair 0.1.0

### ru

- Пресеты поверх собственных настроек прицела игры для аркадного и снайперского режимов и переключатель серверного прицела.
- Центральная метка на выбор поверх центра прицела игры: 7 своих (точка, крест, кольцо, шеврон, стример, для дальтоников, «///») и 5 из CC0-набора Kenney.

### en

- Presets over the game's own reticle settings for arcade and sniper modes, and the server-reticle switch.
- A centre mark of your choice over the game's reticle centre: 7 of our own (dot, cross, ring, chevron, streamer, colour-blind safe, «///») and 5 from Kenney's CC0 pack.

## hangar_info 0.2.0

### ru

- Строка выбранного танка: уровни боёв, опыт экипажа до следующего навыка и ускоренное обучение.

### en

- A line for the selected tank: its battle tiers, crew XP to the next skill and accelerated training.

## hangar_info 0.1.0

### ru

- В ангаре: местное время и дата, текущий сервер, собственный пинг клиента до него и онлайн.

### en

- In the hangar: local time and date, the current server, the client's own ping to it and the online count.

## marks_history 0.1.0

### ru

- Процент отметки, отметки и скользящий средний урон после каждого собственного боя по каждой технике с датой получения каждой отметки: подпись в ангаре для выбранного танка и список в окне мода.

### en

- The MoE percent, marks and moving-average damage after each own battle per vehicle, with the date each mark was reached: a hangar label for the selected tank and a list in the mod window.

## hangar_ratings 0.1.1

### ru

- Строка выбранного танка читается общим чтением ядра, одним на все компоненты; поведение не изменилось.

### en

- The selected tank's row comes from the core's shared read, one for every component; the behaviour is unchanged.

## hangar_ratings 0.1.0

### ru

- В ангаре после привязки: собственные рейтинги игрока с сайта по аккаунту, последней сессии и выбранному танку; запрашиваются подписанными запросами и кешируются на игровую сессию.

### en

- In the hangar, once bound: the player's own site ratings for the account, the latest session and the selected tank, read over signed requests and cached for the game session.

## auto_resupply 0.1.0

### ru

- Собственные флаги автоматического ремонта и автопополнения игры (снаряды, снаряжение, директивы) для выбранного танка или всего ангара — только по нажатию кнопки игроком.

### en

- The game's own auto repair and auto-resupply flags (shells, consumables, directives), applied to the selected tank or the whole garage only when the player presses the button.

## notification_filter 0.1.1

### ru

- Пополнение «Торгового каравана» больше не скрывается вместе с аукционом: в 1.45 у них общий номер типа, фильтр различает их по классу уведомления.

### en

- The Trading Caravan refill is no longer hidden with the auction: in 1.45 they share a type number, and the filter tells them apart by the notification's class.

## notification_filter 0.1.0

### ru

- Скрывает в центре уведомлений рекламу, напоминания, заявки в друзья и приглашения в клан по собственным типам уведомлений клиента. Обычные сообщения и приглашения во взвод не скрываются никогда.

### en

- Hides promo, reminders, friend requests and clan invites in the notification centre by the client's own notification types. Plain messages and platoon invites are never hidden.

## hangar_cleaner 0.1.1

### ru

- Переопределения приватных методов ангара ставятся только на проверенной версии клиента (1.45) и только если методы есть; иначе тизер и входы в события остаются как в игре, а журнал объясняет почему.
- Баннеры предложений скрываются на всех путях загрузки (`OfferBannerWindow.tryLoad`).

### en

- The overrides of the hangar's private methods are installed only on a verified client version (1.45) and only when the methods exist; otherwise the teaser and the event entries stay as in the game and the log says why.
- Offer banners are hidden on every load path (`OfferBannerWindow.tryLoad`).

## hangar_cleaner 0.1.0

### ru

- Скрывает рекламный тизер и баннеры предложений в ангаре и по желанию точки входа в события в карусели.

### en

- Hides the hangar's promo teaser and offer banners, and optionally the event entry points of the carousel.
