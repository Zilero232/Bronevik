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
            component("hit_log", "net.triotmetki.hit_log", "battle", false, &["damage_log"])
        ],
        "ownedPatterns": ["net.triotmetki.*.mtmod", "otmetki.*.mtmod"]
    })
}

pub fn catalog() -> Catalog {
    serde_json::from_value(catalog_json()).unwrap()
}
