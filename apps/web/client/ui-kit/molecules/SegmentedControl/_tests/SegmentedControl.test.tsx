import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SegmentedControl } from '../SegmentedControl';

const OPTIONS = [
  { value: '24h', label: '24 ч' },
  { value: '7d', label: '7 дн' },
  { value: '30d', label: '30 дн' }
] as const;

describe('SegmentedControl', () => {
  it('marks exactly the selected option as checked', () => {
    render(<SegmentedControl aria-label='Период' options={OPTIONS} value='7d' onChange={vi.fn()} />);

    const checked = screen.getAllByRole('radio').filter((radio) => radio.getAttribute('aria-checked') === 'true');

    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveTextContent('7 дн');
  });

  it('reports the clicked option', () => {
    const onChange = vi.fn();

    render(<SegmentedControl aria-label='Период' options={OPTIONS} value='24h' onChange={onChange} />);

    fireEvent.click(screen.getByRole('radio', { name: '30 дн' }));

    expect(onChange).toHaveBeenCalledWith('30d', expect.anything());
  });

  it('moves the selection with the arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SegmentedControl aria-label='Период' options={OPTIONS} value='7d' onChange={onChange} />);

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('radio', { name: '30 дн' })).toHaveFocus();
    expect(onChange).toHaveBeenCalledWith(OPTIONS[2].value, expect.anything());
  });

  it('keeps only the active option in the tab order', () => {
    render(<SegmentedControl aria-label='Период' options={OPTIONS} value='7d' onChange={vi.fn()} />);

    const tabbable = screen.getAllByRole('radio').filter((radio) => radio.tabIndex === 0);

    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toHaveTextContent('7 дн');
  });
});
