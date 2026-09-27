import re

from ..core.compat import is_int, string_types, to_text

LIMITS = {
    'optional_devices': 4,
    'consumables': 4,
    'directives': 3,
    'shells': 4,
    'shell_count': 1000,
    'field_modifications': 32,
    'crew': 8,
    'skills': 12,
    'gameplay_id': 1023,
}

TAG_PATTERN = re.compile(r'^[A-Za-z0-9_.-]{1,64}$')
GAMEPLAY_SHIFT = 16
MAX_TRACKED_ARENAS = 20


def _item_id(value):
    if is_int(value) and value > 0:
        return value
    return None


def _slots(values, limit):
    if not isinstance(values, (list, tuple)):
        return []
    return [_item_id(value) for value in values][:limit]


def _tag(value):
    if not isinstance(value, string_types):
        return None
    text = to_text(value)
    return text if TAG_PATTERN.match(text) else None


def _tags(values, limit):
    if not isinstance(values, (list, tuple)):
        return []
    result = []
    for value in values:
        tag = _tag(value)
        if tag is not None and tag not in result:
            result.append(tag)
    return result[:limit]


def _shells(values):
    if not isinstance(values, (list, tuple)):
        return []
    result = []
    seen = set()
    for value in values:
        if not isinstance(value, dict):
            continue
        shell_id = _item_id(value.get('shell_id'))
        count = value.get('count')
        if shell_id is None or shell_id in seen or not is_int(count) or count < 0:
            continue
        seen.add(shell_id)
        result.append({'shell_id': shell_id, 'count': min(count, LIMITS['shell_count'])})
    return result[:LIMITS['shells']]


def _crew(values):
    if not isinstance(values, (list, tuple)):
        return []
    result = []
    for value in values:
        if not isinstance(value, dict):
            continue
        role = _tag(value.get('role'))
        if role is None:
            continue
        result.append({'role': role, 'skills': _tags(value.get('skills'), LIMITS['skills'])})
    return result[:LIMITS['crew']]


def gameplay_id_of(arena_type_id):
    if not is_int(arena_type_id) or arena_type_id < 0:
        return None
    gameplay_id = arena_type_id >> GAMEPLAY_SHIFT
    return gameplay_id if gameplay_id <= LIMITS['gameplay_id'] else None


def normalize_loadout(raw, arena_type_id=None):
    if not isinstance(raw, dict):
        return None
    loadout = {
        'optional_devices': _slots(raw.get('optional_devices'), LIMITS['optional_devices']),
        'consumables': _slots(raw.get('consumables'), LIMITS['consumables']),
        'directives': _slots(raw.get('directives'), LIMITS['directives']),
        'shells': _shells(raw.get('shells')),
        'field_modifications': _tags(raw.get('field_modifications'), LIMITS['field_modifications']),
        'crew': _crew(raw.get('crew')),
        'gameplay_id': gameplay_id_of(arena_type_id),
    }
    has_slots = any(item is not None for key in ('optional_devices', 'consumables', 'directives') for item in loadout[key])
    has_items = has_slots or any(loadout[key] for key in ('shells', 'field_modifications', 'crew'))
    return loadout if has_items else None


class LoadoutTracker(object):

    def __init__(self, max_arenas=MAX_TRACKED_ARENAS):
        self.max_arenas = max_arenas
        self.pending = None
        self.arenas = []

    def queued(self, tank_id, raw):
        self.pending = (tank_id, raw) if is_int(tank_id) and isinstance(raw, dict) else None

    def battle_started(self, arena_id, tank_id):
        pending = self.pending
        self.pending = None
        if pending is None or not arena_id or pending[0] != tank_id:
            return False
        self.arenas = [entry for entry in self.arenas if entry[0] != arena_id]
        self.arenas.append((arena_id, pending[0], pending[1]))
        self.arenas = self.arenas[-self.max_arenas:]
        return True

    def take(self, arena_id, tank_id):
        for entry in self.arenas:
            if entry[0] == arena_id:
                self.arenas.remove(entry)
                return entry[2] if entry[1] == tank_id else None
        return None
