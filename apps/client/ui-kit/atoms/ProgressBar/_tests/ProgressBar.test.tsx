import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('reports its value to assistive technology', () => {
    render(<ProgressBar label='Отметка' max={200} value={50} />);

    const bar = screen.getByRole('progressbar');

    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar).toHaveAttribute('aria-valuemax', '200');
  });

  it('shows the label and the formatted value', () => {
    render(<ProgressBar label='Отметка' value={87.4} valueLabel='87.4%' />);

    expect(screen.getByText('Отметка')).toBeInTheDocument();
    expect(screen.getByText('87.4%')).toBeInTheDocument();
  });

  it('exposes the tone for styling', () => {
    render(<ProgressBar tone='unicum' value={10} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('data-tone', 'unicum');
  });
});
