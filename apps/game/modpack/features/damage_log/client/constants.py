from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 common/BattleFeedbackCommon.BATTLE_EVENT_TYPE name -> our kind. TANKING and the RECEIVED_* events carry the
# attacker as their target id, as the stock damage log shows it.
EVENT_KINDS = (
    ('DAMAGE', 'damage'),
    ('RADIO_ASSIST', 'radio'),
    ('TRACK_ASSIST', 'track'),
    ('STUN_ASSIST', 'stun'),
    ('TANKING', 'blocked'),
    ('RECEIVED_DAMAGE', 'received'),
    ('CRIT', 'crit'),
    ('RECEIVED_CRIT', 'received_crit'),
)
# Kinds whose target is the player's own target: they count only for an enemy (an ally hit is not the player's log).
DEALT_KINDS = ('damage', 'radio', 'track', 'stun', 'crit')
CRIT_KINDS = ('crit', 'received_crit')
# The damage panel's own device state for the ammo rack (VEHICLE_VIEW_STATE.DEVICES: (name, state, actual state)).
AMMO_RACK_DEVICE = 'ammoBay'
AMMO_RACK_STATES = ('critical', 'destroyed')
