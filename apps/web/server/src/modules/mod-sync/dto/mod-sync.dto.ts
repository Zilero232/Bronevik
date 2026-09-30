import {
  modProfilesLibrarySchema,
  modProfilesWriteRequestSchema,
  modSetsLibrarySchema,
  modSetsWriteRequestSchema,
  modSyncLibrariesSchema,
  modSyncReadRequestSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class ModSyncReadRequestDto extends createZodDto(modSyncReadRequestSchema) {}
export class ModSetsWriteRequestDto extends createZodDto(modSetsWriteRequestSchema) {}
export class ModProfilesWriteRequestDto extends createZodDto(modProfilesWriteRequestSchema) {}
export class ModSetsLibraryDto extends createZodDto(modSetsLibrarySchema) {}
export class ModProfilesLibraryDto extends createZodDto(modProfilesLibrarySchema) {}
export class ModSyncLibrariesDto extends createZodDto(modSyncLibrariesSchema) {}
