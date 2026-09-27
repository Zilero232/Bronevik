"""Own shots for the "Honest RNG" data: shell kind, nominal damage of the own shell, the shot record."""
from ...core.compat import is_int, is_number
from ...core.shells import shell_code
from .constants import KIND_BY_CODE, MAX_DAMAGE, MAX_DISTANCE_M, MAX_SHOTS, OUTCOMES, SHELL_KINDS, UNKNOWN_SHELL  # noqa: F401


def normalize_shell(raw):
    """The contract's shell kind of a client shell type: the battle feedback's BATTLE_LOG_SHELL_TYPES
    member (1.45), its name or index, or a vehicle descriptor's shell kind string; 'unknown' otherwise."""
    return KIND_BY_CODE.get(shell_code(raw), UNKNOWN_SHELL)


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
        'shell': shell if shell in SHELL_KINDS else UNKNOWN_SHELL,
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
