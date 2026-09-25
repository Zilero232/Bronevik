import type { CrewSkill, Equipment, FieldModification, OptionalDevice, VehicleSpec } from '@bronevik/gamedata';

import { isPlainObject, isString } from 'remeda';

const hasModifiers = (value: unknown): value is Record<string, unknown> & { name: string; modifiers: unknown[] } =>
  isPlainObject(value) && isString(value.name) && Array.isArray(value.modifiers);

export const isVehicleSpec = (value: unknown): value is VehicleSpec =>
  isPlainObject(value) &&
  isString(value.tag) &&
  isPlainObject(value.hull) &&
  isPlainObject(value.speedLimits) &&
  Array.isArray(value.chassis) &&
  Array.isArray(value.turrets) &&
  Array.isArray(value.engines) &&
  Array.isArray(value.radios) &&
  Array.isArray(value.crew);

export const isOptionalDevice = (value: unknown): value is OptionalDevice => hasModifiers(value) && Array.isArray(value.tags);

export const isEquipment = (value: unknown): value is Equipment => hasModifiers(value) && isString(value.kind);

export const isFieldModification = (value: unknown): value is FieldModification => hasModifiers(value);

export const isCrewSkill = (value: unknown): value is CrewSkill =>
  isPlainObject(value) && isString(value.name) && Array.isArray(value.params) && Array.isArray(value.roles) && isPlainObject(value.extras);
