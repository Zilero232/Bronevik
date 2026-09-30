import { modProblemReportReceiptSchema, modProblemReportRequestSchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class ModProblemReportRequestDto extends createZodDto(modProblemReportRequestSchema) {}
export class ModProblemReportReceiptDto extends createZodDto(modProblemReportReceiptSchema) {}
