import { bonusCodeReportSchema, bonusCodeSchema, newsPageSchema, newsQuerySchema } from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';

import {
  bonusCodeListSchema,
  bonusCodesQuerySchema,
  offerArchiveQuerySchema,
  offerArchiveSchema,
  offerPageSchema,
  offersQuerySchema
} from './shop.schemas';

export class OffersQueryDto extends createZodDto(offersQuerySchema) {}
export class OfferPageDto extends createZodDto(offerPageSchema) {}
export class OfferArchiveQueryDto extends createZodDto(offerArchiveQuerySchema) {}
export class OfferArchiveDto extends createZodDto(offerArchiveSchema) {}
export class BonusCodesQueryDto extends createZodDto(bonusCodesQuerySchema) {}
export class BonusCodeListDto extends createZodDto(bonusCodeListSchema) {}
export class BonusCodeDto extends createZodDto(bonusCodeSchema) {}
export class BonusCodeReportDto extends createZodDto(bonusCodeReportSchema) {}
export class NewsQueryDto extends createZodDto(newsQuerySchema) {}
export class NewsPageDto extends createZodDto(newsPageSchema) {}
