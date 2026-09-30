# Changelog

The modpack's release notes. Every package has its own entry, `## <id> <version>`, where `<id>` is its key in `catalog/catalog.json` and `<version>` the `VERSION` of its package. A modpack-wide `## <version>` entry describes a release as a whole; `<version>` is `version` in `package.json`, the release version. Each entry has a `### ru` and a `### en` section with the same content in Russian and English. `tools/most` copies a component's entry into its МОСТ submission (`dist/most/<id>/changelog.md`, the «Изменения» section of `description.ru.md` from the Russian text and «Changes» of `description.en.md` from the English one), and `tools/most/texts/tests/test_most_changelog.py` fails when a catalogued component has no entry for its current version or an entry lacks one of the languages.

Add the new entry on top of the component's previous ones when you bump a `VERSION`.

## 0.1.6

### ru

Ряд оборудования — только значки из самой игры, а повтор стандартной панели снарядов и расходников убран.

- Компонент «Снаряжение и снаряды» удалён: стандартная панель игры уже показывает снаряжение, снаряды и откат. Его переключатель в `config.json` тихо отбрасывается при следующем сохранении.
- «Оборудование в бою»: квадратные ячейки с иконками предметов из клиента в лёгкой рамке, без подписей и без плашек наборов. Название и действие предмета — в подсказке игры при наведении с Ctrl. Если у клиента нет картинки, в ячейке наш значок.

### en

The equipment row is the game's own icons only, and the copy of the stock shells and consumables panel is gone.

- The «Consumables and shells» component is removed: the game's stock panel already shows the consumables, the shells and the cooldowns. Its switch in `config.json` is silently dropped on the next save.
- «Equipment in battle»: square cells with the client's item icons in a light frame, with no labels and no set badges. The item's name and effect are in the game's tooltip on hover with Ctrl. When the client has no image, the cell shows our glyph.

## 0.1.5

### ru

Оборудование в бою снова на месте, панели не мигают на Tab, у каждого блока есть подсказка.

- Ряд оборудования над стандартной панелью снарядов показывается всегда: если клиент не собрал данные о директивах, значки оборудования всё равно видны. Повторная панель расходников выключена у всех один раз, её можно включить обратно.
- Колесо мыши прокручивает список реплеев, их подробности и выпадающие списки.
- ХП команд: плашка по размеру содержимого, числа внутри полос, счёт и разница по центру.
- Наведение на любой наш блок (в бою с Ctrl, в ангаре мышью) показывает короткое описание.
- С зажатым Tab панели остаются на месте (под таблицей — приглушены) и не прыгают, когда Tab отпущен.
- Предпросмотры в настройках, в редакторе HUD и в менеджере рисуются теми же панелями, что в бою, по центру и в размер рамки; у прицела виден сам прицел с меткой.

### en

Equipment is back in battle, panels no longer blink on Tab, and every block has a tooltip.

- The equipment row above the stock ammo panel always shows: when the client cannot build the directive data, the equipment icons still show. The duplicate consumables bar is switched off for everyone once and can be switched back on.
- The mouse wheel scrolls the replays list, its details and the drop-down lists.
- Team HP: the plate hugs its content, the numbers sit inside the bars, the score and the difference in the centre.
- Hovering any of our blocks (in battle with Ctrl, in the hangar with the mouse) shows a short description.
- With Tab held the panels stay in place (dimmed under the table) and do not jump when Tab is released.
- The previews in the settings, the HUD editor and the manager are drawn by the same panels as in battle, centred and fitted to their frame; the crosshair preview shows the reticle with its mark.

## 0.1.4

### ru

Боевые панели больше не закрывают полосы захвата баз и прогресс боевых задач, код мода переписан начисто.

- «Эффективность в бою» по умолчанию в левой колонке под отметкой, «Только числа» ХП команд — справа от стандартной панели счёта.
- В таблице отчёта по отметкам снова видно цвет изменения процента.
- Код мода и окна настроек разобран на короткие функции с понятными именами, повторы вынесены в общее ядро, мёртвый код удалён; поведение компонентов не менялось.

### en

The battle panels no longer cover the base capture bars and the quest progress, and the mod's code is rewritten cleanly.

- «Battle efficiency» sits in the left column under the marks by default, the team HP «Numbers only» right of the stock score strip.
- The marks report table shows the colour of the percentage change again.
- The code of the mod and of the settings window is split into short functions with clear names, repeats moved into the shared core, dead code removed; the components behave as before.

## 0.1.3

### ru

Новое окно настроек мода.

- Разделы с иконками, карточки компонентов с метками «Ангар» и «Бой», поиск по настройкам, отмена изменений и сброс к стандартным.
- Окно двигается, меняет размер и масштаб и запоминает их; колесо мыши прокручивает списки в нужную сторону, иконки и кнопки больше не пропадают.
- Кнопка «///» в правом нижнем ряду кнопок ангара.

### en

A new mod settings window.

- Sections with icons, component cards with «Hangar» and «Battle» badges, search across settings, undo and reset to defaults.
- The window moves, resizes and zooms and remembers it; the mouse wheel scrolls lists the right way, icons and buttons no longer go blank.
- The «///» button in the hangar's bottom-right button row.

## 0.1.2

### ru

Новые боевые панели и сверка всех модов с исходниками клиента 1.45.

- Боевые панели нарисованы иконками самого клиента: ХП команд и счёт (заменяет стандартную полосу, семь стилей), лог урона, лог попаданий, отметка, расходники, перезарядка, оборудование, шестое чувство и часы.
- Новые компоненты: «Артометр» и «Очки взвода».
- Сверка с исходниками клиента 1.45: лог урона после гибели больше не записывает попадания в боеукладку союзника, за которым следит камера; урон по машине, которой нет в данных боя, не считается уроном по противнику.
- «Личный рекорд»: помощь оглушением считается в бою, как в досье (на арте побитый рекорд виден в бою), и учитываются все режимы, в которых игра обновляет рекорды машины, в том числе «Мапбокс».
- Менеджер и загрузка реплеев: незаконченная запись второго клиента (temp1…temp99) больше не считается готовым реплеем.
- Режим стримера и фильтр чата: свои быстрые команды больше не принимаются за чужие; горячие клавиши работают и с правыми Ctrl, Shift и Alt. В командном чате «Линии фронта» у сообщений тоже есть время.
- Быстрые действия ангара и автопополнение действительно отправляют запрос клиенту.
- Перезарядка не пишет ошибку в python.log в начале боя; попадания по вам различают рикошет; личные боевые задачи показывают класс, уровни и условия; модернизации полевой доработки подписаны названием, а не ключом.

### en

New battle panels and every mod checked against the 1.45 client source.

- Battle panels are drawn with the client's own icons: team HP and score (replaces the stock bar, seven styles), damage log, hit log, marks, consumables, reload, equipment, sixth sense and clock.
- New components: Arty meter and Platoon points.
- Checked against the 1.45 client source: after death the damage log no longer records hits on the ammo rack of the ally the camera follows; damage to a vehicle missing from the battle data no longer counts as damage to an enemy.
- Personal best: stun assist counts in battle as the dossier counts it (an artillery record shows as beaten in battle), and every mode in which the game updates the vehicle's records counts, Mapbox included.
- Replay manager and upload: an unfinished recording of a second client (temp1…temp99) no longer passes for a finished replay.
- Streamer mode and chat filter: your own quick commands are no longer taken for someone else's; hotkeys also work with the right Ctrl, Shift and Alt. The Frontline team chat gets timestamps too.
- Hangar quick actions and auto-resupply really send their request to the client.
- The reload timer no longer writes an error to python.log at the start of a battle; hits on you tell a ricochet apart; personal missions show the class, tiers and conditions; field modification upgrades are shown by name, not by key.

## 0.1.1

### ru

Исправления после первой проверки в клиенте.

- Окно настроек открывается на весь экран поверх ангара; Ctrl+Shift+T открывает его и закрывает, повторное открытие не создаёт второе окно.
- Боевой интерфейс и кнопка «///» появляются в ангаре и в бою: страница Gameface открывается, только когда клиент уже в ангаре или в бою, и пересоздаётся при смене экрана.
- Панели двигаются только с зажатым модификатором (по умолчанию Alt), остаются в пределах экрана при любом разрешении и масштабе интерфейса и больше не дёргаются.
- Сборка кладёт отдельные пакеты и общий пакет в разные папки; мод предупреждает в python.log, если установлены оба набора.

### en

Fixes after the first live test.

- The settings window opens full-screen over the hangar; Ctrl+Shift+T opens and closes it, and opening it again never creates a second window.
- The HUD and the «///» button appear in the hangar and in battle: the Gameface page opens only once the client is in the hangar or a battle and is recreated when the screen changes.
- Panels move only while the modifier (Alt by default) is held, stay on screen at any resolution and interface scale, and no longer jitter.
- The build puts the split packages and the single package into separate folders; the mod warns in python.log when both sets are installed.

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

## hud_layouts 0.1.0

### ru

Новый компонент «Раскладка по типу боя».

- Свой набор боевых панелей для случайных боёв, «Натиска», «Линии фронта», событий (например, «Ваффентрагер») и «Стального охотника»: «Все панели», «Только основные» (отметка, часы и лог урона) или «Без панелей». Тип боя определяется сам по данным боя.
- Панель, перенесённая в бою не случайного типа, остаётся на новом месте только в боях этого типа; «Сбросить места по типам боя» и «Сбросить расположение» в редакторе HUD возвращают общие места.
- Настройка — в разделе «Редактор HUD» окна мода.

### en

A new component: Layout per battle type.

