import type { ReactElement } from 'react';

import { toRoman } from '@otmetki/icons';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { messages } from '@/shared/i18n';

import { TierNumeral } from '../TierNumeral';
import { TIER_NUMERAL } from '../TierNumeral.constants';

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

describe('TierNumeral', () => {
  it('writes the tier as a roman numeral with a spelled-out title', () => {
    renderWithIntl(<TierNumeral tier={8} />);

    expect(screen.getByTitle('Tier 8')).toHaveTextContent(toRoman(8));
  });

  it('marks only tiers from the top threshold as top tier', () => {
    renderWithIntl(
      <>
        <TierNumeral tier={TIER_NUMERAL.topFrom - 1} />
        <TierNumeral tier={TIER_NUMERAL.topFrom} />
      </>
    );

    expect(screen.getByTitle(`Tier ${TIER_NUMERAL.topFrom - 1}`)).toHaveAttribute('data-top', 'false');
    expect(screen.getByTitle(`Tier ${TIER_NUMERAL.topFrom}`)).toHaveAttribute('data-top', 'true');
  });

  it('draws the hex badge only in the hex variant', () => {
    const { container, rerender } = renderWithIntl(<TierNumeral tier={5} />);

    expect(container.querySelector('svg')).not.toBeInTheDocument();

    rerender(
      <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
        <TierNumeral tier={5} variant='hex' />
      </NextIntlClientProvider>
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(screen.getByTitle('Tier 5')).toHaveTextContent(toRoman(5));
  });
});
