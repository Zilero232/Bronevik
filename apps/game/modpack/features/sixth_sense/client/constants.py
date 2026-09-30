from __future__ import absolute_import, division, print_function, unicode_literals

# Half a second: the icon pulse (model PULSE_PERIOD_S); the timer text still counts whole seconds.
TICK_S = 0.5

# The HUD report's reasons while the lamp is dark (the stock lamp is dark then too), and the log line of the battle's
# first light, which tells a lamp that never lit from one the player never saw.
NOT_SPOTTED = 'the own vehicle has not been spotted yet'
NO_STATES = 'the client has no vehicle view states'
FIRST_LIGHT = 'sixth_sense: the own vehicle is spotted, the lamp is lit'
