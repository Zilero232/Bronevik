"""Hangar tweaks: the carousel options the client offers, and free quick actions on the selected vehicle
(demount removable equipment, crew to barracks), planned here and run by the client's own processors.

Left out: hiding the hangar tutorial hints (no side-effect-free client API could be verified for Lesta
1.45; see README "Hangar tweaks") and a three-row carousel (Flash patch)."""
from __future__ import absolute_import, division, print_function, unicode_literals

from .actions import plan_crew_unload, plan_demount  # noqa: F401
from .carousel import to_native  # noqa: F401
from .constants import ACTION_CREW, ACTION_DEMOUNT, REFUSE_BERTHS, REFUSE_LOCKED, REFUSE_NOTHING  # noqa: F401
