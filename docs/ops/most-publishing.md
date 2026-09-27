# Publishing the modpack in МОСТ

МОСТ is Lesta's official mod installer for «Мир танков». It finds the client, installs the mods a player ticks, downloads them from Lesta's server and updates them on every start, including the move to a new client version. This page covers what МОСТ asks of an author, what the repo prepares (`bun run most:bundle`), and what only the account owner can do.

Researched on 2026-09-27. Lesta publishes **no author portal, upload API or package spec** for МОСТ. `mods.lesta.ru` answers 403 to anonymous requests, and no search result or forum post describes a self-service upload. Everything below comes from the МОСТ curators' forum posts, the forum section's publication rules and the client's package format. Sources are listed at the end, and every claim links to one. Recheck them before the first proposal.

## What МОСТ does and does not do for us

| Question                                   | Answer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Source   |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| How does a mod get in?                     | The author **proposes it in the МОСТ forum topic** and the curators review it. MedvedevTD (17.06.2025): «Предлагайте в этой теме, мы рассмотрим». There is no form or upload page.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | [2]      |
| What is the proposal?                      | Any page where the curators can read about the mod. MedvedevTD (18.06.2025): «Подойдёт любой источник, в котором можно ознакомится с вашим предложением». The usual source is a publication in the forum section «Модификации клиента». The wotstat mod docs: МОСТ considers mods published in that section.                                                                                                                                                                                                                                                                                                                                                     | [3], [9] |
| Criteria                                   | «мод не нарушает правила игры, мод адаптирован под текущую версию игры и автор его периодически и своевременно поддерживает» (MedvedevTD, 17.06.2025). Translations are not the main problem; «чаще проблемы возникают с качеством и постоянством» (18.06.2025).                                                                                                                                                                                                                                                                                                                                                                                                  | [2], [3] |
| Review                                     | Every mod in МОСТ is «проверены, одобрены и не содержат вирусов или вредоносного кода» and complies with the fair-play policy.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | [1], [4] |
| Who updates after a client patch?          | **Delivery** is МОСТ's: files come from Lesta's server, МОСТ checks for updates on every start, and the move to a new client version needs no action from the player. **Compatibility** stays ours: «автор его периодически и своевременно поддерживает» is an inclusion criterion. The section rules archive a publication that is not updated **within 7 days** of a client update. Nothing published says МОСТ re-targets a mod to a new version on its own. Ask the curators (open questions below). So Lesta does not take over the updates: after every patch we still ship a working build, and МОСТ then delivers it to every player. | [1], [4], [5] |
| Package format                             | `.mtmod` since client 1.35 (a zip with `meta.xml` at its root, loaded from `mods/<client version>/`). A curator reply (18.06.2025) notes that `.wotmod` mods must be converted to `.mtmod`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | [7], [3] |
| Languages                                  | The МОСТ interface is Russian and Belarusian. The mod page needs Russian. We also keep English for our own site.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | [1]      |
| Previews                                   | Each mod has an image and a video example in МОСТ. No sizes are published. We render 16:9 PNGs at 1280×720 and 640×360. The forum publication allows at most 3 screenshots.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | [1], [5] |
| Dependencies between mods                  | Not documented. МОСТ lists mods one by one. Whether one МОСТ entry can require another (our core ← companion ← features, and third-party GUIFlash / ModsSettingsAPI / OpenWG Gameface) is unknown.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | —        |
| What МОСТ removes                          | **Installing through МОСТ empties `mods/<client version>/` and `res_mods/<client version>/`.** Mods from other sources are deleted. МОСТ can also delete `mods/configs` (the curators recommend it against config conflicts). That folder holds our binding (`mods/configs/otmetki/credentials.json`), `config.json`, `components.json` and `profiles.json`.                                                                                                                                                                                                                                                                                                     | [1]      |
| Paid content                               | The section forbids paid downloads. Our packages are free. Mod features that only work with Три отметки Плюс (the planned hangar add-ons) must be raised with the curators before they ship.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | [5]      |
| Author status                              | The forum group «Мододел» comes after at least three client versions of timely support without violations. The author asks MedvedevTD by private message. The status is lost after two unsupported versions in a row. It is not required for МОСТ, but it signals the «постоянство» the curators look for.                                                                                                                                                                                                                                                                                                                                                       | [6]      |
| Support channel                            | МОСТ problems go through the forum topic, not the support centre (ЦПП).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | [4]      |

### Forbidden categories (hard fail at review)

The section's list [8] and Lesta's support article [10] cover the following. Penalties for players who use such mods: a 7-day ban, then a 30-day ban, then a permanent ban.

