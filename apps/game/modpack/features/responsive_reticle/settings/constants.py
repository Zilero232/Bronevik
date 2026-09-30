from __future__ import absolute_import, division, print_function, unicode_literals

from ..model.constants import FOLLOW_INSTANT, FOLLOW_MODES

SWITCH = 'battle_responsive_reticle'
SECTION = 'responsive_reticle'
GROUP = 'battle'

DEFAULTS = {'follow': FOLLOW_INSTANT}
CHOICES = {'follow': FOLLOW_MODES}
