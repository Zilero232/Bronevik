import { createZodDto } from 'nestjs-zod';

import {
  coachesQuerySchema,
  coachingOrderListSchema,
  coachingOrderSchema,
  coachOfferSchema,
  coachPageSchema,
  coachSchema,
  createOfferSchema,
  createOrderSchema,
  reviewOrderSchema,
  updateOfferSchema,
  upsertCoachSchema
} from './coaching.schemas';

export class CoachOfferDto extends createZodDto(coachOfferSchema) {}
export class CoachDto extends createZodDto(coachSchema) {}
export class CoachesQueryDto extends createZodDto(coachesQuerySchema) {}
export class CoachPageDto extends createZodDto(coachPageSchema) {}
export class UpsertCoachDto extends createZodDto(upsertCoachSchema) {}
export class CreateOfferDto extends createZodDto(createOfferSchema) {}
export class UpdateOfferDto extends createZodDto(updateOfferSchema) {}
export class CoachingOrderDto extends createZodDto(coachingOrderSchema) {}
export class CoachingOrderListDto extends createZodDto(coachingOrderListSchema) {}
export class CreateOrderDto extends createZodDto(createOrderSchema) {}
export class ReviewOrderDto extends createZodDto(reviewOrderSchema) {}
