from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 common/BattleFeedbackCommon.BATTLE_EVENT_TYPE: the player's own feedback about hits on the own tank.
KIND_BY_EVENT = (
    ('RECEIVED_DAMAGE', 'pen'),
    ('TANKING', 'blocked'),
    ('RECEIVED_CRIT', 'crit'),
)
