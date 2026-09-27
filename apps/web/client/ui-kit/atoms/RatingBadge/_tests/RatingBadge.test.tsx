import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RATING_TONES } from '@/shared/lib';

import { RatingBadge } from '../RatingBadge';

const litPips = (container: HTMLElement) => container.querySelectorAll('[data-on="true"]').length;

describe('RatingBadge', () => {
  it('exposes the tone for pattern and colour styling', () => {
    render(<RatingBadge tone='great' value='2 455' />);

    expect(screen.getByText('2 455').closest('[data-tone]')).toHaveAttribute('data-tone', 'great');
  });

  it('lights one more pip for every tone up the scale, so the level reads without colour', () => {
    const counts = RATING_TONES.map((tone) => {
      const { container, unmount } = render(<RatingBadge tone={tone} value='1' />);
      const count = litPips(container);

      unmount();

      return count;
    });

    counts.forEach((count, index) => expect(count).toBe(index + 1));
  });

  it('hides the pips when asked', () => {
    const { container } = render(<RatingBadge tone='unicum' value='1' withPips={false} />);

    expect(litPips(container)).toBe(0);
  });
});
