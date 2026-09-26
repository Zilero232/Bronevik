import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProgressRing } from '../ProgressRing';

const LOCALE = 'ru';

vi.mock('next-intl', () => ({ useLocale: () => LOCALE }));

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

describe('ProgressRing arc', () => {
  const arcOf = (container: HTMLElement) => container.querySelector('[data-ratio]');

  it('clamps an overfull value to a full ring', () => {
    const { container } = render(<ProgressRing max={100} value={140} />);

    expect(arcOf(container)).toHaveAttribute('stroke-dasharray', '1 1');
  });

  it('clamps a negative value and a zero max to an empty ring', () => {
    const { container, rerender } = render(<ProgressRing max={100} value={-5} />);

    expect(arcOf(container)).toHaveAttribute('stroke-dasharray', '0 1');

    rerender(<ProgressRing max={0} value={10} />);

    expect(arcOf(container)).toHaveAttribute('stroke-dasharray', '0 1');
  });

  it('colours the arc by the mark count', () => {
    render(<ProgressRing label='Отметка' marks={2} value={50} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('data-marks', '2');
  });
});
