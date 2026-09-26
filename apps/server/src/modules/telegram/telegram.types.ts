import type { I18nFlavor } from '@grammyjs/i18n';
import type { Context } from 'grammy';

import type { NotificationChannel, NotificationEvent, NotificationSettings, Prisma } from '../../../generated';
import type { BOT } from './config';

export type BotLocale = (typeof BOT.locales)[number];

export type LinkedChat = {
  userId: string;
  telegramId: bigint;
  accountId: bigint | null;
  nickname: string | null;
  locale: BotLocale;
};

type ChatFlavor = {
  chat$: LinkedChat | null;
};

export type BotContext = Context & I18nFlavor & ChatFlavor;

type BotHandler = (ctx: BotContext) => Promise<void>;

export type BotCommandSpec = {
  command: string;
  run: BotHandler;
};

export type TelegramIdentity = {
  telegramId: bigint;
  username: string | null;
  name: string;
  languageCode: string | null;
};

export type ConsumeLinkCodeInput = {
  code: string;
  identity: TelegramIdentity;
};

export type IssuedLinkCode = {
  code: string;
  expiresAt: string;
  deepLink: string | null;
};

export type TelegramStatus = {
  isLinked: boolean;
  username: string | null;
  botUsername: string | null;
};

export type SendNotificationInput = {
  telegramId: bigint;
  locale: BotLocale;
  title: string;
  body: string;
  url: string | null;
};

export type SendTextInput = {
  telegramId: bigint;
  text: string;
};

export type PlayerCard = {
  accountId: bigint;
  nickname: string;
  battles: number;
  winRate: number | null;
  avgDamage: number | null;
  wn8: number | null;
  clanTag: string | null;
};

export type SessionCard = {
  battles: number;
  wins: number;
  avgDamage: number;
  wn8: number | null;
  startedAt: Date;
  isOpen: boolean;
};

type MarkLine = {
  tankName: string;
  marks: number;
  percent: number;
};

export type MarksCard = {
  moe3: number;
  moe2: number;
  moe1: number;
  closest: MarkLine[];
};

export type ClanCard = {
  tag: string;
  name: string;
  membersCount: number;
  role: string;
};

export type TankCard = {
  tankId: number;
  name: string;
  tier: number;
  type: string;
  slug: string;
  moe: { p65: number; p85: number; p95: number } | null;
};

export type TopLine = {
  nickname: string;
  wn8: number;
  battles: number;
};

export type LinkUrlInput = {
  webUrl: string;
  path: string;
};

export type PlayerUrlInput = {
  webUrl: string;
  nickname: string;
};

export type StatCardUrlInput = {
  webUrl: string;
  accountId: bigint;
};

export type FindTanksInput<T> = {
  entries: readonly T[];
  query: string;
  limit: number;
  names: (entry: T) => readonly string[];
};

export type TxUserInput = {
  tx: Prisma.TransactionClient;
  userId: string;
};

export type GuardInput = {
  ctx: BotContext;
  run: () => Promise<void>;
};

export type ConsumeInput = {
  ctx: BotContext;
  identity: TelegramIdentity;
  code: string;
};

export type PlayerTextInput = {
  ctx: BotContext;
  card: PlayerCard;
};

export type SettingsSnapshot = Pick<NotificationSettings, 'channels' | 'events' | 'weeklyDigest'>;

export type MenuLabelInput = {
  isOn: boolean;
  text: string;
};

export type ToggleChannelInput = {
  userId: string;
  channel: NotificationChannel;
};

export type ToggleEventInput = {
  userId: string;
  event: NotificationEvent;
};

export type SaveSettingsInput = {
  userId: string;
  data: Partial<SettingsSnapshot>;
};
