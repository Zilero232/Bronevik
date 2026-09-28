from __future__ import absolute_import, division, print_function, unicode_literals

# Order of BATTLE_LOG_SHELL_TYPES in the RU 1.45 client (common/constants.py).
BATTLE_LOG_SHELL_NAMES = (
    'HOLLOW_CHARGE', 'ARMOR_PIERCING', 'ARMOR_PIERCING_HE', 'ARMOR_PIERCING_CR', 'SMOKE', 'HE_MODERN',
    'HE_LEGACY_STUN', 'HE_LEGACY_NO_STUN', 'FLAME', 'ARMOR_PIERCING_FSDS', 'HOLLOW_CHARGE_DF',
    'ARMOR_PIERCING_DF', 'ARMOR_PIERCING_HE_DF', 'ARMOR_PIERCING_CR_DF', 'HE_MODERN_DF',
)

CODES = {
    'ARMOR_PIERCING': 'ap',
    'ARMOR_PIERCING_HE': 'ap',
    'ARMOR_PIERCING_DF': 'ap',
    'ARMOR_PIERCING_HE_DF': 'ap',
    'ARMOR_PIERCING_CR': 'apcr',
    'ARMOR_PIERCING_CR_DF': 'apcr',
    'ARMOR_PIERCING_FSDS': 'apcr',
    'HOLLOW_CHARGE': 'heat',
    'HOLLOW_CHARGE_DF': 'heat',
    'HIGH_EXPLOSIVE': 'he',
    'HE_MODERN': 'he',
    'HE_MODERN_DF': 'he',
    'HE_LEGACY_STUN': 'he',
    'HE_LEGACY_NO_STUN': 'he',
    'SMOKE': 'smoke',
    'FLAME': 'flame',
}

SHELL_CODES = ('ap', 'apcr', 'heat', 'he', 'smoke', 'flame')
