# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

STRINGS = {
    'ru': {
        'component_responsive_reticle': u'Отзывчивый прицел',
        'component_responsive_reticle_hint': u'Маркер орудия двигается за орудием каждый кадр, а не десять раз в секунду: сведение '
                                            u'и цвет пробития по-прежнему считаются раз в серверный тик. Только отрисовка, выстрел '
                                            u'и наведение не меняются. Выключен для арты, в реплеях и у орудий без горизонтальной наводки.',
        'responsive_reticle_follow': u'Маркер догоняет орудие',
        'responsive_reticle_follow_instant': u'Сразу, в том же кадре',
        'responsive_reticle_follow_smooth': u'Плавно, за полтика',
    },
    'en': {
        'component_responsive_reticle': u'Responsive reticle',
        'component_responsive_reticle_hint': u'The gun marker follows the gun every frame instead of ten times a second; the '
                                            u'dispersion and the penetration colour are still worked out once per server tick. '
                                            u'Drawing only: the shot and the aim stay as they are. Off for SPGs, in replays and on '
                                            u'guns without horizontal traverse.',
        'responsive_reticle_follow': u'The marker catches up with the gun',
        'responsive_reticle_follow_instant': u'At once, in the same frame',
        'responsive_reticle_follow_smooth': u'Smoothly, over half a tick',
    },
}
