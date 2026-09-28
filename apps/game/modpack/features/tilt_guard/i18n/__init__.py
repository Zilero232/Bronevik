# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

STRINGS = {
    'ru': {
        'component_tilt_guard': u'Антитилт',
        'component_tilt_guard_hint': u'Мягкое напоминание в ангаре сделать перерыв: после серии поражений, долгой сессии или заметного падения вашего урона. Только ваши случайные бои этой сессии, ничего не блокируется.',
        'tilt_guard_loss_streak': u'Поражений подряд (0 — не напоминать)',
        'tilt_guard_session_battles': u'Боёв за сессию (0 — не напоминать)',
        'tilt_guard_damage_drop': u'Напоминать при падении урона',
        'tilt_guard_streak': u'Три отметки: {streak} поражений подряд. Может, пять минут перерыва?',
        'tilt_guard_long': u'Три отметки: уже {battles} боёв за сессию. Хороший момент размяться.',
        'tilt_guard_damage': u'Три отметки: урон последних боёв ({recent}) заметно ниже начала сессии ({earlier}). Перерыв часто помогает.',
    },
    'en': {
        'component_tilt_guard': u'Tilt guard',
        'component_tilt_guard_hint': u'A gentle hangar reminder to take a break: after a losing streak, a long session or a clear drop in your damage. Only your own random battles of this session; nothing is blocked.',
        'tilt_guard_loss_streak': u'Losses in a row (0: no reminder)',
        'tilt_guard_session_battles': u'Battles in a session (0: no reminder)',
        'tilt_guard_damage_drop': u'Remind on a damage drop',
        'tilt_guard_streak': u'Three Marks: {streak} losses in a row. Maybe a five-minute break?',
        'tilt_guard_long': u'Three Marks: {battles} battles this session already. A good moment to stretch.',
        'tilt_guard_damage': u'Three Marks: your damage in the last battles ({recent}) is well below the start of the session ({earlier}). A break often helps.',
    },
}