- Enemy positions shown otherwise than the client shows them, or beyond the draw distance.
- Enemy aim point or shell trajectory.
- Enemy reload timers.
- "Smart" sights beyond the stock target lock.
- Changing the transparency of map objects.
- Markers where an enemy was spotted.
- Gun directions on the minimap.
- The direction to the nearest enemies out of view.
- Any change to vehicle or game-object parameters.

Our fair-play rules ([apps/game/modpack/CLAUDE.md](../../apps/game/modpack/CLAUDE.md), README «Left out of the component catalogue») already exclude all of these. The components a reviewer will look at hardest:

- `sixth_sense`: a text next to the vanilla lamp, with no timer for the enemy;
- `minimap`, `camera`, `crosshair`: only the game's own options;
- `chat_filter`, `battle_sounds`;
- `replay_upload`: network uploads.

## What the repo prepares: `most:bundle`

```bash
cd apps/game/modpack
python tools/build/build.py --require-pyc                 # release packages -> dist/*.mtmod (needs a bytecode compiler)
bun run most:bundle --game-version 1.45.0.0               # = uv run python tools/most --packages dist --release ...
```

It writes `apps/game/modpack/dist/most/`:

| Path                                   | What                                                                                                                  |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `index.json`                           | Every component: version, client version, findings (errors and warnings), each with the URL of the rule behind it    |
| `<id>/<package id>_<v>.mtmod`          | The release package, unchanged                                                                                        |
| `<id>/meta.xml`                        | Its `meta.xml`, extracted for review                                                                                  |
| `<id>/previews/preview-1280x720.png`   | Rendered from the catalog SVG (`installer/assets/previews/`) with setupkit's resvg renderer; 640×360 too             |
| `<id>/screenshots/*`                   | Real client screenshots, copied from `installer/assets/screenshots/<id>/` (at most 3)                                |
| `<id>/description.ru.md`, `.en.md`     | Page text: title in the forum format `[1.45.0.0] Три отметки — …`, description, fair play, data sent, dependencies, install, changes |
| `<id>/changelog.md`                    | This version's entry from `apps/game/modpack/CHANGELOG.md` (`## <id> <version>` or a modpack-wide `## <version>`)    |
| `<id>/submission.json`                 | Forum titles, dependency list with package ids and versions, sha256, size, preview and video links, findings           |

The texts come from `installer/catalog/catalog.json`, so the installer, the site and МОСТ describe a component in the same words.

Errors (exit code 1) are:

- a client version that is not `X.Y.Z.W`;
- a package that is not a zip with `meta.xml`;
- a `meta.xml` id, version or dependency list that differs from the layout;
- a wrong file name;
- `.py` sources in a `--release` bundle;
- a missing ru text;
- more than 3 screenshots;
- a non-https video.

Warnings are:

- no changelog entry;
- no screenshots;
- no video;
- previews copied as SVG without resvg-py and Pillow;
- a compressed zip;
- a dependency left out by `--only`.

`--strict` fails on warnings too. The tool's reference is in [apps/game/modpack/README.md](../../apps/game/modpack/README.md) «Publishing via МОСТ».

## Checklist

### A. Before the first proposal (repo; an agent can do these)

- [ ] Release build with bytecode: `python tools/build/build.py --require-pyc`, or the `release-build` job in `.github/workflows/modpack.yml`.
- [ ] Live-client smoke on the exact client version (README «Live-client smoke checklist»).
- [ ] `apps/game/modpack/CHANGELOG.md` with an entry for every version being published.
- [ ] Preview videos: add `preview.video` (https) to each catalog entry once they are recorded.
- [ ] `bun run most:bundle --game-version <client version>` with 0 errors, and review `dist/most/index.json`.
- [ ] Decide the shape of the submission (see open questions): one МОСТ entry per component (the bundle as is), or one entry with the whole modpack (`build.py --single`, then bundle the companion only).
- [ ] The site's download page links to the МОСТ entry once it is live (docs/ops/deploy.md, «Publish the package»).

### B. Only the account owner can do these

