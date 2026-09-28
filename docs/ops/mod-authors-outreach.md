# Asking mod authors for permission

The modpack's look (crosshairs, sixth-sense lamp, damage panels) should feel as familiar as the popular packs. We ship
only what we may ship. That is our own artwork, or third-party assets under a licence that allows redistribution in a
paid product ([apps/game/modpack/assets](../../apps/game/modpack/assets/README.md)). Everything in the popular packs is
**closed**: no licence, so all rights are reserved. It goes into the modpack only with the author's written permission.
This page lists whom to ask, for what, and how.

Researched on 2026-09-28. Contacts come from the authors' own sites and channels and change often, so recheck them
before writing. Links are at the end.

## Rules for every request

- **Ask the author of the component, not the packager.** A pack bundles other people's mods. Jove's crosshairs and
  ПРОТанки's XVM configs, for example, often come from third-party authors. The pack's own changelog or the mod's
  readme names the author. If the author is unknown, we do not ship the component.
- **Written permission only**, in a channel we can archive (Telegram, VK, e-mail or a forum private message; a
  screenshot is fine). It must name the files, allow the free and the subscription editions, and allow changes
  (resizing, format conversion). Save it under `docs/ops/permissions/<author>-<component>.md` together with the date,
  the channel and the exact scope.
- **What we offer:** credit in the mod window and on the component's card («Автор: …» with a link), a line in
  `THIRD_PARTY_NOTICES.md`, a link on the site's modpack page, and removal within 7 days of the author's request.
  Revenue share is optional: for example 10–20 % of the subscription revenue attributed to the component, pro rata
  by installs, paid quarterly. Offer it only once billing can measure installs; until then offer credit and a link.
- **Fair play still applies.** We ask only for visual components (crosshair art, lamp icons and sounds, panel skins).
  Never for calculators, "smart" reticles, lead or penetration helpers, armour skins or enemy data. Those stay out even
  with permission ([.claude/rules/modpack/fair-play.md](../../.claude/rules/modpack/fair-play.md)).
- **Do not ask for what we have already made.** Our own centre marks, lamp icons, chime and damage-log glyphs ship
  today. A borrowed component has to add something the players ask for by name, such as «прицел Джова».

## Whom to ask

