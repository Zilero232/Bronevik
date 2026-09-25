import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgressRing } from '../ProgressRing';

describe('ProgressRing', () => {
  it('is an accessible progress bar named by its label', () => {
    render(<ProgressRing label='Прогресс отметки' max={100} value={42} />);

    const ring = screen.getByRole('progressbar', { name: 'Прогресс отметки' });

    expect(ring).toHaveAttribute('aria-valuenow', '42');
    expect(ring).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders its content in the middle and sizes itself', () => {
    render(
      <ProgressRing label='Мастер' size={72} value={42}>
        42
      </ProgressRing>
    );

    const ring = screen.getByRole('progressbar');

    expect(ring).toHaveTextContent('42');
    expect(ring).toHaveStyle({ width: '72px', height: '72px' });
  });
});
