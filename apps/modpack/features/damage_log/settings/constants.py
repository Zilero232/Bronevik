from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_damage_log'
PANEL_ID = 'damage_log'
STYLES = ('full', 'compact', 'minimal', 'custom')
LOG_KINDS = ('all', 'dealt', 'received')
MAX_TEMPLATE = 600

DEFAULTS = {
    'x': 250,
    'y': -260,
    'align_x': 'left',
    'align_y': 'bottom',
    'style': 'full',
    'template': '{dealt} | {blocked} | {assisted} | {received}',
    'show_log': True,
    'log_lines': 5,
    'log_kinds': 'all',
    'entry_template': '',
}
