import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it } from 'vitest';

import { CompareToggle, useCompareSelection } from '@/features/compare/compare-selection';
import { messages } from '@/shared/i18n';

const PLAYER = { kind: 'player', item: { accountId: 7, nickname: 'Seven' } } as const;

const Count = () => {
  const selection = useCompareSelection();

  return <output>{selection === null ? 'none' : selection.player.length}</output>;
};

const renderToggles = () =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en}>
      <CompareToggle entry={PLAYER} />
      <CompareToggle entry={PLAYER} variant='button' />
      <Count />
    </NextIntlClientProvider>
  );

afterEach(() => {
  window.localStorage.clear();
});

describe('CompareToggle', () => {
  it('adds and removes an entry, and every toggle of it follows the one store', () => {
    renderToggles();

    const icon = screen.getByRole('button', { name: messages.en.compareTray.toggle.add.replace('{name}', 'Seven') });

    fireEvent.click(icon);

    expect(screen.getByRole('status')).toHaveTextContent('1');
    expect(screen.getAllByRole('button', { pressed: true })).toHaveLength(2);
    expect(screen.getByText(messages.en.compareTray.toggle.buttonOn)).toBeInTheDocument();

    fireEvent.click(screen.getByText(messages.en.compareTray.toggle.buttonOn));

    expect(screen.getByRole('status')).toHaveTextContent('0');
  });
});
