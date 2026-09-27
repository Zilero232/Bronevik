from __future__ import absolute_import, division, print_function, unicode_literals

# Device names of the own vehicle as the client reports them (Avatar: VEHICLE_VIEW_STATE.DEVICES with
# (deviceName, 'critical' | 'destroyed' | 'repaired' | 'normal', actualState), RU 1.45).
AMMO_RACK = 'ammoBay'
CREW_ROLES = ('commander', 'driver', 'radioman', 'gunner', 'loader')
STATE_CRITICAL = 'critical'
STATE_DESTROYED = 'destroyed'
