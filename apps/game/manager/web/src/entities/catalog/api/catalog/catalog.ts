import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import { catalogSchema } from './catalog.schemas';

export const getCatalog = () => invokeCommand({ command: COMMANDS.getCatalog, schema: catalogSchema.nullable() });
