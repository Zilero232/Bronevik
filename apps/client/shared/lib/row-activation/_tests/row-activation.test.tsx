import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { rowActivation } from '../row-activation';

const renderRow = (props: ReturnType<typeof rowActivation>) =>
  render(
    <table>
      <tbody>
        <tr data-testid='row' {...props}>
          <td>
            <button type='button'>inner</button>
          </td>
        </tr>
      </tbody>
    </table>
  );

describe('rowActivation', () => {
  it('activates a clickable row from the keyboard', () => {
    const onActivate = vi.fn();

    renderRow(rowActivation({ onActivate, isLinked: false }));

    const row = screen.getByTestId('row');

    expect(row).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(row, { key: 'Enter' });
    fireEvent.keyDown(row, { key: ' ' });
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });

    expect(onActivate).toHaveBeenCalledTimes(2);
  });

  it('ignores clicks on controls inside the row', () => {
    const onActivate = vi.fn();

    renderRow(rowActivation({ onActivate, isLinked: false }));
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('cell'));

    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('leaves keyboard access to the link of a linked row', () => {
    renderRow(rowActivation({ onActivate: vi.fn(), isLinked: true }));

    expect(screen.getByTestId('row')).not.toHaveAttribute('tabindex');
  });
});
