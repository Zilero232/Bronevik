import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import { deepLinkSchema } from './deep-link.schemas';

export const takeDeepLink = () => invokeCommand({ command: COMMANDS.takeDeepLink, schema: deepLinkSchema.nullable() });
