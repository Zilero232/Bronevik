from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import (
    CONTEXT_BATTLE,
    CONTEXT_HANGAR,
    GROUP_BATTLE,
    GROUP_DATA,
    PLACEMENT,
    SECTION_BATTLE,
    SECTION_DATA,
    SECTION_HANGAR,
)


def placement_of(component_id, group, panel=False):
    known = PLACEMENT.get(component_id)
    if known is not None:
        return known
    if group == GROUP_DATA:
        return SECTION_DATA, CONTEXT_HANGAR
    if panel or group == GROUP_BATTLE:
        return SECTION_BATTLE, CONTEXT_BATTLE
    return SECTION_HANGAR, CONTEXT_HANGAR
