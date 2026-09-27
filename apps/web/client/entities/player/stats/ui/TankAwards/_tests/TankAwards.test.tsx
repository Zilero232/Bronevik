import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { messages } from '@/shared/i18n';

import { TankAwards } from '../TankAwards';

const renderAwards = (props: { marksOnGun: number | null; markOfMastery: number }) =>
  render(
    <NextIntlClientProvider locale='ru' messages={messages.ru}>
      <TankAwards {...props} />
    </NextIntlClientProvider>
  );

describe('TankAwards', () => {
  it('shows the gun marks the tank carries', () => {
    const { container } = renderAwards({ marksOnGun: 3, markOfMastery: 0 });

    expect(container.querySelector('[data-marks="3"]')).not.toBeNull();
  });

  it('shows the mastery badge by its level', () => {
    const { container } = renderAwards({ marksOnGun: null, markOfMastery: 4 });

    expect(container.querySelector('[data-level="master"]')).not.toBeNull();
  });

  it('keeps the slots but draws nothing for a tank without awards', () => {
    const { container } = renderAwards({ marksOnGun: 0, markOfMastery: 0 });

    expect(container.querySelector('[data-marks]')).toBeNull();
    expect(container.querySelector('[data-level]')).toBeNull();
  });
});
