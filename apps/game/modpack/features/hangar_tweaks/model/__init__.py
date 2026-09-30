from __future__ import absolute_import, division, print_function, unicode_literals

# Left out: hiding the hangar tutorial hints (no side-effect-free client API could be verified for Lesta 1.45;
# README "Hangar tweaks") and an accelerated crew training switch: RU 1.45 turns it on by itself for elite and premium
# vehicles (crew_widget setIsAcceleratedTraining) and no client button sends the XP_TO_TMAN vehicle flag any more (the
# stock crew panel shows the state). Three to five carousel rows go beyond the game's own options on the player's
# request: the row count the carousel's Flash already lays out for any number, sent from Python (README).

from .actions import plan_crew_return, plan_crew_unload, plan_demount, plan_style_removal  # noqa: F401
from .carousel import (  # noqa: F401
    carousel_row_count,
    normalize_rows,
    rows_override,
    scale_index,
    to_native,
    with_interface_scale,
)
from .constants import (  # noqa: F401
    ACTION_CREW,
    ACTION_DEMOUNT,
    ACTION_KEYS,
    ACTION_RETURN,
    ACTION_STYLE,
    REFUSE_BERTHS,
    REFUSE_LOCKED,
    REFUSE_NOTHING,
)
