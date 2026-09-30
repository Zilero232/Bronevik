from __future__ import absolute_import, division, print_function, unicode_literals

# The settings window's own section of components.json: where the player left it and how big, in design pixels
# (1 = 1px at interface scale 1.0, the page's rem), plus its zoom in percent. `placed` false: the page centres it.
SECTION = 'settings_window'
DEFAULTS = {
    'placed': False,
    'x': 0,
    'y': 0,
    'width': 0,
    'height': 0,
    'zoom': 100,
}
LIMITS = {
    'x': (-8000, 8000),
    'y': (-8000, 8000),
    'width': (0, 8000),
    'height': (0, 8000),
    'zoom': (50, 200),
}
NUMBERS = ('x', 'y', 'width', 'height', 'zoom')
