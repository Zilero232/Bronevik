from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import string_types, to_text
from .constants import ACTION_ARMOR, ARMOR_PATH, SLUG_DROPPED, SLUG_SEPARATORS

# Fair play: a link to the site's armour page of the tank selected in the hangar. Nothing is analysed in the client and
# nothing is shown in battle (Lesta's support article 15152 names armour analysis in battle).


def tank_slug(vehicle_name):
    """'ussr:R45_IS-7' (Vehicle.name) -> 'r45-is-7', the slug of the site's tank pages; None without a tag."""
    if not isinstance(vehicle_name, string_types):
        return None
    tag = to_text(vehicle_name).split(u':')[-1].strip().lower().replace(u'&', u' and ')
    slug = SLUG_SEPARATORS.sub(u'-', SLUG_DROPPED.sub(u'', tag)).strip(u'-')
    return slug or None


def armor_actions(vehicle_name, translate):
    slug = tank_slug(vehicle_name)
    if slug is None:
        return []
    return [{'id': ACTION_ARMOR, 'label': translate('hangar_info_armor'), 'link': ARMOR_PATH % slug, 'confirm': None}]
