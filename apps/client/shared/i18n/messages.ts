import type { Locale } from './locale';

import developersEn from './locales/areas/developers.en.json';
import developersRu from './locales/areas/developers.ru.json';
import notificationsEn from './locales/areas/notifications.en.json';
import notificationsRu from './locales/areas/notifications.ru.json';
import plusEn from './locales/areas/plus.en.json';
import plusRu from './locales/areas/plus.ru.json';
import streamersEn from './locales/areas/streamers.en.json';
import streamersRu from './locales/areas/streamers.ru.json';
import telegramEn from './locales/areas/telegram.en.json';
import telegramRu from './locales/areas/telegram.ru.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

const ruMessages = { ...ru, ...developersRu, ...plusRu, ...notificationsRu, ...telegramRu, ...streamersRu };

const enMessages = { ...en, ...developersEn, ...plusEn, ...notificationsEn, ...telegramEn, ...streamersEn };

export type Messages = typeof ruMessages;

export const messages: Record<Locale, Messages> = { ru: ruMessages, en: enMessages };
