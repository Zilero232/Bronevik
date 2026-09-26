import uuid

from .compat import is_int, is_number, string_types, to_text
from .loadout import normalize_loadout
from .shots import MAX_SHOTS
from .version import SCHEMA_VERSION

REALM = 'RU'
MAX_PLATOON_MATES = 2

STAT_FIELDS = (
    ('damage_dealt', 'damageDealt'),
    ('damage_assisted_radio', 'damageAssistedRadio'),
    ('damage_assisted_track', 'damageAssistedTrack'),
    ('damage_assisted_stun', 'damageAssistedStun'),
    ('damage_blocked', 'damageBlockedByArmor'),
    ('spotted', 'spotted'),
    ('frags', 'kills'),
    ('damaged', 'damaged'),
    ('shots', 'shots'),
    ('direct_hits', 'directHits'),
    ('direct_enemy_hits', 'directEnemyHits'),
    ('piercings', 'piercings'),
    ('piercing_enemy_hits', 'piercingEnemyHits'),
    ('xp', 'xp'),
    ('original_xp', 'originalXP'),
    ('credits', 'credits'),
    ('original_credits', 'originalCredits'),
    ('subtotal_credits', 'subtotalCredits'),
    ('factual_credits', 'factualCredits'),
    ('life_time_s', 'lifeTime'),
)


COST_FIELDS = (
    ('repair_cost', 'autoRepairCost'),
    ('ammo_cost', 'autoLoadCost'),
    ('consumables_cost', 'autoEquipCost'),
)


class PayloadError(Exception):
    pass


def new_event_id():
    return uuid.uuid4().hex


def _int(value, default=0):
    if is_int(value):
        return value
    if is_number(value):
        return int(value)
    return default


def _first_dict(value):
    if isinstance(value, dict):
        return value
    if isinstance(value, (list, tuple)) and value and isinstance(value[0], dict):
        return value[0]
    return None


def _credits_part(value):
    if is_int(value):
        return value
    if isinstance(value, (list, tuple)) and value and is_int(value[0]):
        return value[0]
    return None


def extract_economy(vehicle):
    economy = {}
    free_xp = vehicle.get('freeXP')
    if is_int(free_xp) and free_xp >= 0:
        economy['free_xp'] = free_xp
    for target, source in COST_FIELDS:
        value = _credits_part(vehicle.get(source))
        if value is not None and value >= 0:
            economy[target] = value
    return economy


def find_own_vehicle(results):
    personal = results.get('personal')
    if not isinstance(personal, dict):
        raise PayloadError('no personal block')
    for key, value in personal.items():
        if key == 'avatar':
            continue
        vehicle = _first_dict(value)
        if vehicle is not None and 'typeCompDescr' in vehicle:
            return vehicle
    raise PayloadError('no personal vehicle')


def battle_outcome(winner_team, team):
    if winner_team == 0:
        return 'draw'
    return 'win' if winner_team == team else 'loss'


def extract_moe(vehicle):
    rating = vehicle.get('damageRating')
    moving_avg = vehicle.get('movingAvgDamage')
    if not is_int(rating) or not is_int(moving_avg) or rating <= 0:
        return None
    return {
        'marks_on_gun': _int(vehicle.get('marksOnGun')),
        'damage_rating': rating,
        'moving_avg_damage': moving_avg,
    }


def _player_key(value):
    if is_int(value):
        return value
    if isinstance(value, string_types) and value.isdigit():
        return int(value)
    return None


def extract_platoon(results, account_id):
    players = results.get('players')
    if not isinstance(players, dict) or not is_int(account_id):
        return None
    by_id = {}
    for key, value in players.items():
        player_id = _player_key(key)
        if player_id is not None and isinstance(value, dict):
            by_id[player_id] = value
    own = by_id.get(account_id)
    if own is None:
        return None
    prebattle = own.get('prebattleID')
    if not is_int(prebattle) or prebattle <= 0:
        return None
    mates = sorted(
        player_id for player_id, player in by_id.items()
        if player_id != account_id and player.get('prebattleID') == prebattle and player.get('team') == own.get('team')
    )[:MAX_PLATOON_MATES]
    if not mates:
        return None
    return {'size': len(mates) + 1, 'mates': mates}


def normalize_shots(shots):
    if not isinstance(shots, (list, tuple)):
        return None
    result = [shot for shot in shots if isinstance(shot, dict)][:MAX_SHOTS]
    return result or None


