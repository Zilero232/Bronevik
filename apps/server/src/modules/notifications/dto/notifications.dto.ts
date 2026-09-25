import {
  inboxPageSchema,
  inboxQuerySchema,
  markReadResultSchema,
  markReadSchema,
  pushKeySchema,
  pushSubscriptionSchema,
  pushUnsubscribeSchema
} from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';

export class InboxQueryDto extends createZodDto(inboxQuerySchema) {}
export class InboxPageDto extends createZodDto(inboxPageSchema) {}
export class MarkReadDto extends createZodDto(markReadSchema) {}
export class MarkReadResultDto extends createZodDto(markReadResultSchema) {}
export class PushKeyDto extends createZodDto(pushKeySchema) {}
export class PushSubscriptionDto extends createZodDto(pushSubscriptionSchema) {}
export class PushUnsubscribeDto extends createZodDto(pushUnsubscribeSchema) {}
