import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../../common/decorators';
import {
  CheckoutDto,
  CoachDto,
  CoachesQueryDto,
  CoachingOrderDto,
  CoachingOrderListDto,
  CoachOfferDto,
  CoachPageDto,
  CreateOfferDto,
  CreateOrderDto,
  IdParamsDto,
  ReviewOrderDto,
  UpdateOfferDto,
  UpsertCoachDto
} from '../dto';
import { CoachingService } from '../services';

@ApiTags('community')
@Controller('community/coaching')
export class CoachingController {
  constructor(private readonly coaching: CoachingService) {}

  @AllowAnonymous()
  @Get('coaches')
  @ZodResponse({ type: CoachPageDto })
  list(@Query() query: CoachesQueryDto) {
    return this.coaching.list(query);
  }

  @AllowAnonymous()
  @Get('coaches/:id')
  @ZodResponse({ type: CoachDto })
  coach(@Param() { id }: IdParamsDto) {
    return this.coaching.get(id);
  }

  @Put('profile')
  @ZodResponse({ type: CoachDto })
  upsertProfile(@CurrentUserId() userId: string, @Body() body: UpsertCoachDto) {
    return this.coaching.upsertProfile({ ...body, userId });
  }

  @Post('offers')
  @ZodResponse({ type: CoachOfferDto, status: HttpStatus.CREATED })
  createOffer(@CurrentUserId() userId: string, @Body() body: CreateOfferDto) {
    return this.coaching.createOffer({ ...body, userId });
  }

  @Patch('offers/:id')
  @ZodResponse({ type: CoachOfferDto })
  updateOffer(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto, @Body() body: UpdateOfferDto) {
    return this.coaching.updateOffer({ ...body, id, userId });
  }

  @Get('orders')
  @ZodResponse({ type: CoachingOrderListDto })
  orders(@CurrentUserId() userId: string) {
    return this.coaching.orders(userId);
  }

  @Post('orders')
  @ZodResponse({ type: CoachingOrderDto, status: HttpStatus.CREATED })
  order(@CurrentUserId() userId: string, @Body() body: CreateOrderDto) {
    return this.coaching.order({ ...body, userId });
  }

  @Post('orders/:id/accept')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: CoachingOrderDto })
  accept(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    return this.coaching.accept({ id, userId });
  }

  @Post('orders/:id/pay')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: CheckoutDto })
  pay(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    return this.coaching.checkout({ id, userId });
  }

  @Post('orders/:id/confirm-payment')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: CoachingOrderDto })
  confirm(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    return this.coaching.confirmPayment({ id, userId });
  }

  @Post('orders/:id/complete')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: CoachingOrderDto })
  complete(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    return this.coaching.complete({ id, userId });
  }

  @Post('orders/:id/cancel')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: CoachingOrderDto })
  cancel(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    return this.coaching.cancel({ id, userId });
  }

  @Post('orders/:id/review')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: CoachingOrderDto })
  review(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto, @Body() body: ReviewOrderDto) {
    return this.coaching.review({ ...body, id, userId });
  }
}