- [ ] **Forum account** on [forum.tanki.su](https://forum.tanki.su) (Lesta ID), in good standing. Curators judge the author as well as the mod.
- [ ] **Screenshots and video** from the live client: up to 3 per component, into `installer/assets/screenshots/<id>/`. Upload the video (VK Video / RuTube / YouTube) and send us the https link.
- [ ] **File hosting**: upload the `.mtmod` files to a direct-download host allowed by the rules (Яндекс.Диск, Google Drive, Mega). Paid or ad-gated hosts are forbidden.
- [ ] **Forum publication** in «Модификации клиента» → a fitting subsection (likely «Игровой интерфейс» or «Другие модификации»). Follow the publication rules [5]:
  - title `[<client version>] Три отметки — …` (`forumTitle` in `submission.json`);
  - the description (`description.ru.md`);
  - direct download links;
  - install instructions;
  - at most 3 screenshots in a spoiler.

  Publications are moderated on business days.
- [ ] **Proposal in the МОСТ topic** [1]: link the publication and the site. State the data the mod sends (HTTPS to `api.triotmetki.ru`, only after binding, every upload switchable) and the fair-play statement. Offer the source code for review (the GitHub repo is private: decide whether to grant the curators access or attach a source archive).
- [ ] **Answer the curators** in the topic or by private message (MedvedevTD, MatroseFuchs), including the open questions below.
- [ ] **After every client patch, within 7 days:**
  - rebuild;
  - run the smoke test;
  - `most:bundle` with the new client version;
  - update the publication title and links;
  - tell the МОСТ curators that the new build is up.
- [ ] Optional: after three client versions of timely updates, ask MedvedevTD for the «Мододел» status [6].

### Open questions for the МОСТ curators

1. Do you take the modpack as one entry, or one entry per component with dependencies? Can an entry require another entry, or a third-party mod (GUIFlash, ModsSettingsAPI + ModsList, OpenWG Gameface), and are those in МОСТ already?
2. After a client patch, do you move an unchanged package to the new `mods/<version>/` yourselves, or must the author always send a new build?
3. How do we hand over files: a forum link you re-host, or another channel? Do you need `meta.xml` fields beyond `id`, `version`, `name`, `description`, `dependencies`?
4. Image and video specs for the МОСТ card (sizes, count, video host), and whether you need a Belarusian description.
5. Mod features that need a Три отметки Плюс subscription on the site: allowed or not?
6. Network access: is HTTPS to our API (after an explicit binding code) acceptable, and do you need the source code?
7. Configs: МОСТ's config clean-up deletes `mods/configs/otmetki` (the binding). Can a mod's config folder be exempted, or should the mod store its binding elsewhere?

## Conflicts with our own installer

МОСТ empties `mods/<version>/` and `res_mods/<version>/` on every install [1]. A player who uses МОСТ for anything loses packages installed by `otmetki-setup-<version>.exe`, and our installer's clean-up only knows our own `ownedPatterns`. Until the curators answer:

- the site's install page recommends **one channel per player**: МОСТ, or our installer;
- the installer README warns that МОСТ removes mods it did not install;
- the mod's binding survives only while `mods/configs/otmetki/` survives. With МОСТ's config clean-up on, the player binds again (the site's device list shows the old device, which can be revoked).

## Sources

1. [ALL] МОСТ, the curators' topic (MedvedevTD, 16.06.2025; installer 1.2.1.2): features, ru/be interface, what it deletes, config clean-up. <https://forum.tanki.su/topic/2205036-all-%D0%BC%D0%BE%D1%81%D1%82/>
2. Same topic, page 7: proposals and criteria (MedvedevTD, 17.06.2025). <https://forum.tanki.su/topic/2205036-all-%D0%BC%D0%BE%D1%81%D1%82/page/7/>
3. Same topic, page 9: "any source", quality and consistency, `.wotmod` → `.mtmod` (18.06.2025); МОСТ self-update (MatroseFuchs, 29.07.2025). <https://forum.tanki.su/topic/2205036-all-%D0%BC%D0%BE%D1%81%D1%82/page/9/>
4. «МОСТ — простой и безопасный способ установки модов», tanki.su news: verified server, auto-updates, version transition, support through the forum. <https://tanki.su/ru/news/notifications/most-mt/>. Launch out of testing on 30.10.2025: <https://wotexpress.info/news/mir-tankov/general/most---avtomaticheskaya-ustanovka-modov-ot-razrabotchikov-mira-tankov/>
5. «Правила публикации модификаций» (MedvedevTD, 27.02.2025): title format, content, hosting, 3 screenshots, no paid downloads, 7-day update rule, moderation on business days. <https://forum.tanki.su/topic/2200656-правила-публикации-модификаций/>
6. «Правила включения в группу "Мододел"» (27.02.2025). <https://forum.tanki.su/topic/2200657-правила-включения-в-группу-мododел/>
7. «.mtmod» (MedvedevTD, 09.06.2025): the format from 1.35. <https://forum.tanki.su/topic/2204726-mtmod/>
8. «Категории запрещенных модификаций игрового клиента» (27.02.2025). <https://forum.tanki.su/topic/2200660-категории-запрещенных-модификаций-игрового-кл/>
9. wotstat mod docs: modpacks (МОСТ takes mods from the forum section; quality, current version, regular updates) and packaging (`meta.xml`, `<author>.<mod>_<version>.mtmod`, `mods/<game version>/`). <https://docs.wotstat.info/guide/distribution/modpacks/>, <https://docs.wotstat.info/guide/first-steps/environment/python/>
10. Lesta support, «Запрещённые модификации клиента игры» (list and penalties). <https://lesta.ru/support/ru/products/mt/article/15152/>
