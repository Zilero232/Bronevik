import type { BillingStatus, PaymentHistoryItem } from '@otmetki/schemas';

import type { Prisma } from '../../../generated';
import type { PrismaService } from '../../core';
import type { PlusPlan } from './lib';

type PrismaExecutor = Prisma.TransactionClient | PrismaService;

type SavedMethod = {
  id: string;
  title: string | null;
};

export type ActivateInput = {
  db: PrismaExecutor;
  userId: string;
  plan: PlusPlan;
  method: SavedMethod | null;
  now: Date;
};

export type GrantDaysInput = {
  db: PrismaExecutor;
  userId: string;
  days: number;
  now: Date;
};

export type CheckoutInput = {
  userId: string;
  plan: PlusPlan;
  promoCode?: string;
};

export type CheckoutResult = {
  confirmationUrl: string;
  paymentId: string;
};

export type PromoCodeInput = {
  userId: string;
  code: string;
};

export type RecordRedemptionInput = PromoCodeInput & {
  db: PrismaExecutor;
};

export type RegisterReferralInput = {
  userId: string;
  referrerId: string;
};

export type RewardReferralInput = {
  db: PrismaExecutor;
  userId: string;
  now: Date;
};

export type { BillingStatus, PaymentHistoryItem };

export type SetAutoRenewInput = {
  userId: string;
  isEnabled: boolean;
};

export type WebhookRequest = {
  ip?: string;
  socket?: { remoteAddress?: string };
};
