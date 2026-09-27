import { z } from 'zod';

import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import type { ImportProfileInput, ProfileTarget, RenameProfileInput, SaveProfileInput } from './profiles.types';

import { profilesViewSchema } from './profiles.schemas';

export const listProfiles = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.listProfiles, schema: profilesViewSchema, args: { clientPath } });

export const saveProfile = ({ clientPath, name }: SaveProfileInput) =>
  invokeCommand({ command: COMMANDS.saveProfile, schema: profilesViewSchema, args: { clientPath, name } });

export const activateProfile = ({ clientPath, id }: ProfileTarget) =>
  invokeCommand({ command: COMMANDS.activateProfile, schema: profilesViewSchema, args: { clientPath, id } });

export const renameProfile = ({ clientPath, id, name }: RenameProfileInput) =>
  invokeCommand({ command: COMMANDS.renameProfile, schema: profilesViewSchema, args: { clientPath, id, name } });

export const deleteProfile = ({ clientPath, id }: ProfileTarget) =>
  invokeCommand({ command: COMMANDS.deleteProfile, schema: profilesViewSchema, args: { clientPath, id } });

export const importProfile = ({ clientPath, code, name }: ImportProfileInput) =>
  invokeCommand({ command: COMMANDS.importProfile, schema: profilesViewSchema, args: { clientPath, code, name } });

export const exportProfile = ({ clientPath, id }: ProfileTarget) =>
  invokeCommand({ command: COMMANDS.exportProfile, schema: z.string(), args: { clientPath, id } });
