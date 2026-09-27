export { SECTION } from './config';
export { setSetting, toggleSwitch } from './model/actions';
export type { SetSettingInput, SettingInput } from './model/actions';
export { useT } from './model/hooks';

export { $groups, $invalid, $selected, $state, $view, openComponent, openSection, receiveState } from './model/store';
export type { ComponentGroup, Section, View } from './model/store';
