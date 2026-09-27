use crate::patch::PatchStatus;
use crate::settings::Locale;

pub struct TrayTexts {
    pub tooltip: &'static str,
    pub open: &'static str,
    pub check: &'static str,
    pub quit: &'static str,
}

pub struct Notice {
    pub title: String,
    pub body: String,
}

pub const APP_TITLE: [&str; 2] = ["Три отметки", "Three Marks"];

pub fn tray(locale: Locale) -> TrayTexts {
    match locale {
        Locale::Ru => TrayTexts {
            tooltip: "Три отметки — менеджер модпака", open: "Открыть", check: "Проверить обновления", quit: "Выход"
        },
        Locale::En => TrayTexts { tooltip: "Three Marks — modpack manager", open: "Open", check: "Check for updates", quit: "Quit" },
    }
}

pub fn notice(status: &PatchStatus, locale: Locale) -> Option<Notice> {
    let ru = locale == Locale::Ru;
    let title = APP_TITLE[usize::from(!ru)].to_owned();
    let body = match (status, ru) {
        (PatchStatus::Migrated { to, .. }, true) => format!("Модпак перенесён под клиент {to}."),
        (PatchStatus::Migrated { to, .. }, false) => format!("The modpack moved to client {to}."),
        (PatchStatus::Updated { to, game_version, .. }, true) => format!("Модпак обновлён до {to} под клиент {game_version}."),
        (PatchStatus::Updated { to, game_version, .. }, false) => format!("The modpack is updated to {to} for client {game_version}."),
        (PatchStatus::Waiting { game_version, .. }, true) => format!("Ждём обновления модпака под {game_version}."),
        (PatchStatus::Waiting { game_version, .. }, false) => format!("Waiting for a modpack update for {game_version}."),
        (PatchStatus::UpdateAvailable { latest, .. }, true) => format!("Доступна новая версия модпака {latest}."),
        (PatchStatus::UpdateAvailable { latest, .. }, false) => format!("Modpack {latest} is available."),
        (PatchStatus::Failed { message }, true) => format!("Не удалось обновить модпак: {message}"),
        (PatchStatus::Failed { message }, false) => format!("The modpack update failed: {message}"),
        _ => return None,
    };

    Some(Notice { title, body })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn announces_the_patch_outcomes_only() {
        let waiting = PatchStatus::Waiting { game_version: "1.46.0.0".into(), from: "1.45.0.0".into() };
        let current = PatchStatus::UpToDate { game_version: "1.46.0.0".into(), modpack_version: None };

        assert_eq!(notice(&waiting, Locale::Ru).unwrap().body, "Ждём обновления модпака под 1.46.0.0.");
        assert!(notice(&current, Locale::En).is_none());
    }
}
