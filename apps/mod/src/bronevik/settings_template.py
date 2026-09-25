from .config import FEATURES

LINKAGE = 'bronevik_companion'
BIND_CODE_VAR = 'bind_code'


def build_template(config, translate, status_text):
    column1 = []
    for feature in FEATURES:
        column1.append({
            'type': 'CheckBox',
            'text': translate(feature),
            'value': bool(config.get(feature)),
            'varName': feature,
        })
    column2 = [
        {
            'type': 'Label',
            'text': status_text,
        },
        {
            'type': 'TextInput',
            'text': translate('bind_code'),
            'tooltip': translate('bind_code_tooltip'),
            'value': '',
            'varName': BIND_CODE_VAR,
            'width': 120,
            'button': {'width': 110, 'height': 23, 'text': translate('bind_button'), 'offsetTop': 0, 'offsetLeft': 0},
        },
    ]
    return {
        'modDisplayName': translate('mod_name'),
        'enabled': bool(config.get('enabled')),
        'column1': column1,
        'column2': column2,
    }


def settings_to_config(values):
    updates = {}
    if not isinstance(values, dict):
        return updates
    if 'enabled' in values:
        updates['enabled'] = values['enabled']
    for feature in FEATURES:
        if feature in values:
            updates[feature] = values[feature]
    return updates