- A battle panel set of its own for random battles, Onslaught, Frontline, events (Waffenträger, for one) and Steel Hunter: «All panels», «Essentials only» (marks, clock and damage log) or «No panels». The battle type is detected from the battle's own data.
- A panel moved in a battle of a type other than random stays in its new place only in battles of that type; «Reset places per battle type» and «Reset layout» in the HUD editor bring back the shared places.
- It is set on the «HUD editor» page of the mod window.

## comp7_helper 0.1.0

### ru

Новый компонент «Натиск: дивизионы».

- Карточка в ангаре «Натиска»: ваш рейтинг и дивизион, сколько очков до следующего дивизиона с полосой прогресса, пороги «Чемпиона» и «Легенды» (C, B, A) из подсказок рангов игры и навык роли выбранной машины.
- Вне «Натиска» карточка скрыта, в квалификации показывает только рейтинг.

### en

A new component: Onslaught divisions.

- A card in the Onslaught hangar: your rating and division, the points to the next division with a progress bar, the Champion and Legend thresholds (C, B, A) from the game's rank tooltips and the role skill of the selected vehicle.
- Hidden outside Onslaught; during qualification it shows only the rating.

## event_trackers 0.1.0

### ru

Новый компонент «Трекеры событий» (выключен по умолчанию).

- «Триатлон»: ваш текущий раунд — сумма трёх лучших случайных боёв по чистому опыту за 60 минут на технике VI уровня и выше, лучшие бои, сколько осталось времени и лучший раунд за событие. Карточка видна, пока игра показывает соревнование по чистому опыту (или всегда, если так выбрано).
- «Торговый караван»: ваши жетоны и время до конца события; вне события карточки нет.
- Только ваши бои и данные: места соперников по «Триатлону» видны лишь на странице события в игре.

### en

A new component: Event trackers (off by default).

- Triathlon: your current round — the sum of the three best random battles by clean XP in 60 minutes on tier VI and up, the best battles, the time left and the best round of the event. The card shows while the game lists a clean-XP competition (or always, if chosen).
- Trading Caravan: your tokens and the time to the end of the event; no card outside it.
- Only your own battles and data: the Triathlon rivals' places are only on the game's own event page.

## arty_meter 0.1.2

### ru

- Новое место по умолчанию: в колонке слева от правого списка команд.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- New default place: in the column left of the right team list.
- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## arty_meter 0.1.1

### ru

- По умолчанию стоит в колонке слева под списком команды; «За день: 7 боёв, по вам 6 раз» с правильными формами слов.
- Выключен по умолчанию: стандартный набор боя — только ХП команд, лог урона, лог попаданий, отметка, расходники с перезарядкой и лампа. Включается в окне настроек.

### en

- By default it sits in the left column under the team list; correct word forms in the day line.
- Off by default: the default battle set is team HP, the damage log, the hit log, marks, consumables with reload and the lamp only. Turn it on in the settings window.

## arty_meter 0.1.0

### ru

- «Артометр»: прямые попадания, накрытия, повреждённые модули, оглушения и урон от арты по вашей машине в бою («градусник» 0–10) и за день; в ангаре — список последних боёв. Только огонь по своей машине, без позиций и трассеров.

### en

- Artillery meter: direct hits, splash, damaged modules, stuns and damage from artillery on your vehicle in battle (a 0-10 thermometer) and over the day; in the hangar, a list of recent battles. Only fire on your own vehicle, no positions or tracers.

## platoon_points 0.1.2

### ru

- Новое место по умолчанию: в колонке справа от левого списка команд.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- New default place: in the column right of the left team list.
- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## platoon_points 0.1.1

### ru

- По умолчанию стоит слева вверху в колонке с отметкой.
- Выключен по умолчанию: стандартный набор боя — только ХП команд, лог урона, лог попаданий, отметка, расходники с перезарядкой и лампа. Включается в окне настроек.

### en

- By default it sits top left in the column with the marks.
- Off by default: the default battle set is team HP, the damage log, the hit log, marks, consumables with reload and the lamp only. Turn it on in the settings window.

## platoon_points 0.1.0

### ru

- «Очки взвода»: очки как в турнире за урон, помощь, фраги и выживание по вашим правилам, с полосками ХП взвода. У союзников — только фраги и ХП, которые игра и так показывает.

### en

- Platoon points: tournament-style points for damage, assist, frags and survival by your own rules, with the platoon's HP bars. For mates only the frags and HP the game already shows.

## battle_hits 0.2.0

### ru

- «Боевые раны» в ангаре — карточка: полученный урон крупно, пробития, непробития и рикошеты значками исходов клиента, попадания по частям и сторонам.
- Подпись в ангаре видна только в самом ангаре: на экране очереди в бой, в других разделах, в окне настроек и в полноэкранных окнах клиента она скрыта.
- Правильные формы слов: «2 попадания», «5 попаданий».

### en

- Battle wounds in the hangar is a card: the damage taken in big type, penetrations, no pens and ricochets with the client's outcome icons, hits by part and side.
- The hangar label shows only in the hangar itself: on the battle queue screen, in other lobby sections, in the settings window and in the client's full-screen windows it is hidden.
- Correct word forms for the hit count.

## battle_hits 0.1.0

### ru

- «Боевые раны»: попадания по вашему танку записываются в бою (только своя машина) и показываются в ангаре после боя — итог последнего боя и схема сверху (корпус, башня, орудие, ходовая) с точками попаданий, стороной, исходом, уроном и стрелявшим в окне модпака. Хранятся последние бои (до 30), каждый можно удалить.

### en

- «Battle wounds»: the hits on your tank are recorded in battle (your own vehicle only) and shown in the hangar after it: the last battle's summary and, in the modpack window, a schematic from above (hull, turret, gun, running gear) with the hit points, the side, the outcome, the damage and who fired. The last battles are kept (up to 30), each can be deleted.

## gun_arc 0.2.1

### ru

- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## gun_arc 0.2.0

### ru

- УГН — плашка с градусами до упора цветом и полосой положения орудия.
- По умолчанию стоит под перезарядкой и не перекрывает её.
- Выключен по умолчанию: стандартный набор боя — только ХП команд, лог урона, лог попаданий, отметка, расходники с перезарядкой и лампа. Включается в окне настроек.

### en

- Gun traverse is a plate with the degrees to each stop in colour and a bar with the gun's position.
- By default it sits under the reload bar instead of over it.
- Off by default: the default battle set is team HP, the damage log, the hit log, marks, consumables with reload and the lamp only. Turn it on in the settings window.

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

## hangar_info 0.4.0

### ru

- Подпись — карточка: время крупно с датой, сервер, пинг цветом по качеству и онлайн значками, для выбранного танка уровни боёв, опыт экипажа до навыка и ускоренное обучение.
- Подпись в ангаре видна только в самом ангаре: на экране очереди в бой, в других разделах, в окне настроек и в полноэкранных окнах клиента она скрыта.
- По умолчанию стоит справа сразу под верхней панелью ангара.

### en

- The label is a card: the time in big type with the date, the server, the ping coloured by quality and the online count as icons, and for the selected tank its battle tiers, crew XP to a skill and accelerated training.
- The hangar label shows only in the hangar itself: on the battle queue screen, in other lobby sections, in the settings window and in the client's full-screen windows it is hidden.
- By default it sits on the right right under the hangar's top bar.

## hangar_info 0.3.0

### ru

- Кнопка «Броня на сайте» в окне модпака: открывает 3D-броню выбранного танка на triotmetki.ru.

### en

- An «Armour on the site» button in the modpack window: opens the selected tank's 3D armour on triotmetki.ru.

## received_hits 0.2.1

### ru

- Новое место по умолчанию: под отметкой справа от левого списка команд.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- New default place: under the marks panel, right of the left team list.
- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## received_hits 0.2.0

### ru

- «По вам» — карточка: урон крупно, попадания, пробития и заблокированный урон значками, строка на выстрел со значком класса стрелявшего и исходом цветом.
- По умолчанию стоит в колонке над логом урона и отметкой, а не поверх них.
- По умолчанию стоит слева вверху под отметкой, а не над чатом.
- Выключен по умолчанию: стандартный набор боя — только ХП команд, лог урона, лог попаданий, отметка, расходники с перезарядкой и лампа. Включается в окне настроек.

### en

- Hits on you is a card: the damage in big type, hits, penetrations and blocked damage as icons, a line per shot with the shooter's class icon and the outcome in colour.
- By default it sits in the column above the damage log and the marks, not over them.
- By default it sits top left under the marks, not over the chat.
- Off by default: the default battle set is team HP, the damage log, the hit log, marks, consumables with reload and the lamp only. Turn it on in the settings window.

## received_hits 0.1.0

### ru

- Лог попаданий по вашему танку: класс и название стрелявшей машины, снаряд, урон и исход (пробитие, крит, не пробил, рикошет), криты присоединяются к своему выстрелу; итог за бой и свой шаблон строки.

### en

- A log of the hits on your tank: the class and name of the vehicle that fired, the shell, the damage and the outcome (penetrated, critical, no pen, ricochet); crits join their shot; battle totals and a custom line template.

## death_card 0.2.0

### ru

- Карточка гибели: значок класса стрелявшего, его имя, урон крупно, снаряд значком, повреждённые модули и сторона выстрела.

### en

- The death card: the shooter's class icon and name, the damage in big type, the shell as an icon, the damaged modules and the side of the shot.

## death_card 0.1.0

### ru

- Карточка после уничтожения вашего танка: кто сделал последний выстрел (или кого назвала лента убийств), снаряд или причина (пожар, таран), урон, повреждённые модули и экипаж и сторона корпуса, как её показал индикатор попаданий игры. Пока танк жив, ничего не рисуется; ни позиций, ни траекторий.

