import { vkStatusSchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class VkStatusDto extends createZodDto(vkStatusSchema) {}
