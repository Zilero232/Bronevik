import type { ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { messages } from '@/shared/i18n';

import { NationLabel } from '../NationLabel';

const NATION = 'germany';
const NATION_NAME = messages.en.game.nations[NATION];

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

describe('NationLabel', () => {
  it('names a known nation in the current locale', () => {
    renderWithIntl(<NationLabel nation={NATION} />);

    expect(screen.getByText(NATION_NAME)).toBeInTheDocument();
  });

  it('keeps the name accessible through the flag title when the text is hidden', () => {
    renderWithIntl(<NationLabel nation={NATION} withName={false} />);

    expect(screen.queryByText(NATION_NAME, { selector: 'span' })).not.toBeInTheDocument();
    expect(screen.getByTitle(NATION_NAME)).toBeInTheDocument();
  });

  it('falls back to the raw code for an unknown nation', () => {
    renderWithIntl(<NationLabel nation='atlantis' />);

    expect(screen.getByText('atlantis')).toBeInTheDocument();
  });
});