def build_battle_event(results, extras=None):
    extras = extras or {}
    if not isinstance(results, dict):
        raise PayloadError('results must be a dict')
    arena_unique_id = results.get('arenaUniqueID')
    if not is_int(arena_unique_id) or arena_unique_id <= 0:
        raise PayloadError('no arenaUniqueID')
    common = results.get('common') or {}
    avatar = (results.get('personal') or {}).get('avatar') or {}
    vehicle = find_own_vehicle(results)
    team = _int(vehicle.get('team'), _int(avatar.get('team'), 0))
    death_reason = _int(vehicle.get('deathReason'), -1)
    stats = {}
    for target, source in STAT_FIELDS:
        stats[target] = _int(vehicle.get(source))
    stats['is_alive'] = death_reason == -1
    stats['death_reason'] = death_reason
    stats['is_premium'] = bool(vehicle.get('isPremium', False))
    stats.update(extract_economy(vehicle))
    tank_id = _int(vehicle.get('typeCompDescr'))
    event = {
        'type': 'battle_result',
        'event_id': 'battle:' + str(arena_unique_id),
        'occurred_at': _int(extras.get('occurred_at'), _int(common.get('arenaCreateTime')) + _int(common.get('duration'))),
        'arena_unique_id': str(arena_unique_id),
        'arena_type_id': _int(common.get('arenaTypeID')),
        'map_name': extras.get('map_name'),
        'bonus_type': _int(common.get('bonusType')),
        'gui_type': _int(common.get('guiType')),
        'arena_created_at': _int(common.get('arenaCreateTime')),
        'duration_s': _int(common.get('duration')),
        'finish_reason': _int(common.get('finishReason')),
        'winner_team': _int(common.get('winnerTeam')),
        'team': team,
        'result': battle_outcome(_int(common.get('winnerTeam')), team),
        'vehicle': {
            'tank_id': tank_id,
            'name': extras.get('vehicle_name'),
            'tier': extras.get('vehicle_tier'),
        },
        'stats': stats,
        'moe': extract_moe(vehicle),
        'queue_time_s': extras.get('queue_time_s'),
        'session_id': extras.get('session_id'),
        'loadout': normalize_loadout(extras.get('loadout'), _int(common.get('arenaTypeID'))),
        'platoon': extract_platoon(results, _int(avatar.get('accountDBID'), None)),
        'shots': normalize_shots(extras.get('shots')),
    }
    return event


def build_moe_snapshot_event(tank_id, damage_rating, moving_avg_damage, marks_on_gun, battles, occurred_at):
    return {
        'type': 'moe_snapshot',
        'event_id': new_event_id(),
        'occurred_at': int(occurred_at),
        'tank_id': int(tank_id),
        'damage_rating': int(damage_rating),
        'moving_avg_damage': int(moving_avg_damage),
        'marks_on_gun': int(marks_on_gun),
        'battles': int(battles) if is_int(battles) else None,
    }


def build_moe_distribution_event(tank_id, battle_count, percentiles, occurred_at):
    values = []
    for value in percentiles or ():
        if is_number(value):
            values.append(int(value))
    return {
        'type': 'moe_distribution',
        'event_id': new_event_id(),
        'occurred_at': int(occurred_at),
        'tank_id': int(tank_id),
        'battle_count': _int(battle_count),
        'damage_better_than_n_percent': values,
    }


def build_queue_event(queue_type, wait_s, outcome, occurred_at, tank_id=None):
    return {
        'type': 'queue',
        'event_id': new_event_id(),
        'occurred_at': int(occurred_at),
        'queue_type': _int(queue_type),
        'wait_s': round(max(0.0, float(wait_s)), 1),
        'outcome': outcome,
        'tank_id': tank_id if is_int(tank_id) else None,
    }


def build_envelope(events, device_id, account_id, mod_version, client_version, sent_at, batch_id=None):
    if not isinstance(device_id, string_types) or not device_id:
        raise PayloadError('device_id required')
    return {
        'schema_version': SCHEMA_VERSION,
        'batch_id': batch_id or new_event_id(),
        'device_id': device_id,
        'account_id': account_id,
        'realm': REALM,
        'mod_version': mod_version,
        'client_version': to_text(client_version or ''),
        'sent_at': int(sent_at),
        'events': list(events),
    }
