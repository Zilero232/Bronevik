from personal_missions_constants import PROGRESS_TEMPLATE, CONDITION_ICON, VISIBLE_SCOPE, DESCRIPTIONS, DISPLAY_TYPE
_config = {'regular_1_1_1': {'topByExp': {'type': PROGRESS_TEMPLATE.BINARY, 
                                  'config': {'isMain': True, 
                                             'isAward': True, 
                                             'params': {'desiredPosition': 10}}, 
                                  'description': DESCRIPTIONS.REGULAR(iconID=CONDITION_ICON.TOP)}, 
                     'alive': {'type': PROGRESS_TEMPLATE.BINARY, 
                               'config': {'isMain': False, 
                                          'isAward': True}, 
                               'description': DESCRIPTIONS.REGULAR(iconID=CONDITION_ICON.SURVIVE)}}}
_config_pm2 = {'pm2_5_1_1': {'assist': {'type': PROGRESS_TEMPLATE.VALUE, 
                            'config': {'goal': 15000, 
                                       'isMain': True, 
                                       'isAward': True}, 
                            'description': DESCRIPTIONS.REGULAR(iconID=CONDITION_ICON.ASSIST)}, 
                 'aliveSeries': {'type': PROGRESS_TEMPLATE.VALUE, 
                                 'config': {'goal': 5, 
                                            'isMain': False, 
                                            'isAward': True}, 
                                 'description': DESCRIPTIONS.HEADER(displayType=DISPLAY_TYPE.COUNTER)}}}
_config_pm3 = {}
