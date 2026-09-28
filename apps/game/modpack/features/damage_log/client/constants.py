from __future__ import absolute_import, division, print_function, unicode_literals

EVENT_KINDS = (
    ('DAMAGE', 'damage'),
    ('RADIO_ASSIST', 'radio'),
    ('TRACK_ASSIST', 'track'),
    ('STUN_ASSIST', 'stun'),
    ('TANKING', 'blocked'),
    ('RECEIVED_DAMAGE', 'received'),
)
# The damage panel's own device state for the ammo rack (VEHICLE_VIEW_STATE.DEVICES: (name, state, actual state)).
AMMO_RACK_DEVICE = 'ammoBay'
AMMO_RACK_STATES = ('critical', 'destroyed')
