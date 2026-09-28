use serde_json::json;

use super::Catalog;

pub const MODPACK_VERSION: &str = "0.1.0";

fn component(id: &str, package_id: &str, category: &str, required: bool, dependencies: &[&str]) -> serde_json::Value {
    json!({
        "id": id,
        "packageId": package_id,
        "version": MODPACK_VERSION,
        "file": format!("{package_id}_{MODPACK_VERSION}.mtmod"),
        "category": category,
        "title": { "ru": format!("Компонент {id}"), "en": format!("Component {id}") },
        "description": { "ru": "Описание", "en": "Description" },
        "fairPlay": { "ru": "Только свои данные.", "en": "Only your own data." },
        "required": required,
        "default": true,
        "presets": ["recommended"],
        "preview": { "image": format!("previews/{id}.png"), "video": null },
        "dependencies": dependencies,
        "catalogued": true,
        "sha256": null,
        "size": null
    })
}

pub const GAMEFACE_SHA256: &str = "2bb65f28663e3ab34b5a1102a1bbd1f6e17a65e1f6a898a8645c4ab732b50184";
pub const GUIFLASH_SHA256: &str = "a0b6dc2e75663008a4ced9e0c00449be84b3c3d5d932f8bbcaa2b334ae3d1cb5";

pub fn gameface_json() -> serde_json::Value {
    json!({
        "id": "openwg_gameface",
        "kind": "dependency",
        "packageId": "net.openwg.gameface",
        "version": "1.2.2",
        "file": "net.openwg.gameface_1.2.2.mtmod",
        "title": { "ru": "OpenWG Gameface", "en": "OpenWG Gameface" },
        "description": { "ru": "Окно модпака и HUD на Gameface", "en": "The modpack window and the Gameface HUD" },
        "author": { "name": "OpenWG", "url": "https://gitlab.com/openwg/wot.gameface" },
        "licence": {
            "name": "MIT",
            "url": "https://gitlab.com/openwg/wot.gameface/-/raw/v1.2.2/LICENSE",
            "sha256": "ae7fdf07fd99a0c2c616ace3d07b50d7063a33a3bc6a9173098aa75bc93833a9"
        },
        "sourceUrl": "https://gitlab.com/-/project/68695173/uploads/43577d5bab856523c1b7a6dcada27f23/net.openwg.gameface_1.2.2.mtmod",
        "sha256": GAMEFACE_SHA256,
        "size": 48445,
        "requiredBy": ["marks_panel", "damage_log"],
        "restartRequired": true
    })
}

pub fn guiflash_json() -> serde_json::Value {
    json!({
        "id": "guiflash",
        "kind": "dependency",
        "packageId": "gambiter.guiflash",
        "version": "0.6.6",
        "file": "gambiter.guiflash_0.6.6.mtmod",
        "title": { "ru": "GUIFlash", "en": "GUIFlash" },
        "description": { "ru": "Запасной HUD", "en": "The fallback HUD" },
        "author": { "name": "CH4MPi", "url": "https://github.com/CH4MPi/GUIFlash" },
        "licence": {
            "name": "MIT",
            "url": "https://raw.githubusercontent.com/CH4MPi/GUIFlash/v0.6.6/LICENSE",
            "sha256": "516fddc54dc15c2589d40017fc985adc59565ff7fbe8e7bc16851205126dd7fc"
        },
        "sourceUrl": "https://github.com/CH4MPi/GUIFlash/releases/download/v0.6.6/gambiter.guiflash_0.6.6.mtmod",
        "sha256": GUIFLASH_SHA256,
        "size": 62862,
        "requiredBy": ["damage_log"],
        "restartRequired": false
    })
}

pub fn catalog_json() -> serde_json::Value {
    json!({
        "schemaVersion": 1,
        "modpackVersion": MODPACK_VERSION,
        "platform": "lesta",
        "extension": "mtmod",
        "categories": [
            { "id": "base", "title": { "ru": "Основа", "en": "Core" }, "description": { "ru": "", "en": "" } },
            { "id": "battle", "title": { "ru": "В бою", "en": "In battle" }, "description": { "ru": "", "en": "" } }
        ],
        "presets": [
            { "id": "recommended", "title": { "ru": "Рекомендуемый", "en": "Recommended" }, "description": { "ru": "", "en": "" }, "custom": false },
            { "id": "custom", "title": { "ru": "Свой", "en": "Custom" }, "description": { "ru": "", "en": "" }, "custom": true }
        ],
        "components": [
            component("core", "net.triotmetki.core", "base", true, &[]),
            component("companion", "otmetki.companion", "base", true, &["core"]),
            component("marks_panel", "net.triotmetki.marks_panel", "battle", false, &["core", "companion"]),
            component("damage_log", "net.triotmetki.damage_log", "battle", false, &["core", "companion"]),
            component("hit_log", "net.triotmetki.hit_log", "battle", false, &["damage_log"]),
            gameface_json(),
            guiflash_json()
        ],
        "ownedPatterns": ["net.triotmetki.*.mtmod", "otmetki.*.mtmod"]
    })
}

pub fn catalog() -> Catalog {
    serde_json::from_value(catalog_json()).unwrap()
}
