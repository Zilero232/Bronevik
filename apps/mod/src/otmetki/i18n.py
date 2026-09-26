# -*- coding: utf-8 -*-
from .compat import to_text

STRINGS = {
    'ru': {
        'mod_name': u'Три отметки',
        'enabled': u'Мод включён',
        'send_battle_results': u'Отправлять итоги своих боёв',
        'send_moe_snapshots': u'Отправлять проценты отметок',
        'send_moe_distribution': u'Отправлять распределение урона для отметок',
        'send_queue_times': u'Отправлять время в очереди',
        'send_loadouts': u'Отправлять оборудование, снаряжение и навыки своего танка',
        'send_shots': u'Отправлять урон своих выстрелов (для «Честного рандома»)',
        'battle_moe_panel': u'Панель отметки в бою',
        'hangar_session_panel': u'Панель сессии в ангаре',
        'share_settings': u'Настройки игры: экспорт и «Применить через мод»',
        'settings_exported': u'Три отметки: настройки игры отправлены на сайт',
        'settings_export_failed': u'Три отметки: не удалось отправить настройки ({reason})',
        'settings_apply_title': u'Настройки {slug}',
        'settings_apply_body': u'Применить {count} изменений из групп: {groups}? Текущие значения сохранятся, «Вернуть мои» их восстановит.',
        'settings_applied': u'Три отметки: настройки применены',
        'settings_restored': u'Три отметки: ваши настройки восстановлены',
        'settings_no_backup': u'Три отметки: нет сохранённых настроек для восстановления',
        'settings_unavailable': u'Три отметки: настройки клиента недоступны',
        'bind_code': u'Код привязки с сайта',
        'bind_code_tooltip': u'{HEADER}Привязка к сайту{/HEADER}{BODY}Откройте профиль на сайте, получите одноразовый код из 6 символов и нажмите «Привязать».{/BODY}',
        'bind_button': u'Привязать',
        'status_bound': u'Привязано к аккаунту {account_id}',
        'status_unbound': u'Аккаунт не привязан',
        'status_auth_failed': u'Привязка недействительна, получите новый код',
        'bind_success': u'Три отметки: аккаунт привязан',
        'bind_invalid_code': u'Три отметки: неверный формат кода',
        'bind_failed': u'Три отметки: не удалось привязать ({reason})',
        'bind_no_account': u'Три отметки: войдите в игру, чтобы привязать аккаунт',
        'moe_title': u'Отметка',
        'moe_projected': u'в бою',
        'moe_need': u'до {level}%: ещё {damage}',
        'moe_reached': u'{level}% в этом бою',
        'moe_no_thresholds': u'нет порогов',
        'moe_max': u'максимум',
        'session_title': u'Сессия',
        'session_battles': u'Бои',
        'session_winrate': u'Победы',
        'session_damage': u'Ср. урон',
        'session_wn8': u'WN8',
        'unknown': u'—',
    },
    'en': {
        'mod_name': u'Three Marks',
        'enabled': u'Mod enabled',
        'send_battle_results': u'Send my battle results',
        'send_moe_snapshots': u'Send mark of excellence percentages',
        'send_moe_distribution': u'Send MoE damage distribution',
        'send_queue_times': u'Send queue times',
        'send_loadouts': u'Send my tank equipment, consumables and crew skills',
        'send_shots': u'Send the damage of my own shots (for Honest RNG)',
        'battle_moe_panel': u'In-battle MoE panel',
        'hangar_session_panel': u'Hangar session panel',
        'share_settings': u'Game settings: export and "Apply via mod"',
        'settings_exported': u'Three Marks: game settings sent to the site',
        'settings_export_failed': u'Three Marks: could not send settings ({reason})',
        'settings_apply_title': u'Settings of {slug}',
        'settings_apply_body': u'Apply {count} changes in: {groups}? Your current values are backed up; "Restore mine" brings them back.',
        'settings_applied': u'Three Marks: settings applied',
        'settings_restored': u'Three Marks: your settings were restored',
        'settings_no_backup': u'Three Marks: no saved settings to restore',
        'settings_unavailable': u'Three Marks: client settings are unavailable',
        'bind_code': u'Binding code from the site',
        'bind_code_tooltip': u'{HEADER}Link to the site{/HEADER}{BODY}Open your profile on the site, get a one-time 6-character code and press Bind.{/BODY}',
        'bind_button': u'Bind',
        'status_bound': u'Bound to account {account_id}',
        'status_unbound': u'Account is not bound',
        'status_auth_failed': u'Binding is no longer valid, get a new code',
        'bind_success': u'Three Marks: account bound',
        'bind_invalid_code': u'Three Marks: invalid code format',
        'bind_failed': u'Three Marks: binding failed ({reason})',
        'bind_no_account': u'Three Marks: log in to bind your account',
        'moe_title': u'MoE',
        'moe_projected': u'this battle',
        'moe_need': u'to {level}%: {damage} more',
        'moe_reached': u'{level}% this battle',
        'moe_no_thresholds': u'no thresholds',
        'moe_max': u'maximum',
        'session_title': u'Session',
        'session_battles': u'Battles',
        'session_winrate': u'Win rate',
        'session_damage': u'Avg dmg',
        'session_wn8': u'WN8',
        'unknown': u'-',
    },
}

DEFAULT_LANGUAGE = 'ru'


def resolve_language(preferred, client_language=None):
    if preferred in STRINGS:
        return preferred
    if client_language:
        code = to_text(client_language).lower()[:2]
        if code in ('ru', 'be', 'kk', 'uk'):
            return 'ru'
        if code in STRINGS:
            return code
    return DEFAULT_LANGUAGE


class Translator(object):

    def __init__(self, language=DEFAULT_LANGUAGE):
        self.language = language if language in STRINGS else DEFAULT_LANGUAGE

    def __call__(self, key, **params):
        table = STRINGS[self.language]
        text = table.get(key) or STRINGS[DEFAULT_LANGUAGE].get(key) or to_text(key)
        if params:
            return text.format(**params)
        return text
