import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';

describe('Button', () => {
  it('defaults to type="button" so it cannot submit a surrounding form', () => {
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <Button>В бой</Button>
      </form>
    );

    fireEvent.click(screen.getByRole('button', { name: 'В бой' }));

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('gives every variant its own class', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;
    const { rerender } = render(<Button>Go</Button>);

    const classes = variants.map((variant) => {
      rerender(<Button variant={variant}>Go</Button>);

      return screen.getByRole('button').className;
    });

    expect(new Set(classes).size).toBe(variants.length);
  });

  it('merges a custom className instead of replacing the variant classes', () => {
    const { rerender } = render(<Button>Go</Button>);
    const base = screen.getByRole('button').className;

    rerender(<Button className='custom'>Go</Button>);

    const merged = screen.getByRole('button').className;

    expect(merged).toContain('custom');
    base.split(' ').forEach((token) => expect(merged).toContain(token));
  });

  it('does not fire onClick when disabled', () => {
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });
});
