import { searchQuerySchema, searchResponseSchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class SearchQueryDto extends createZodDto(searchQuerySchema) {}
export class SearchResponseDto extends createZodDto(searchResponseSchema) {}
