# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

STRINGS = {
    'ru': {
        'component_config_backup': u'Резервная копия настроек',
        'component_config_backup_hint': u'Копия всех настроек мода лежит рядом с preferences.xml игры (папка otmetki_backup) и '
                                        u'обновляется при каждом сохранении. Если установщик модпака удалил mods/configs, '
                                        u'при запуске недостающие файлы вернутся сами.',
        'config_backup_now': u'Сохранить копию сейчас',
        'config_backup_restore': u'Вернуть удалённые файлы',
        'config_backup_saved': u'Копия обновлена: файлов — {count}',
        'config_backup_up_to_date': u'Копия уже актуальна',
        'config_backup_nothing_missing': u'Все файлы настроек на месте',
        'config_backup_restored': u'Три отметки: из резервной копии возвращены настройки ({count}): {files}',
        'config_backup_unavailable': u'Папка игры с preferences.xml не найдена, копия не делается',
    },
    'en': {
        'component_config_backup': u'Settings backup',
        'component_config_backup_hint': u'A copy of every mod setting sits next to the game\'s preferences.xml (the otmetki_backup '
                                        u'folder) and is refreshed on every save. When a modpack installer wiped mods/configs, the '
                                        u'missing files come back on the next start.',
        'config_backup_now': u'Back up now',
        'config_backup_restore': u'Restore deleted files',
        'config_backup_saved': u'Backup refreshed: {count} files',
        'config_backup_up_to_date': u'The backup is already up to date',
        'config_backup_nothing_missing': u'Every settings file is in place',
        'config_backup_restored': u'Three Marks: settings restored from the backup ({count}): {files}',
        'config_backup_unavailable': u'The game folder with preferences.xml was not found, no backup is made',
    },
}
