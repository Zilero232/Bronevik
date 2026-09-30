from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import string_types, to_text
from .constants import ACTION_CHOOSE, ACTION_NATIVE, ROW_NATIVE, SPACE_NAME, SPACES_PREFIX  # noqa: F401

# Only the look of the own hangar, from the spaces the client already has. A server event hangar (the client's
# cmd_change_hangar notifications) and the hangars of other modes win over the choice.


def normalize_space(value):
    text = to_text(value).strip().lower() if isinstance(value, string_types) else u''
    if not text:
        return u''
    return text if SPACE_NAME.match(text) else None


def space_path(name):
    return SPACES_PREFIX + name if name else None


def space_name(path):
    if not isinstance(path, string_types):
        return None
    text = to_text(path).strip().lower()
    if not text.startswith(SPACES_PREFIX):
        return None
    name = text[len(SPACES_PREFIX):]
    return name if SPACE_NAME.match(name) else None


def space_names(paths):
    return sorted(set(name for name in (space_name(path) for path in paths or ()) if name))


def override_changes(current, owned, wanted):
    """{is_premium: new override or None to drop it} for the default hangar's space overrides: ours is written or
    dropped only where the slot is empty or already holds ours; an override the server set (an event hangar) stays."""
    changes = {}
    for is_premium in (True, False):
        value = current.get(is_premium)
        if value is not None and value != owned:
            continue
        if value != wanted:
            changes[is_premium] = wanted
    return changes


def space_row(name, chosen, current, translate):
    badge = None
    if name == chosen:
        badge = translate('hangar_space_badge_chosen')
    elif name == current:
        badge = translate('hangar_space_badge_current')
    return {
        'id': name,
        'title': name,
        'badge': badge,
        'actions': [] if name == chosen else [{'id': ACTION_CHOOSE, 'label': translate('hangar_space_choose')}],
    }


def build_page(names, chosen, current, translate):
    native = {
        'id': ROW_NATIVE,
        'title': translate('hangar_space_native'),
        'subtitle': translate('hangar_space_native_hint'),
        'badge': translate('hangar_space_badge_chosen') if not chosen else None,
        'actions': [{'id': ACTION_NATIVE, 'label': translate('hangar_space_choose')}] if chosen else [],
    }
    rows = [native] + [space_row(name, chosen, current, translate) for name in names]
    return {'kind': 'list', 'empty': translate('hangar_space_empty'), 'rows': rows}