| Author / pack | Components we would like | Licence today | Contact | Notes |
| --- | --- | --- | --- | --- |
| **Jove (Джов)** — «Моды от Джова» | Crosshair styles (the «Тайпан», «Дамоклов меч» families), sixth-sense lamp icons and sounds | None published; all rights reserved | Site [joves-modpack.ru](https://joves-modpack.ru/); support on VK [vk.com/phantasm](https://vk.com/phantasm) (the site's contact for pack questions); Telegram [t.me/The_Joves](https://t.me/The_Joves); [Boosty](https://boosty.to/jove) | Jove sells an extended pack by subscription himself, so he is a direct competitor: expect a refusal or a fee. Many of his crosshairs are other authors' work (see the pack's list of mods). |
| **Near_You** — NearYouTeam modpack | In-game reticle presets (their idea, not their art), sixth-sense lamp and sound | None published | Site [nearyou.team](https://nearyou.team/modpack); Telegram [t.me/neartv](https://t.me/s/neartv) | The in-game preset idea is already ours (crosshair presets). Ask only for specific art. |
| **Kotyarko_O** — Kotyarko_O's ModPack | Damage panel and hit-log configurations, sixth-sense icon | None published | The legacy WoT forum topic (forum.worldoftanks.ru, «Kotyarko_O`s ModPack»), private message there; no current channel found | The pack was last updated for WoT 1.9 (2020). The author may be inactive. Most of its content is XVM configs (GPL-3.0, see below). |
| **Юша ПРОТанки** — «Модпак ПРОТанки» | Crosshairs from the base pack, sixth-sense sounds (voiced) | None published | Telegram [t.me/protanki_yusha](https://t.me/s/protanki_yusha); [Boosty](https://boosty.to/yusha_protanki); [wgmods.net/89](https://wgmods.net/89/) | Voiced lamp sounds may contain the streamer's voice, so they need his permission as a performer too. The pack includes an armour calculator, which is never in scope. |
| **XVM team** — XVM and XVM-based skins | Contour icons, sixth-sense icon, hit-log look | **GPL-3.0** ([gitlab.com/xvm/xvm](https://gitlab.com/xvm/xvm)) | Forum [koreanrandom.com/forum/forum/96](https://koreanrandom.com/forum/forum/96-xvm-extended-visualization-mod/) | GPL is not on our allowed list: it would pull the pack's code under GPL. Players can install XVM beside our pack. Skins built on XVM belong to their skin authors, so ask each one separately. |
| **Kenney** | — (already shipped: Crosshair Pack, CC0) | CC0-1.0 | [kenney.nl](https://kenney.nl) | No permission needed. Crediting is voluntary, and we do it anyway (component card, notices). |

## Message template (ru)

> **Тема:** Разрешение на использование «{компонент}» в модпаке «Три отметки»
>
> Здравствуйте, {имя}!
>
> Меня зовут {имя отправителя}, я делаю модпак «Три отметки» для «Мира танков» (triotmetki.ru). Это набор визуальных
> модов в рамках правил честной игры, с сайтом статистики и отметок. Модпак бесплатный. У сайта есть платная подписка
> в духе Dota Plus, и модпак входит и в бесплатную, и в подписочную версию.
>
> Игрокам очень нравится ваш {компонент: например, «прицел „Тайпан“» / «значок и звук шестого чувства»}. Мы хотели бы
> включить его в модпак **с вашего письменного разрешения**. Что именно:
>
> - файлы: {список файлов или ссылка на версию};
> - изменения: только технические (размер, формат, путь в клиенте), без изменения самого рисунка или звука;
> - где: бесплатная и подписочная версии модпака, установщик и МОСТ.
>
> Что мы предлагаем:
>
> - указание авторства в окне мода и на карточке компонента («Автор: {имя}» со ссылкой на ваш канал), в списке
>   лицензий и на странице модпака на сайте;
> - {по желанию: долю дохода от подписки — {N} % пропорционально установкам компонента, выплата раз в квартал};
> - удаление компонента в течение 7 дней по вашей просьбе, без вопросов.
>
> Если вы согласны, ответьте, пожалуйста, на это сообщение: «Разрешаю использовать {компонент} в модпаке „Три отметки“
> (бесплатная и подписочная версии) с указанием авторства». Если компонент сделан не вами, подскажите, пожалуйста, к кому
> обратиться.
>
> Спасибо за ваши моды!
>
> {подпись, ссылка на triotmetki.ru, контакт для ответа}

## After a yes

1. Save the permission (`docs/ops/permissions/<author>-<component>.md`: date, channel, text or screenshot, scope).
2. Vendor the files under `apps/game/modpack/assets/third_party/<set>/`: the untouched originals in `src/` and a
   `LICENSE.md` that quotes the permission.
3. Add the set to `assets/assets.json` with `"license": "LicenseRef-Permission-<author>"` and `"license_file"`
   pointing at that `LICENSE.md`. `asset_sets.py` accepts the `LicenseRef-Permission-` prefix only for third-party
   sets, and its test checks that the licence file exists.
4. `python tools/build/asset_sets.py --write` (the notices), then wire the component in its feature with the author's
   name on the option label.

## Sources

- Jove: [joves-modpack.ru](https://joves-modpack.ru/), [t.me/The_Joves](https://t.me/s/The_Joves/3147), [boosty.to/jove](https://boosty.to/jove), [wotspeak.org: Моды от Джова](https://wotspeak.org/modpacks/6-mody-ot-dzhova-modpak-ot-jove.html)
- Near_You: [nearyou.team/modpack](https://nearyou.team/modpack), [t.me/s/neartv](https://t.me/s/neartv)
- Kotyarko_O: [wotspeak.org: сборка Kotyarko_O](https://wotspeak.org/sborki-i-mod-paki-world-of-tanks-wot/242-sborka-modov-ot-kotyarko-kotyarko_os-modpack-dlya-world-of-tanks.html), [wotsite.net: Kotyarko_O 1.9.0.2](https://wotsite.net/gotovye-sborki-modov/12465-sborka-modov-ot-kotyarko-o-dlya-world-of-tanks.html)
- ПРОТанки: [boosty.to/yusha_protanki](https://boosty.to/yusha_protanki), [t.me/s/protanki_yusha](https://t.me/s/protanki_yusha), [wgmods.net/89](https://wgmods.net/89/)
- XVM: [modxvm.com](https://modxvm.com/en/), [github.com/modxvm/XVM](https://github.com/modxvm/XVM) (GPL-3.0), [Korean Random forum](https://koreanrandom.com/forum/forum/96-xvm-extended-visualization-mod/)
- Kenney: [kenney.nl/assets/crosshair-pack](https://kenney.nl/assets/crosshair-pack) (CC0)
