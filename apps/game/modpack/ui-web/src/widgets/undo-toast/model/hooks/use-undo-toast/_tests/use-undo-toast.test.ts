// @vitest-environment jsdom
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { $undo } from '../../../../../../entities/window-state';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { UNDO_TOAST } from '../../../../config';
import { useUndoToast } from '../use-undo-toast';

const entry = (id: number, label: string) => ({
  id,
  kind: label ? ('field' as const) : ('reset' as const),
  component: 'minimap',
  title: 'Миникарта',
  label,
  switchedOn: false,
  values: { zoom: 'native' }
});

const advance = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

const flush = () => advance(1);

beforeEach(() => {
  vi.useFakeTimers();
  $undo.set([]);
});

afterEach(() => {
  vi.useRealTimers();
});

describe(useUndoToast, () => {
  it('stays hidden until something changes', () => {
    expect(renderHook(useUndoToast).current().visible).toBe(false);
  });

  it('names the change, counts the undo steps and hides after a while', async () => {
    const hook = renderHook(useUndoToast);

    hook.run(() => $undo.set([entry(1, 'Масштаб'), entry(2, '')]));
    await flush();

    expect(hook.current()).toMatchObject({ visible: true, text: 'Миникарта: Сброшено к стандартным', undoLabel: 'Отменить (2)' });

    await advance(UNDO_TOAST.hideMs);

    expect(hook.current().visible).toBe(false);
  });

  it('comes back for the next change after a dismiss', async () => {
    const hook = renderHook(useUndoToast);

    hook.run(() => $undo.set([entry(1, 'Масштаб')]));
    await flush();
    hook.run(() => hook.current().dismiss());

    expect(hook.current().visible).toBe(false);

    hook.run(() => $undo.set([entry(1, 'Масштаб'), entry(2, 'Прозрачность')]));
    await flush();

    expect(hook.current()).toMatchObject({ visible: true, text: 'Миникарта: Прозрачность. Изменено' });
  });

  it('says whether a switch went on or off', async () => {
    const hook = renderHook(useUndoToast);

    hook.run(() => $undo.set([{ ...entry(1, 'Миникарта'), kind: 'switch', switchedOn: false }]));
    await flush();

    expect(hook.current().text).toBe('Миникарта: Выкл');
  });
});
