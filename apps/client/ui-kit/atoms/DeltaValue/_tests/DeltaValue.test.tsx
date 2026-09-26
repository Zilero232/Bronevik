import type { ReactElement } from 'react';

import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { FORMATS, messages } from '@/shared/i18n';
import { deltaVerdict } from '@/shared/lib';

import { DeltaValue } from '../DeltaValue';

const renderDelta = (ui: ReactElement) => {
  const { container } = render(
    <NextIntlClientProvider formats={FORMATS} locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

  const root = container.querySelector('[data-verdict]');

  if (!root) {
    throw new Error('DeltaValue did not render');
  }

  return root;
};

describe('DeltaValue', () => {
  it('shows a gain with a plus sign and a better verdict', () => {
    const root = renderDelta(<DeltaValue value={12} />);

    expect(root).toHaveTextContent('+12');
    expect(root).toHaveAttribute('data-verdict', 'better');
  });

  it('shows a loss with a minus sign and a worse verdict', () => {
    const root = renderDelta(<DeltaValue value={-3.5} />);

    expect(root.textContent).toMatch(/^[-−]3\.5$/);
    expect(root).toHaveAttribute('data-verdict', 'worse');
  });

  it('flips the verdict but keeps the sign when lower is better', () => {
    const root = renderDelta(<DeltaValue isLowerBetter value={-3} />);

    expect(root.textContent).toMatch(/^[-−]3$/);
    expect(root).toHaveAttribute('data-verdict', 'better');
  });

  it('agrees with deltaVerdict for every direction', () => {
    for (const value of [-1, 0, 1]) {
      for (const isLowerBetter of [false, true]) {
        const root = renderDelta(<DeltaValue isLowerBetter={isLowerBetter} value={value} />);

        expect(root).toHaveAttribute('data-verdict', deltaVerdict({ value, isLowerBetter }));
      }
    }
  });

  it('hides an unchanged value unless asked to show it', () => {
    expect(renderDelta(<DeltaValue value={0} />)).toBeEmptyDOMElement();
    expect(renderDelta(<DeltaValue isSameShown value={0} />)).toHaveTextContent('0');
  });

  it('shows zero without a sign when an explicit same verdict overrides a non-zero value', () => {
    const root = renderDelta(<DeltaValue isSameShown value={4} verdict='same' />);

    expect(root).toHaveTextContent(/^0$/);
    expect(root).toHaveAttribute('data-verdict', 'same');
  });

  it('appends the suffix to the formatted number', () => {
    expect(renderDelta(<DeltaValue suffix=' pp' value={2} />)).toHaveTextContent('+2 pp');
  });

  it('accepts inline number options and still signs the value', () => {
    expect(renderDelta(<DeltaValue format={{ maximumFractionDigits: 0 }} value={2.4} />)).toHaveTextContent('+2');
  });

  it('colours by the displayed value, so a change that rounds to zero stays neutral', () => {
    const root = renderDelta(<DeltaValue format={{ maximumFractionDigits: 1 }} value={0.01} />);

    expect(root).toHaveAttribute('data-verdict', 'same');
    expect(root).toBeEmptyDOMElement();
  });

  it('shows a dash rather than zero for a missing value', () => {
    const root = renderDelta(<DeltaValue isSameShown value={Number.NaN} />);

    expect(root).toHaveTextContent('—');
    expect(root).toHaveAttribute('data-verdict', 'same');
  });
});
