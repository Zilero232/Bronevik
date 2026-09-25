import { searchQuerySchema, searchResponseSchema } from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';

export class SearchQueryDto extends createZodDto(searchQuerySchema) {}
export class SearchResponseDto extends createZodDto(searchResponseSchema) {}
