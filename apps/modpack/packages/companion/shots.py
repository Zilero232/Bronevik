from ..core.compat import is_int, is_number, string_types, to_text

MAX_SHOTS = 200
MAX_DAMAGE = 10000
MAX_DISTANCE_M = 1500

SHELL_KINDS = {
    'ARMOR_PIERCING': 'armor_piercing',
    'ARMOR_PIERCING_HE': 'armor_piercing',
    'ARMOR_PIERCING_CR': 'armor_piercing_cr',
    'HOLLOW_CHARGE': 'hollow_charge',
    'HIGH_EXPLOSIVE': 'high_explosive',
}

OUTCOMES = ('damage', 'no_damage', 'miss')


def normalize_shell(raw):
    if not isinstance(raw, string_types):
        return 'unknown'
    return SHELL_KINDS.get(to_text(raw).upper(), 'unknown')


def nominal_for(options, shell, is_gold=None):
    matches = []
    for option in options or ():
        if not isinstance(option, (list, tuple)) or len(option) < 3:
            continue
        kind, damage, gold = option[0], option[1], option[2]
        if normalize_shell(kind) != shell or not is_number(damage) or damage <= 0:
            continue
        matches.append((bool(gold), int(damage)))
    if not matches:
        return None
    if is_gold is not None:
        preferred = [damage for gold, damage in matches if gold == bool(is_gold)]
        if preferred:
            return preferred[0]
    return matches[0][1]


def build_shot(damage, nominal, shell, outcome='damage', distance_m=None, fatal=False):
    if not is_number(damage) or damage < 0 or outcome not in OUTCOMES:
        return None
    nominal_value = int(nominal) if is_number(nominal) and 0 < nominal <= MAX_DAMAGE else None
    distance = int(round(distance_m)) if is_number(distance_m) and 0 <= distance_m <= MAX_DISTANCE_M else None
    return {
        'damage': min(int(damage), MAX_DAMAGE),
        'nominal': nominal_value,
        'shell': shell if shell in SHELL_KINDS.values() else 'unknown',
        'outcome': outcome,
        'distance_m': distance,
        'fatal': bool(fatal),
    }


class ShotLog(object):

    def __init__(self):
        self.shots = []

    def add(self, shot):
        if shot is None or len(self.shots) >= MAX_SHOTS:
            return False
        self.shots.append(shot)
        return True

    def mark_fatal(self, index):
        if is_int(index) and 0 <= index < len(self.shots):
            self.shots[index]['fatal'] = True

    def take(self):
        shots = self.shots
        self.shots = []
        return shots
