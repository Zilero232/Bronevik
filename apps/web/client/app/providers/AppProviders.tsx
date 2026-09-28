'use client';

import { SerwistProvider } from '@serwist/turbopack/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { RatingPaletteSync } from '@/features/app/rating-palette';
import { RatingPatternsSync } from '@/features/app/rating-patterns';
import { CommandPalette, CommandPaletteProvider } from '@/features/search/command-palette';
import { getQueryClient } from '@/shared/api';
import { env } from '@/shared/config';
import { ROUTES, STORAGE_KEYS } from '@/shared/constants';
import { FORMATS, messages, TIME_ZONE } from '@/shared/i18n';
import { AppToaster, TooltipProvider } from '@/ui-kit';

import type { AppProvidersProps } from './AppProviders.types';

import { THEME_SCRIPT_PROPS } from './config';

export const AppProviders = ({ children, locale }: AppProvidersProps) => (
  <NuqsAdapter>
    <QueryClientProvider client={getQueryClient()}>
      <NextIntlClientProvider formats={FORMATS} locale={locale} messages={messages[locale]} timeZone={TIME_ZONE}>
        <ThemeProvider
          disableTransitionOnChange
          attribute='data-theme'
          defaultTheme='dark'
          enableSystem={false}
          scriptProps={THEME_SCRIPT_PROPS}
          storageKey={STORAGE_KEYS.theme}
          themes={['dark', 'light']}
        >
          <MotionConfig reducedMotion='user'>
            <TooltipProvider>
              <CommandPaletteProvider>
                <SerwistProvider disable={env.NODE_ENV === 'development'} reloadOnOnline={false} swUrl={ROUTES.sw}>
                  {children}
                </SerwistProvider>
                <CommandPalette />
              </CommandPaletteProvider>
            </TooltipProvider>
            <RatingPatternsSync />
            <RatingPaletteSync />
            <AppToaster />
          </MotionConfig>
        </ThemeProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  </NuqsAdapter>
);