### en

- A card after your tank is destroyed: who fired the last shot (or whom the kill feed named), the shell or the cause (fire, ram), the damage, the damaged modules and crew and the side of the hull as the game's hit indicator showed it. Nothing is drawn while the tank is alive; no positions, no trajectories.

## battle_loadout 0.5.0

### ru

- Только оборудование и директивы значками из клиента в квадратных ячейках с рамкой: никаких подписей и плашек «набор N/2» и «снаряды N/2» — снаряды и расходники показывает стандартная панель под рядом.
- Знак директивы, которая не действует на танк, — щит с «!» вместо буквы; улучшенное, трофейное и модернизированное оборудование — со стандартным значком поверх иконки, ★ — в слоте своей специализации.
- Название и действие предмета — в подсказке самой игры при наведении с Ctrl (своя подсказка остаётся, где игровая недоступна).
- Нет картинки у клиента — в ячейке наш значок, а не название.

### en

- Equipment and directives only, as the client's icons in square framed cells: no labels and no «set N/2» and «shells N/2» badges, the stock panel under the row shows the shells and consumables.
- A directive that does not affect the tank wears a shield with «!» instead of a letter; improved, trophy and modernized devices wear the stock mark over the icon, ★ marks a slot of the device's own specialisation.
- The item's name and effect are in the game's own tooltip on hover with Ctrl (our tooltip stays where the game's is unavailable).
- When the client has no image, the cell shows our glyph, not the name.

## battle_loadout 0.4.1

### ru

- Оборудование снова видно в бою: машина для директив и наборов собирается так же, как её собирает клиент (слот специализации и модификаторы боя), а если клиент её не собрал, ряд всё равно показывает значки оборудования.

### en

- The equipment shows in battle again: the vehicle for the directives and sets is built the way the client builds it (the specialisation slot and the battle modifiers), and when the client cannot build it the row still shows the equipment icons.

## battle_loadout 0.4.0

### ru

- Директива снова в ряду: в стандартной рамке, с «!», если она не действует на ваш танк (как в ангаре), а оборудование, которое она усиливает, подсвечено.
- Бейджи «набор 1/2» и «снаряды 1/2»: какой набор полевой модернизации выбран, если у танка открыто переключение.
- Маскировочная сеть и стереотруба светятся, пока работают; израсходованная улучшенная конфигурация тускнеет — как на стандартной панели.
- Значки размером 45×45, как стандартные значки оборудования в бою.

### en

- The directive is back in the row: in the stock frame, with «!» when it does not affect your tank (as in the garage), and the equipment it boosts is highlighted.
- «set 1/2» and «shells 1/2» badges: which field modification set is selected when the tank has setup switching.
- The camouflage net and the binoculars glow while they work; a spent improved configuration fades, as on the stock panel.
- 45×45 icons, the size of the stock equipment icons in battle.

## battle_loadout 0.3.0

### ru

- Вместо строки названий — значки оборудования прямо над стандартной панелью снарядов и расходников, по центру с ней, на любом масштабе интерфейса.
- Наведите курсор (Ctrl) на значок — подсказка скажет название предмета и что он даёт.
- Отметки «+», модернизации и трофейного оборудования, ★ и рамка у предмета в слоте своей специализации.
- Читается в бою прямо с вашей машины, заходить на танк в ангаре заранее не нужно. Включено по умолчанию; полевая модернизация и инструкции больше не показываются.

### en

- Equipment icons instead of a line of names, right above the stock shells and consumables panel and centred with it, at any interface scale.
- Point the cursor (Ctrl) at an icon for a tooltip with the item's name and what it does.
- The «+», modernized and trophy marks, a ★ and a frame on an item in a slot of its own specialisation.
- Read in battle from your own vehicle, no need to select the tank in the hangar first. On by default; field modifications and directives are no longer shown.

## battle_loadout 0.2.1

### ru

- Звёздочка бонуса учитывает слот с выбранной вами специализацией (полевая модернизация), как в ангаре.
- По умолчанию полоса стоит слева от наших расходников над стандартной панелью и не наезжает на лог урона.
- Выключен по умолчанию: стандартный набор боя — только ХП команд, лог урона, лог попаданий, отметка, расходники с перезарядкой и лампа. Включается в окне настроек.

### en

- The bonus star counts the slot with the specialization you chose (field modification) as the hangar does.
- By default the strip sits left of our consumables above the stock bar and no longer runs into the damage log.
- Off by default: the default battle set is team HP, the damage log, the hit log, marks, consumables with reload and the lamp only. Turn it on in the settings window.

## battle_loadout 0.2.0

### ru

- Оборудование и директивы иконками клиента со звездой бонуса, полоса слева от панели расходников.

### en

- Equipment and directives as client icons with the bonus star, a strip left of the consumables bar.

## battle_loadout 0.1.0

### ru

- Оборудование своего танка в бою со значками предметов игры (★ — в слоте со своим бонусом), полевая модернизация и директивы; компактный вид значками или подробный по группам, место — в редакторе HUD.

### en

- Your tank's equipment in battle with the game's item icons (★: in a slot with its own bonus), field modifications and directives; a compact icon row or a detailed list by group, placed in the HUD editor.

## personal_missions 0.2.1

### ru

- Новое место по умолчанию в бою: в колонке слева от правого списка команд, а не на левом списке.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- New default place in battle: in the column left of the right team list, not on the left one.
- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## personal_missions 0.2.0

### ru

- Подпись «ЛБЗ» в ангаре стала компактной карточкой: счётчики «в работе», «выполнено», «с отличием» значками и задачи в работе одной строкой со значком статуса; основное условие — одна приглушённая строка, полные условия — на странице в окне мода.
- Подпись в ангаре видна только в самом ангаре: на экране очереди в бой, в других разделах, в окне настроек и в полноэкранных окнах клиента она скрыта.
- Строка в бою — такая же карточка; по умолчанию она стоит в колонке слева под списком команды.
- Строка ЛБЗ в бою выключена по умолчанию (включается в окне настроек).

### en

- The «ЛБЗ» hangar label is a compact card now: the in progress, done and with honours counters as icons and the missions in progress one line each with a status mark; the main condition is one dimmed line, the full conditions are on the page in the mod window.
- The hangar label shows only in the hangar itself: on the battle queue screen, in other lobby sections, in the settings window and in the client's full-screen windows it is hidden.
- The battle line is the same card; by default it sits in the left column under the team list.
- The battle line of personal missions is off by default (turn it on in the settings window).

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

## platoon_helper 0.2.0

### ru

- Взвод в ангаре — карточка: готовность напарников значками и число «2/3», свои бои во взводе и в клане.
- Подпись в ангаре видна только в самом ангаре: на экране очереди в бой, в других разделах, в окне настроек и в полноэкранных окнах клиента она скрыта.
- Правильные формы слова «бой».

### en

- The platoon label is a card: the mates' ready marks and «2/3», the own platoon and clan battles.
- The hangar label shows only in the hangar itself: on the battle queue screen, in other lobby sections, in the settings window and in the client's full-screen windows it is hidden.
- Correct word forms for the battle count.

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

## crosshair 0.3.1

### ru

- Предпросмотр в настройках рисует прицел с выбранной меткой в её размере.

### en

- The settings preview draws the reticle with the chosen mark at its size.

## crosshair 0.3.0

### ru

- Три новые центральные метки: зелёные дуги, рамка с засечками, уголки поправки.

### en

- Three new centre marks: green arcs, a box with ticks, stacked chevrons.

## crosshair 0.2.0

### ru

- Пять новых своих одноцветных центральных меток (точка, крест, пунктирное кольцо, скобки, ромб) и выбор их цвета: белый, зелёный, жёлтый, голубой, пурпурный, красный.

### en

- Five new one-colour centre marks of our own (dot, cross, dashed ring, brackets, diamond) and a choice of their colour: white, green, yellow, cyan, magenta, red.

## personal_best 0.2.1

### ru

- Новое место по умолчанию: в колонке справа от левого списка команд, а не на нём.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- New default place: in the column right of the left team list, not on it.
- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## personal_best 0.2.0

### ru

- Рекорд танка — карточка со значками урона, помощи и фрагов и полосой до рекорда; побитый рекорд золотом. По умолчанию слева под списком команды.
- По умолчанию стоит в колонке под полосой ХП команд.
- Выключен по умолчанию: стандартный набор боя — только ХП команд, лог урона, лог попаданий, отметка, расходники с перезарядкой и лампа. Включается в окне настроек.

### en

- The tank record is a card with the damage, assist and frags icons and a bar to the record; a beaten record in gold. By default on the left under the team list.
- By default it sits in the column under the team HP strip.
- Off by default: the default battle set is team HP, the damage log, the hit log, marks, consumables with reload and the lamp only. Turn it on in the settings window.

## personal_best 0.1.0

### ru

- Рекорд урона, помощи и фрагов на танке в бою: «рекорд 6 812, осталось 1 200», после рекорда — «Новый рекорд».
- После боя, побившего рекорд, — уведомление-карточка в ангаре и наш звук.
- Рекорды берутся из досье своего танка, своих итогов боёв и копии рекордов на сайте (`/mod/me/tanks`); при переполнении забывается танк, который дольше всех не встречался.

### en

- The tank's damage, assist and frags record in battle: «record 6,812, 1,200 to go», then «New record».
- After a battle that beat a record, a card notification in the hangar and our sound.
- Records come from the own tank dossier, the own battle results and the site's copy of them (`/mod/me/tanks`); when full, the tank not seen for the longest is forgotten.

## session_goals 0.2.1

### ru

- Новое место по умолчанию в бою: в колонке слева от правого списка команд.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- New default place in battle: in the column left of the right team list.
- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## session_goals 0.2.0

### ru

- Цели в ангаре и в бою — карточки со значками статуса и полосой прогресса.
- Подпись в ангаре видна только в самом ангаре: на экране очереди в бой, в других разделах, в окне настроек и в полноэкранных окнах клиента она скрыта.
- Строка целей в бою выключена по умолчанию (включается в окне настроек).

### en

- Goals in the hangar and in battle are cards with status marks and a progress bar.
- The hangar label shows only in the hangar itself: on the battle queue screen, in other lobby sections, in the settings window and in the client's full-screen windows it is hidden.
- The battle line of goals is off by default (turn it on in the settings window).

## session_goals 0.1.0

### ru

- Цели из кабинета на сайте: прогресс в ангаре, строка в бою (для цели по среднему урону — сколько урона нужно в этом бою) и звук, когда сайт отметил цель выполненной.
- Чтение `/mod/me/goals` после привязки, в ангаре; сервер ещё не отдаёт этот запрос (контракт `contract/goals.schema.json`).

### en

- Goals from your site dashboard: progress in the hangar, a battle line (for an average-damage goal, the damage this battle needs) and a sound when the site marks a goal met.
- Reads `/mod/me/goals` once bound, in the hangar; the server does not serve it yet (contract `contract/goals.schema.json`).

## main_gun 0.3.0

### ru

- «Недостижим»: когда у противников осталось меньше ХП, чем вам не хватает до порога, счётчик говорит, что медаль уже не взять.
- «Провален»: после попадания вашего выстрела в союзника (то же «Попадание в союзника», что пишет клиент) медаль не выдаётся, и счётчик это показывает.
- ХП противников — те же числа, что у стандартной панели счёта.
- По умолчанию панель стоит в правой верхней колонке, у списка команды, и больше не закрывает полосы захвата базы и прогресс задач под панелью счёта. Панель, которую вы не двигали, переезжает сама.

### en

- «Out of reach»: when the enemies have less HP left than you still need for the threshold, the counter says the medal can no longer be earned.
- «Failed»: after your shot hits an ally (the same «Ally hit» the client reports) the medal is not awarded, and the counter shows it.
- The enemy HP is the same number the stock score strip shows.
- By default the panel sits in the right top column by the team list and no longer covers the base capture bars and the mission progress under the score strip. A panel you never moved moves by itself.

## main_gun 0.2.1

### ru

- «Основной калибр» по умолчанию под полосой ХП команд, а не на правом списке команд.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- «High Caliber» sits under the team HP strip by default, not on the right team list.
- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## main_gun 0.2.0

### ru

- «Основной калибр» — карточка с полосой прогресса до порога; по умолчанию стоит под полосой ХП команд.
- Выключен по умолчанию: стандартный набор боя — только ХП команд, лог урона, лог попаданий, отметка, расходники с перезарядкой и лампа. Включается в окне настроек.

### en

- High Caliber is a card with a progress bar to the threshold; by default it sits under the team HP strip.
- Off by default: the default battle set is team HP, the damage log, the hit log, marks, consumables with reload and the lamp only. Turn it on in the settings window.

## main_gun 0.1.0

### ru

- Счётчик «Основного калибра»: ваш урон против порога медали (20% ХП противника, не меньше 1 000), урон команды и ваша доля.

### en

- The High Caliber counter: your damage against the medal threshold (20% of the enemy HP, at least 1,000), the team damage and your share.

## battle_efficiency 0.2.2

### ru

- По умолчанию в левой колонке под отметкой, а не посередине под панелью счёта: панель больше не закрывает полосы захвата баз и прогресс боевых задач.
- Панель, которую вы не двигали, переезжает на новое место сама.

### en

- Sits in the left column under the marks by default, not in the middle under the score strip, so it no longer covers the base capture bars and the quest progress.
- A panel you never moved moves to the new place on its own.

## battle_efficiency 0.2.1

### ru

- По умолчанию под полосой ХП команд, а не на правом списке команд.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- Sits under the team HP strip by default, not on the right team list.
- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## battle_efficiency 0.2.0

### ru

- WN8 боя — карточка: оценка крупно цветом, WN8 на танке и урон против среднего; по умолчанию под «Основным калибром».
- Выключен по умолчанию: стандартный набор боя — только ХП команд, лог урона, лог попаданий, отметка, расходники с перезарядкой и лампа. Включается в окне настроек.

### en

- Battle WN8 is a card: the estimate in big type and colour, the tank's WN8 and the damage against the average; by default under High Caliber.
- Off by default: the default battle set is team HP, the damage log, the hit log, marks, consumables with reload and the lamp only. Turn it on in the settings window.

## battle_efficiency 0.1.0

### ru

- Эффективность боя: оценка WN8 этого боя по ожидаемым значениям танка и урон против своего среднего на нём, цветом выше или ниже своего.
- Без известного среднего урона (0 или нет данных) строка урона не показывается.

### en

- Battle efficiency: a WN8 estimate of this battle from the tank's expected values and the damage against your own average on it, coloured above or below your own.
- Without a known average damage (0 or missing) the damage line is left out.

## reload_timer 0.2.1

### ru

- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## reload_timer 0.2.0

### ru

- Полоса перезарядки с секундами и кассетой под прицелом.

### en

- A reload bar with seconds and the magazine under the reticle.

## reload_timer 0.1.0

### ru

- Отсчёт перезарядки своего орудия с полоской и снаряды в кассете; только своё орудие. Отсчёт идёт по времени игры и не отстаёт от прицела.

### en

- Your gun's reload countdown with a bar and the shells in the magazine; your own gun only. It counts by game time and keeps pace with the reticle.

## core 0.6.6

### ru

- Удалён доступ к контроллеру расходников боя: им пользовалась только удалённая панель снаряжения. Ряд оборудования — единственная панель над стандартной панелью снарядов.

### en

- The access to the battle consumables controller is removed: only the removed consumables bar used it. The equipment row is the only panel above the stock shells panel.

## core 0.6.5

### ru

- Каждая панель передаёт странице короткое описание своего компонента для подсказки.
- С зажатым Tab панели остаются на экране (страница приглушает те, что под таблицей), клавиша V прячет их, не убирая: после неё ничего не прыгает.
- Предпросмотр панели в настройках получает её образец для той же отрисовки, что в бою.

### en

- Every panel hands the page its component's short description for the tooltip.
- With Tab held the panels stay on the screen (the page dims the ones under the table), and V hides them without removing them, so nothing jumps afterwards.
- A panel's settings preview gets its sample widget, drawn the same way as in battle.

## core 0.6.4

### ru

- Ни одна колонка боевых панелей больше не начинается под панелью счёта посередине верхнего края: там игра показывает полосы захвата баз и прогресс боевых задач.

### en

- No battle panel column starts under the score strip in the middle of the top edge any more: the game shows the base capture bars and the quest progress there.

## core 0.6.3

### ru

- Боевые панели с альтернативным видом разворачиваются, пока зажат Alt, — по той же клавише, по которой игра показывает подробные маркеры и расширенный лог урона.

### en

- Battle panels with an alternate view expand while Alt is held, on the same key the game shows its detailed markers and extended damage log with.

## core 0.6.2

### ru

- В бою панели перетаскиваются прямо курсором: зажмите Ctrl, как обычно, и тяните панель, колесо меняет размер. Вторая клавиша больше не нужна; в ангаре по-прежнему с Alt.
- С курсором в бою мод забирает мышь только над панелью под курсором: миникарта, списки команд и чат нажимаются как обычно.
- Места панелей по умолчанию заново выверены по раскладке боевого интерфейса клиента в его собственных единицах, поэтому совпадают при любом масштабе интерфейса.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое.
- Окно настроек мода больше не прячет панели ангара, а панели при появлении не прыгают.
- В otmetki.log пишется, видит ли страница курсор и мышь в бою.

### en

- In battle panels drag with the cursor itself: hold Ctrl as usual and drag a panel, the wheel resizes it. No second key any more; the hangar still uses Alt.
- With the battle cursor shown the mod takes the mouse only over the panel under it: the minimap, the team lists and the chat click as usual.
- The default panel places are measured again against the client's battle layout in its own units, so they hold at every interface scale.
- A panel you never moved leaves the default place of earlier versions for the new one.
- The mod settings window no longer hides the hangar panels, and panels no longer jump when they come back.
- otmetki.log records whether the page sees the cursor and the mouse in battle.

## core 0.6.1

### ru

- Боевые панели: все изменения за кадр уходят на страницу HUD одним обновлением, а неизменившееся не отправляется.

### en

- Battle panels: all the changes of a frame reach the HUD page as one update, and an unchanged state is not sent.

## core 0.6.0

### ru

- Раскладка по типу боя (`core.hud.modes`): тип боя (случайный, «Натиск», «Линия фронта», событие, «Стальной охотник») по `guiType` и `bonusType` арены, а если их нет — по странице боя; слой HUD берёт набор панелей и места этого типа, панель вне набора не запускается и ничего не заменяет.
- Стандартные элементы боя заменяются только в случайных боях и «Натиске» и только если на странице боя такой элемент есть; страницы событий на основе обычной, «Линия фронта» и «Стальной охотник» сохраняют все свои элементы.
- Места панелей по типам боя хранятся в `components.json` (`hud_layout_places`) и попадают в профили.
- Формы слов «очко», «день», «час», «жетон».

### en

- Layout per battle type (`core.hud.modes`): the battle type (random, Onslaught, Frontline, event, Steel Hunter) from the arena's `guiType` and `bonusType`, else from the battle page; the HUD layer takes that type's panel set and places, and a panel outside the set does not start and replaces nothing.
- Stock battle elements are replaced only in random battles and Onslaught and only when the battle page has that element; event pages built on the standard one, Frontline and Steel Hunter keep all of theirs.
- Panel places per battle type are kept in `components.json` (`hud_layout_places`) and go into profiles.
- Word forms for points, days, hours and tokens.

## core 0.5.0

### ru

- Подписи ангара и кнопка «///» видны только в обычном виде ангара (`core/lobby_view`): правило то же, что у стандартных маркеров техники в ангаре — окно ангара открыто и нет другого окна слоёв SUB_VIEW, TOP_SUB_VIEW, FULLSCREEN_WINDOW и OVERLAY. Очередь в бой, магазин, исследования, окно настроек и полноэкранные окна их скрывают.
- Общая карточка панелей (`core.hud.widget.card`): заголовок со значком, крупное число, значки с числами, строки со статусом, приглушённой строкой условия и полосой прогресса.
- Колонки панелей (`core.hud.panel.DOCKS`): панели одной колонки встают друг под другом и не перекрываются при любой высоте, а при нехватке места начинают вторую колонку.
- Формы слов по числу (`core.format.plural`, `counted`): «1 бой», «2 боя», «5 боёв».
- Подпись ангара без своего места запоминает, куда её перетащили, и возвращается по «Сбросить расположение».

### en

- Hangar labels and the «///» button show only in the plain hangar view (`core/lobby_view`): the rule of the stock hangar's vehicle markers, the hangar window open and no other window of the SUB_VIEW, TOP_SUB_VIEW, FULLSCREEN_WINDOW and OVERLAY layers. The battle queue, the store, research, the settings window and full-screen windows hide them.
- A shared panel card (`core.hud.widget.card`): a header with an icon, a big number, icon + number chips, rows with a status mark, a dimmed condition line and a progress bar.
- Panel columns (`core.hud.panel.DOCKS`): the panels of a column sit one under another and never overlap whatever their height, and start a second column when there is no room.
- Word forms by number (`core.format.plural`, `counted`): «1 бой», «2 боя», «5 боёв», «1 battle».
- A hangar label without a place of its own remembers where it was dragged and goes back with «Reset layout».

## core 0.4.0

### ru

- Протокол боевого интерфейса v3: у панели, кроме текста для GUIFlash, есть структурированные данные (`core/hud/widget`), по которым страница Gameface рисует иконки, числа и полосы.
- Пути к иконкам клиента (`core/hud/icons`): классы техники, снаряды, расходники, отметки, флаги, уровни; отсутствующий в клиенте файл заменяется нашим значком.
- Замена стандартных элементов боя (`core/hud/stock`): панель счёта, лог урона, лампа и таймер скрываются, только пока их рисует наша страница Gameface, и возвращаются, когда компонент выключен или рисует GUIFlash. Наши панели прячутся вместе со стандартным интерфейсом (V, Tab).
- Окно HUD получает родителя — главное окно клиента, как у ModsList и Battle Observer.

### en

- HUD protocol v3: besides the GUIFlash text, a panel carries structured data (`core/hud/widget`) the Gameface page draws as icons, numbers and bars.
- Client icon paths (`core/hud/icons`): vehicle classes, shells, consumables, marks, flags, tiers; a file missing in the client falls back to our glyph.
- Replacing stock battle elements (`core/hud/stock`): the score strip, damage log, lamp and timer are hidden only while our Gameface page draws them, and come back when the component is off or GUIFlash draws. Our panels hide with the stock GUI (V, Tab).
- The HUD window gets the client's main window as its parent, as ModsList and Battle Observer do.

## core 0.3.0

### ru

- Общие чтения своего аккаунта с сайта (`core/me`, `core/client/me`): подписанный запрос `/mod/me/*`, отбрасывание ответов о чужом аккаунте, задержки повторов и общее чтение строк своих танков (`/mod/me/tanks`) — оно одно на всю игру для рейтингов, рекордов и эффективности.
- ХП команд (`core/teams`, `core/client/battle/teams`) вынесены из панели ХП, чтобы ими пользовался и счётчик «Основного калибра».
- Звуки в MP3 (`play_mp3`): наши звуки из `res/audioww/` проигрываются через собственное MP3-событие клиента, без банков Wwise.
- Заголовок реплея теперь даёт итог боя и урон записавшего игрока (только его собственная запись итогов).
- `Ticker.elapsed()`: время игры с прошлого тика, чтобы отсчёты не отставали (обратный вызов приходит на первом кадре после задержки).
- Общие помощники для новых компонентов: классы техники (`core/classes`), классы боевого чата и проверка своих строк (`core/client/chat`), горячие клавиши (`core/client/hotkey`; удержанная клавиша не срабатывает повторно), источник урона и курс своего корпуса (`core/client/battle`).
- Слой HUD и подписи ангара умеют временно убирать панели (`set_muted`, `set_blocked`) и возвращать их с последним текстом — для режима стримера.

### en

- Shared reads of the own account from the site (`core/me`, `core/client/me`): the signed `/mod/me/*` request, dropping answers about another account, retry delays and one shared read of the own tank rows (`/mod/me/tanks`) for the ratings, records and efficiency.
- Team HP (`core/teams`, `core/client/battle/teams`) moved out of the team HP panel so the High Caliber counter can use it too.
- MP3 sounds (`play_mp3`): our sounds from `res/audioww/` play through the client's own custom-MP3 event, no Wwise bank needed.
- The replay header now gives the battle result and damage of the recorder (only its own results entry).
- `Ticker.elapsed()`: the game time since the previous tick, so countdowns do not lag (a callback fires on the first frame after its delay).
- Shared helpers for the new components: vehicle classes (`core/classes`), the battle chat classes and the own-line check (`core/client/chat`), hotkeys (`core/client/hotkey`; a held key does not fire again), the damage source and the own hull yaw (`core/client/battle`).
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

## companion 0.6.3

### ru

- Переключатель удалённой панели снаряжения (`battle_consumables`) больше не хранится: старый ключ в `config.json` тихо отбрасывается.

### en

- The switch of the removed consumables bar (`battle_consumables`) is no longer kept: the old key in `config.json` is silently dropped.

## companion 0.6.2

### ru

- Один раз для всех: повторная панель расходников выключается, ряд оборудования включается. Если включить расходники обратно, они останутся включёнными.
- Подсказки у меток ангара и кнопки настроек.

### en

- Once for everyone: the duplicate consumables bar is switched off and the equipment row on. Switched back on, the consumables bar stays on.
- Tooltips on the hangar labels and the settings button.

## companion 0.6.1

### ru

- «Оборудование в бою» включено по умолчанию, панель снарядов и расходников выключена (стандартная показывает то же); настройки, которые вы не меняли, переходят на новые значения один раз.

### en

- «Equipment in battle» is on by default and the consumables bar off (the stock panel shows the same); switches you never changed take the new defaults once.

## companion 0.6.0

### ru

- Переключатели новых компонентов: «Раскладка по типу боя» и «Натиск: дивизионы» включены, «Трекеры событий» выключены по умолчанию.

### en

- Switches of the new components: Layout per battle type and Onslaught divisions are on, Event trackers is off by default.

## companion 0.5.0

### ru

- Вторичные боевые панели выключены по умолчанию (у новых игроков): «Основной калибр», WN8 боя, рекорд танка, УГН, артометр, очки взвода, «По вам», оборудование в бою и часы. Уже сохранённые настройки не меняются.

### en

- The secondary battle panels are off by default (for new players): High Caliber, battle WN8, the tank record, gun traverse, the arty meter, platoon points, hits on you, equipment in battle and the clock. Settings you already saved do not change.

## companion 0.4.0

### ru

- Переключатели «Артометра» и «Очков взвода».

### en

- Switches for the artillery meter and the platoon points.

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

## ui 0.6.3

### ru

- Страница HUD больше не рисует панель снаряжения и снарядов; ряд оборудования — квадратные ячейки с иконками клиента без подписей и с подсказкой игры.

### en

- The HUD page no longer draws the consumables and shells bar; the equipment row is square cells with the client's icons, no labels and the game's tooltip.

## ui 0.6.2

### ru

- Колесо мыши прокручивает список реплеев, подробности и выпадающие списки: высота списка считается без `scrollHeight`, которого нет в Gameface.
- ХП команд: плашка по размеру содержимого, числа внутри полос, счёт и разница под ним по центру; все семь стилей выровнены по одной линии.
- Подсказка с описанием при наведении на любой блок (подсказка самого клиента, клики проходят насквозь, пропадает вместе с курсором).
- Предпросмотры в карточках и в редакторе HUD рисуются панелями боя, по центру и в размер рамки.
- Окно и HUD не зависят от атрибутов элементов, которых нет у Gameface.

### en

- The mouse wheel scrolls the replays list, its details and the drop-down lists: the list height is measured without `scrollHeight`, which Gameface lacks.
- Team HP: the plate hugs its content, the numbers sit inside the bars, the score and the difference under it in the centre; all seven styles line up on one line.
- A tooltip with a description over any block (the client's own tooltip, clicks pass through, gone with the cursor).
- The previews in the cards and the HUD editor are drawn by the battle panels, centred and fitted to their frame.
- The window and the HUD no longer rely on element attributes Gameface does not have.

## ui 0.6.1

### ru

- В таблице отчёта по отметкам снова видно цвет изменения процента.

### en

- The marks report table shows the colour of the percentage change again.

## ui 0.6.0

### ru

- С установленным ModsList (poliroid, 1.6.01 — последняя версия, которая работает в «Мире танков») «Три отметки» открываются из его кнопки в правом нижнем ряду кнопок ангара; своя кнопка «///» остаётся только без ModsList. Менеджер ставит ModsList как необязательную библиотеку.
- Esc делает шаг назад: закрывает подтверждение, затем открытый список, затем очищает или отпускает поле ввода и только потом закрывает окно.
- Ангар за окном размыт тем же размытием, что и у окон самого клиента, вместо тёмной подложки.
- Подсказки и звуки кнопок — клиентские.
- Ctrl+F ставит курсор в поиск; колесо мыши прокручивает плавно; окно помнит, где вы остановились на каждой странице, до выхода из игры.

### en

- With ModsList installed (poliroid, 1.6.01, the last release that runs in «Мир танков») «Три отметки» opens from its button in the hangar's bottom-right button row; our own «///» button stays only without ModsList. The manager installs ModsList as an optional library.
- Esc steps back: it closes a confirmation, then an open list, then clears or leaves a text field, and only then closes the window.
- The hangar behind the window is blurred with the client's own window blur instead of a dark backdrop.
- Tooltips and button sounds are the client's own.
- Ctrl+F puts the cursor in the search; the mouse wheel scrolls smoothly; the window remembers where you left each page until you quit the game.

## ui 0.5.2

### ru

- Подсказка «Клавиша перемещения панелей в ангаре»: в бою достаточно Ctrl.
- Страница боевых панелей: перетаскивание курсором в бою, подсказки над значками оборудования, панели не прыгают при появлении.

### en

- The «Key to move panels in the hangar» hint: in battle Ctrl is enough.
- The battle panels page: dragging with the battle cursor, tooltips over equipment icons, panels no longer jump when they come back.

## ui 0.5.1

### ru

- Окно настроек открывается по центру экрана в сохранённом размере и не уезжает за край, даже когда игра ставит окно не в угол экрана.
- Окно снова перетаскивается за «///» и заголовок, меняет размер за край и уголок.
- Колесо мыши прокручивает списки компонентов и страницу реплеев.
- Esc закрывает окно, а меню игры по Esc не открывается.
- Значки, которых нет в шрифте игры (★, →, ✓), в подсказках заменяются похожими, а не пропадают.
- В otmetki.log пишется, какой размер экрана и окна видит страница и доходят ли до неё мышь, колесо и Esc.

### en

- The settings window opens centred on the screen at its saved size and no longer runs off the edge, even when the game places the window away from the screen corner.
- The window can be dragged by «///» and the title again, and resized by its edge and corner.
- The mouse wheel scrolls the component lists and the replays page.
- Esc closes the window, and the game's Esc menu no longer opens.
- Glyphs the game font lacks (★, →, ✓) are drawn with look-alikes in hints instead of going blank.
- otmetki.log records the screen and window size the page sees and whether the mouse, the wheel and Esc reach it.

## ui 0.5.0

### ru

- Окно настроек больше не пересылает список реплеев с каждым изменением: страница «Реплеи» получает его отдельно, только пока открыта, и дальше лишь изменившиеся реплеи, так что окно и ангар не подтормаживают при сотнях реплеев.
- Одно действие в окне отправляет новое состояние один раз, а неизменившееся не отправляется вовсе.
- Страница HUD заново разбирает и перерисовывает только изменившиеся панели.

### en

- The settings window no longer resends the replay list with every change: the «Replays» page gets it separately, only while it is open, and afterwards only the replays that changed, so the window and the hangar no longer stutter with hundreds of replays.
- One action in the window sends the new state once, and an unchanged state is not sent at all.
- The HUD page parses and redraws only the panels that changed.

## ui 0.4.0

### ru

- В «Редакторе HUD» под схемой панелей — карточка «Раскладка по типу боя»: набор панелей для каждого типа боя.

### en

- The «HUD editor» page has the Layout per battle type card under the panel map: the panel set for each battle type.

## ui 0.3.0

### ru

- Новое окно настроек: разделы слева с иконками (Бой, Ангар, Отметки и статистика, Реплеи, Стримерам, Данные и сайт, Профили, Редактор HUD) и счётчиком включённых компонентов, карточки компонентов с иконкой, описанием, метками «Ангар» и «Бой» и раскрывающимися настройками, фильтр «Все / Ангар / Бой».
- Поиск по компонентам и настройкам: находит и название, и отдельную настройку, и вариант выбора.
- Изменения применяются сразу, всплывающая подсказка «Отменить» возвращает до 20 последних изменений; у каждой карточки «Сбросить к стандартным», изменённые настройки отмечены.
- Окно двигается за заголовок, меняет размер за край и угол, масштаб 80–150 %; положение, размер и масштаб запоминаются и подгоняются под экран при любом разрешении и масштабе интерфейса. В узком окне меню сворачивается до иконок, в широком карточки встают в две колонки.
- Колесо мыши больше не прокручивает списки в обратную сторону, содержимое не обрезается сверху.
- Иконки и кнопки «−», «+» и «×» больше не пропадают: все значки рисуются из одного PNG-спрайта, у поля кода привязки есть подсказка.
- Блок привязки в «Данных и сайте»: состояние, поле кода, «Привязать», «Получить код» и «Открыть сайт».
- Кнопка «///» в ангаре переехала в правый нижний ряд кнопок, рядом с уведомлениями, и получила иконку; если вы её не двигали, она переедет сама.
- Названия и описания у «Лога урона», «Хит-лога», «ХП команд», «Лампы шестого чувства» и «Часов» вместо служебных имён.
- Перетаскивание панелей с зажатым Alt и изменение размера колесом снова работают в бою: страница сама определяет панель под курсором, и значки, подложки и SVG внутри панели больше не перехватывают нажатие.
- Панели одной колонки встают друг под другом; ХП команд ровно по центру стандартной полосы счёта, тонкие полосы, счёт в тёмной плашке.
- Подписи ангара и небольшие боевые панели — тёмные карточки со значком в заголовке, крупными числами и приглушёнными подписями; значки нашего набора рисуются явными цветами.
- Цвет полоски слева у каждой плашки — по категории: оранжевый — ваш урон, красный — урон по вам, золотой — отметки, рекорды, цели и задачи, серый — справочные панели.
- Текст панелей рисуется только знаками, которые есть в шрифте клиента (Warhelios): минус — дефис, неразрывный пробел вместо узкого, ≈ → ~, стрелки и звёзды — значками; пустых квадратов больше нет.
- Вторичные боевые панели встают под полосой ХП команд и не заходят на лампу, список команды, чат, миникарту и панель расходников.

### en

- A new settings window: sections on the left with icons (Battle, Hangar, Marks and stats, Replays, Streamers, Data and site, Profiles, HUD editor) and a count of the components that are on, component cards with an icon, a description, «Hangar» and «Battle» badges and settings that fold out, and an All / Hangar / Battle filter.
- Search across components and settings: it finds a title, a single setting and a choice.
- Changes apply at once; an «Undo» toast takes back up to the last 20 changes; every card has «Reset to defaults», and changed settings are marked.
- The window moves by its title, resizes by its edge and corner, zooms from 80 to 150 %; its place, size and zoom are remembered and fitted to the screen at any resolution and interface scale. In a narrow window the menu folds to icons, in a wide one the cards sit in two columns.
- The mouse wheel no longer scrolls lists backwards, and nothing is cut off at the top.
- Icons and the «−», «+» and «×» buttons no longer go blank: every icon is drawn from one PNG sprite, and the binding code field shows its hint.
- A binding block in «Data and site»: the state, the code field, «Bind», «Get a code» and «Open the site».
- The «///» hangar button moved to the bottom-right button row next to the notifications and got its icon; it moves there by itself unless you moved it.
- Titles and descriptions for the damage log, hit log, team HP, sixth sense lamp and clock instead of internal names.
- Dragging panels with Alt held and resizing them with the wheel work in battle again: the page finds the panel under the pointer itself, and icons, plates and SVG inside a panel no longer swallow the press.
- The panels of a column sit one under another; team HP is centred on the stock score strip, with thin bars and the score in a dark box.
- Hangar labels and the smaller battle panels are dark cards with an icon in the header, numbers in bold and dimmed captions; our glyphs are drawn with explicit colours.
- The stripe on the left of every plate is coloured by category: orange for your damage, red for damage to you, gold for marks, records, goals and missions, grey for information.
- Panel text uses only characters the client font (Warhelios) has: a hyphen for the minus, a no-break space for the narrow one, ~ for ≈, arrows and stars as icons; no more blank boxes.
- The secondary battle panels sit under the team HP strip and keep off the lamp, the team lists, the chat, the minimap and the consumables bar.

## ui 0.2.0

### ru

- Боевой интерфейс рисуется панелями с иконками: подложка, шрифт Warhelios, иконки клиента и свои значки, круговые таймеры.
- Клики в бою проходят в игру: страница ограничивает область ввода кнопкой «///», весь экран — только в режиме перемещения (Alt).
- Страница подписывается на изменения модели так же, как клиент и OpenWG (`addDataChangedCallback`), и находит кнопку ангара среди вложенных вью через `subViews.ids()`.
- Окно настроек открывается с родителем — главным окном клиента; SVG без rem.
- «Расчёт отметок» в «Истории отметок»: танк, процент, шкала 0–100, карточки последнего и лучшего боя и динамики за 10 и 25 боёв, таблица боёв и график.

### en

- The battle HUD draws panels with icons: plates, the Warhelios font, client icons and our glyphs, radial timers.
- Clicks in battle reach the game: the page limits its input area to the «///» button, and to the whole screen only in move mode (Alt).
- The page subscribes to model changes the way the client and OpenWG do (`addDataChangedCallback`) and finds the hangar button among sub views through `subViews.ids()`.
- The settings window opens with the client's main window as its parent; no rem inside SVG.
- «MoE calculator» in the marks history: the tank, the percent, a 0-100 bar, cards for the last and best battle and the 10 and 25 battle trend, the battles table and a chart.

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

## marks_panel 0.4.0

### ru

- Урон для +1 %: сколько ещё нанести в этом бою, чтобы процент отметки дорос до следующего целого (в подробном и компактном виде, макросы `{up}` и `{need_up}`).
- Отметка «проверено» или «оценка»: проверено, когда процент на начало боя взят из досье танка (значение сервера), оценка, когда в досье его нет и он посчитан по порогам сайта; оценка помечена `~`, макрос `{source}`.
- Подробности по Alt (выключено по умолчанию): панель показывает короткую строку, а пока зажат Alt - всё: урон до отметок и на +1 %, среднее и нужное для следующей отметки, боёв до неё и отметку проверки.

### en

- Damage for +1%: how much more to deal in this battle for the MoE percent to reach the next whole percent (in the extended and compact styles, macros `{up}` and `{need_up}`).
- A «verified» or «estimated» badge: verified when the percent at the battle start is the tank's dossier value (the server's), estimated when the dossier has none and it comes from the site thresholds; an estimate is marked `~`, macro `{source}`.
- Details on Alt (off by default): the panel shows one short line and everything while Alt is held: damage to the marks and for +1%, the average and the one the next mark needs, battles to it and the verification badge.

## marks_panel 0.3.2

### ru

- Новое место по умолчанию: справа от левого списка команд в любом его режиме.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- New default place: right of the left team list in any of its modes.
- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## marks_panel 0.3.1

### ru

- Правильные формы слова «бой» в прогнозе.
- Позиция по умолчанию — слева вверху, правее списка команды: над чатом места нет.

### en

- Correct Russian word forms in the forecast.
- Default position: top left, right of the team list; there is no room over the chat.

## marks_panel 0.3.0

### ru

- Значок отметки, процент крупно, изменение со стрелкой, пороги 65/85/95 и прогноз боёв в одной плашке.

### en

- The marks icon, a big percent, the change with an arrow, the 65/85/95 thresholds and the battles forecast in one plate.

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

## hangar_marks 0.2.0

### ru

- Отметка в ангаре — карточка: значок отметки, процент крупно, среднее и темп, урон за бой до 65/85/95 % с галочкой у взятых порогов и прогноз «до 95 %: ~12 боёв». Строка «+0,5 %: -» убрана.
- Скрывается вне обычного вида ангара, как и подписи ангара; по умолчанию стоит первой в левой колонке.
- Правильные формы слов: «2 боя», «5 боёв».

### en

- Hangar marks is a card: the mark icon, the percent in big type, the average and the pace, the damage per battle to 65/85/95 % with a check at the reached ones, and the forecast «to 95 %: ~12 battles». The «+0.5 %: -» line is gone.
- It hides outside the plain hangar view like the hangar labels; by default it is the first of the left column.
- Correct word forms for the battle count.

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

## session_stats 0.4.0

### ru

- Кнопка «Новая сессия» в карточке компонента: счётчики обнуляются по вашему запросу, итоги боёв, сыгранных до этого, в новую сессию не попадают.
- Полоска последних 10 боёв сессии: победа, поражение, ничья цветом, в тексте без Gameface буквами В, П, Н.
- «Ждут итогов: N»: сколько ваших боёв уже сыграно, а итоги ещё не пришли.

### en

- A «New session» button in the component's card: the counters reset on your request, and the results of battles played before stay out of the new session.
- A strip of the session's last 10 battles: win, loss and draw in colour, and as the letters W, L, D in the text without Gameface.
- «Awaiting results: N»: how many of your battles are played and still wait for their results.

## session_stats 0.3.0

### ru

- Сессия в ангаре — карточка: число боёв с правильной формой слова, процент побед цветом, средний урон и WN8, победы и поражения строкой ниже.
- Подпись в ангаре видна только в самом ангаре: на экране очереди в бой, в других разделах, в окне настроек и в полноэкранных окнах клиента она скрыта.
- Перетащенная подпись запоминает место.

### en

- The session in the hangar is a card: the battle count, the win rate in colour, the average damage and WN8, wins and losses below.
- The hangar label shows only in the hangar itself: on the battle queue screen, in other lobby sections, in the settings window and in the client's full-screen windows it is hidden.
- A dragged label keeps its place.

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

## replay_upload 0.2.0

### ru

- Реплей можно загрузить вручную из менеджера реплеев, в том числе тот, который раньше не удалось отправить. Действуют те же условия: включённая «Загрузка реплеев» и привязка к сайту.
- Время начала боя из результатов переводится в часы компьютера так же, как это делает клиент, поэтому реплей без номера боя в заголовке находится точнее.

### en

- A replay can be uploaded by hand from the replay manager, including one an earlier try gave up on. The same conditions apply: Replay upload on and the mod bound to the site.
- The battle start from the results is turned into this computer's time the way the client does it, so a replay without a battle id in its header is found more reliably.

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

## damage_log 0.4.0

### ru

- «Подробности по Alt» (выключено по умолчанию): строки лога короткие — урон и значок, как короткий стиль стандартного лога; пока зажат Alt, они полные: вид урона, класс и танк, снаряд, источник. С Alt лог виден и там, где стиль или настройка его скрывают.
- Свой шаблон строки для Alt (`alt_entry_template`); в режиме правки панелей видна короткая версия.

### en

- «Details on Alt» (off by default): the log lines are short, the amount and its icon, like the stock log's short style; while Alt is held they are full: the kind, class and tank, shell and source. With Alt the log shows even where the style or the setting hides it.
- A custom line template for Alt (`alt_entry_template`); the HUD edit mode shows the short version.

## damage_log 0.3.2

### ru

- «Последнее попадание» стоит над логом урона, а не у прицела, где его закрывали ленты событий.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- «Last hit» sits above the damage log, not by the reticle where the ribbons covered it.
- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## damage_log 0.3.1

### ru

- Всплывающее последнее попадание по умолчанию стоит под прицелом, ниже перезарядки, и больше не перекрывает лампу.
- Итоги занимают меньше места и не заходят на стандартную панель расходников при масштабе интерфейса 125 %.

### en

- The last-hit pop-up sits under the reticle below the reload bar by default and no longer covers the lamp.
- The totals take less room and stay clear of the stock consumables bar at a 125 % interface scale.

## damage_log 0.3.0

### ru

- Итоги иконками и числами, строки с иконкой снаряда (золотой подчёркнут), класса и источника урона, боеукладка.
- Заменяет стандартный лог урона на его месте справа от панели повреждений (можно оставить стандартный); последнее попадание — карточка над прицелом.

### en

- Totals as icons and numbers, rows with the shell icon (gold underlined), the class and the damage source, the ammo rack.
- Replaces the stock damage log at its spot right of the damage panel (the stock one can be kept); the last hit is a card above the reticle.

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

## hit_log 0.3.0

### ru

- «Подробности по Alt» (выключено по умолчанию): строки короткие — исход, урон и танк; пока зажат Alt, они полные: класс, остаток прочности, снаряд и число критов.
- Свой шаблон строки для Alt (`alt_line_template`, макросы `{crits_text}` и `{hp_left}`); в режиме правки панелей видна короткая версия.

### en

- «Details on Alt» (off by default): the lines are short, the outcome, damage and tank; while Alt is held they are full: class, HP left, shell and the crit count.
- A custom line template for Alt (`alt_line_template`, macros `{crits_text}` and `{hp_left}`); the HUD edit mode shows the short version.

## hit_log 0.2.2

### ru

- Новое место по умолчанию: слева от правого списка команд, а не поверх него.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- New default place: left of the right team list, not over it.
- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## hit_log 0.2.1

### ru

- По умолчанию стоит справа вверху сразу под таймером боя, выше списка команды, и больше не заходит на миникарту.

### en

- By default it sits top right right under the battle timer, above the team list, and no longer runs into the minimap.

## hit_log 0.2.0

### ru

- Иконки исхода попадания, класс цели, полоска и ХП после вашего выстрела; панель над мини-картой.

### en

- Hit outcome icons, the target class, a bar and the HP left after your shot; the panel sits above the minimap.

## hit_log 0.1.0

### ru

- В бою: каждое собственное попадание по противнику (пробитие, крит, непробитие, рикошет и остальные) с уроном, снарядом, критами и HP цели после попадания — ровно как показывает маркер противника; по желанию с группировкой по цели.
- Цвет исхода по палитре (`{c_outcome}`: `classic`, `graphite`, `contrast`, `colorblind`); HP цели берётся только из собственного попадания.

### en

- In battle: each own hit on an enemy (penetration, critical, no penetration, ricochet and the rest) with damage, shell, crits and the target's HP after the hit, exactly as the enemy marker shows it; optionally grouped by target.
- Outcome colour by palette (`{c_outcome}`: `classic`, `graphite`, `contrast`, `colorblind`); the target's HP is taken only from the player's own hit.

## battle_clock 0.2.2

### ru

- Новое место по умолчанию: левее стандартного таймера боя во всю его ширину.
- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- New default place: left of the stock battle timer across its full width.
- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## battle_clock 0.2.1

### ru

- Таймер боя отбрасывает доли секунды, как стандартный таймер, и больше не опережает его на секунду.
- По умолчанию стоит слева от стандартного таймера.
- Выключен по умолчанию: стандартный набор боя — только ХП команд, лог урона, лог попаданий, отметка, расходники с перезарядкой и лампа. Включается в окне настроек.

### en

- The battle timer drops the fraction of a second like the stock timer and no longer runs a second ahead of it.
- By default it sits left of the stock timer.
- Off by default: the default battle set is team HP, the damage log, the hit log, marks, consumables with reload and the lamp only. Turn it on in the settings window.

## battle_clock 0.2.0

### ru

- Часы со значком под стандартным таймером; по выбору заменяют стандартный таймер боя.

### en

- The clock with an icon under the stock timer; optionally replaces the stock battle timer.

## battle_clock 0.1.0

### ru

- В бою: местное время, по желанию дата, и время до конца текущего этапа боя.

### en

- In battle: the local time, optionally the date, and the time left in the current arena period.

## team_hp 0.5.1

### ru

- «Только числа» и полоса, которая оставляет стандартную панель счёта, стоят справа от неё в верхнем ряду, а не под ней: полосы захвата баз и прогресс боевых задач больше ничем не закрыты.

### en

- «Numbers only» and a strip that keeps the stock score strip sit right of it in the top row, not under it, so nothing covers the base capture bars and the quest progress any more.

## team_hp 0.5.0

### ru

- ХП команд — те же числа, что у стандартной панели счёта: полоса слушает тот же контроллер клиента.
- Новая настройка «Живые вместо фрагов»: в счёте — сколько машин каждой команды ещё живо (по умолчанию выключена).
- Стили «Полоска на каждый танк» и «Сегменты по танкам» следуют настройкам игры для панели счёта: без значков техники значки классов скрыты, с группировкой по уровням машины идут от старшего уровня к центру, с метками уровней, как в стандартной панели.

### en

- The team HP are the same numbers the stock score strip shows: the strip listens to the same client controller.
- A new setting, «Alive instead of frags»: the score shows how many vehicles of each team are still alive (off by default).
- The «A bar per tank» and «A segment per tank» styles follow the game's score strip options: without vehicle icons the class icons are hidden, with tier grouping the vehicles run from the highest tier at the centre with tier labels, as on the stock strip.

## team_hp 0.4.0

### ru

- Полоса стоит ровно на месте стандартной панели счёта, у самого верхнего края экрана, и закреплена: её не сдвинуть случайно. Закрепление снимается в настройках.
- Сдвиг, сохранённый прошлыми версиями, сбрасывается.

### en

- The strip sits exactly in the stock score strip's place at the very top edge and is pinned, so it cannot be moved by accident. Unpin it in the settings.
- The offset saved by earlier versions is reset.

## team_hp 0.3.0

### ru

- Пять стилей как в популярных сборках: две полосы и счёт, сегменты по танкам, иконки классов с полоской, компактные числа, минимум.
- Заменяет стандартную панель счёта, пока её рисует Gameface; «Только числа» остаётся под стандартной.

### en

- Five styles like the popular packs: two bars and the score, a segment per tank, class icons with a bar, compact numbers, minimal.
- Replaces the stock score strip while Gameface draws it; «Numbers only» stays under the stock one.

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

## sixth_sense 0.3.0

### ru

- Круговой таймер отсчитывает время видимости вашей машины с учётом её оборудования: 10 с, 8,5 с с «Улучшенным радиооборудованием» и 8 с, если оно стоит в слоте специализации. Значение клиент считает сам для вашей машины.
- Необязательное тиканье каждую секунду отсчёта (по умолчанию выключено), свой звук (CC0).
- Лампа гаснет, когда бой закончился, при смене машины и возрождении, а также когда ваша машина уничтожена.

### en

- The radial timer counts down your vehicle's visibility time with its equipment taken into account: 10 s, 8.5 s with Improved Radio Equipment and 8 s in its specialisation slot. The client computes the value for your vehicle itself.
- An optional tick every second of the countdown (off by default), our own sound (CC0).
- The lamp goes out when the battle ends, when the vehicle switches or respawns, and when your vehicle is destroyed.

## sixth_sense 0.2.1

### ru

- Панель, которую вы не двигали, переезжает с места по умолчанию прошлых версий на новое: оно больше не наезжает на списки команд, чат и миникарту на любом разрешении и масштабе интерфейса.

### en

- A panel you never moved leaves the default place of earlier versions for the new one, which no longer covers the team lists, the chat or the minimap at any resolution and interface scale.

## sixth_sense 0.2.0

### ru

- Лампа с круговым таймером и пульсом на месте стандартной и заменяет её, пока её рисует Gameface.

### en

- A lamp with a radial timer and a pulse at the stock lamp's spot, replacing it while Gameface draws it.

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

## replay_manager 0.3.2

### ru

- Список реплеев собирается заново только для изменившихся реплеев и обновляется во время чтения заголовков не чаще раза в 3 секунды, без перерисовки всего окна.

### en

- The replay list is rebuilt only for the replays that changed and refreshes at most every 3 seconds while headers are read, without redrawing the whole window.

## replay_manager 0.3.1

### ru

- Закрытие игры во время просмотра реплея, запущенного из ангара, снова закрывает клиент, а не перезапускает его.
- Автоматическое имя реплея теперь даётся и при закрытом окне настроек: мод сам дочитывает заголовок только что записанного реплея.

### en

- Closing the game while a replay started from the hangar is playing quits the client again instead of restarting it.
- Automatic replay names are given with the settings window closed too: the mod reads the header of the replay just written itself.

## replay_manager 0.3.0

### ru

- Отдельный экран «Реплеи» в окне настроек: все ваши реплеи из папки игры с картинкой карты, техникой, уровнем, режимом, итогом, уроном, помощью, фрагами, опытом, серебром и знаком классности; список прокручивается плавно даже на тысяче файлов.
- Поиск по карте, танку и имени файла; фильтры по итогу, карте, технике, уровню, типу боя, дате и избранному; сортировка по дате, урону, помощи, опыту, фрагам и размеру; сводка по выборке (боёв, процент побед, средний урон и опыт).
- «Смотреть»: реплей запускается прямо из ангара — клиент перезапускается, показывает бой и после «Закончить» возвращается к входу в игру. Реплеи другой версии клиента помечены, и запускать их нельзя.
- «Загрузить на сайт» для любого своего реплея (нужны включённая «Загрузка реплеев» и привязка), избранное, переименование и удаление с подтверждением, открытие папки.
- Заголовки реплеев читаются один раз и хранятся на диске, поэтому экран открывается сразу; новые файлы дочитываются понемногу, не замедляя ангар.
- Настройки поиска и фильтров из карточки компонента убраны: они теперь на экране.

### en

- A separate Replays screen in the settings window: all your replays in the game folder with the map picture, vehicle, tier, mode, result, damage, assist, frags, XP, credits and mastery badge; the list scrolls smoothly even with a thousand files.
- Search by map, tank and file name; filters by result, map, vehicle, tier, battle type, date and favourites; sorting by date, damage, assist, XP, frags and size; a summary of the selection (battles, win rate, average damage and XP).
- Watch: a replay starts right from the hangar. The client restarts, shows the battle and after Finish returns to the login screen. Replays of another client version are marked and cannot be started.
- Upload to the site for any of your replays (needs Replay upload on and the mod bound), favourites, rename and delete with a confirmation, open the folder.
- Replay headers are read once and kept on disk, so the screen opens at once; new files are read a little at a time without slowing the hangar.
- The search and filter settings left the component card: they are on the screen now.

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

## marks_history 0.3.0

### ru

- Подпись в ангаре — карточка: процент крупно, прошлый бой и тренд со стрелками вверх и вниз.
- Подпись в ангаре видна только в самом ангаре: на экране очереди в бой, в других разделах, в окне настроек и в полноэкранных окнах клиента она скрыта.
- Исправлено «За 2 боёв»: теперь «За 2 боя».

### en

- The hangar label is a card: the percent in big type, the last battle and the trend with up and down arrows.
- The hangar label shows only in the hangar itself: on the battle queue screen, in other lobby sections, in the settings window and in the client's full-screen windows it is hidden.
- Fixed «2 battles» word forms in Russian.

## marks_history 0.2.0

### ru

- «Расчёт отметок» по каждому танку: флаг, уровень, класс, процент, шкала 0–100, последний и лучший бой, динамика за 10 и 25 боёв, таблица боёв с Σ уроном и ±% и график процента.

### en

- «MoE calculator» per tank: flag, tier, class, percent, a 0-100 bar, the last and best battle, the 10 and 25 battle trend, a battles table with Σ damage and ±% and a chart of the percent.

## marks_history 0.1.0

### ru

- Процент отметки, отметки и скользящий средний урон после каждого собственного боя по каждой технике с датой получения каждой отметки: подпись в ангаре для выбранного танка и список в окне мода.

### en

- The MoE percent, marks and moving-average damage after each own battle per vehicle, with the date each mark was reached: a hangar label for the selected tank and a list in the mod window.

## hangar_ratings 0.2.0

### ru

- «Мои рейтинги» — карточка: рейтинги аккаунта цветами шкалы, строки сессии и выбранного танка с WN8 справа и остальным приглушённо.
- Подпись в ангаре видна только в самом ангаре: на экране очереди в бой, в других разделах, в окне настроек и в полноэкранных окнах клиента она скрыта.
- Место, куда вы перетащили подпись, по-прежнему запоминается; правильные формы слова «бой».

### en

- My ratings is a card: the account ratings in the rating scale colours, the session and selected tank rows with WN8 on the right and the rest dimmed.
- The hangar label shows only in the hangar itself: on the battle queue screen, in other lobby sections, in the settings window and in the client's full-screen windows it is hidden.
- Where you dragged the label is still remembered; correct word forms for the battle count.

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
