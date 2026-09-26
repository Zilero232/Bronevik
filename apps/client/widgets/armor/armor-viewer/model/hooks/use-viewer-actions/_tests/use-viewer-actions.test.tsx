import type { ReactNode } from 'react';

import { act, renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import type { ViewerHandles } from '../../../viewer.types';

import { ARMOR_CANVAS } from '../../../../config';
import { useViewerActions } from '../use-viewer-actions';

const SLUG = 'object-140';
const IMAGE = 'data:image/png;base64,AAAA';

const writeText = vi.fn<(text: string) => Promise<void>>();
const share = vi.fn<(data: ShareData) => Promise<void>>();

const wrapper = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
    {children}
  </NextIntlClientProvider>
);

const handlesFor = (capture: () => string) => {
  const handles: ViewerHandles = { capture, orbit: () => undefined };

  return { current: handles };
};

const renderActions = (capture: () => string = () => IMAGE) =>
  renderHook(() => useViewerActions({ slug: SLUG, handles: handlesFor(capture) }), { wrapper }).result.current;

beforeEach(() => {
  writeText.mockResolvedValue(undefined);
  share.mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
});

afterEach(() => {
  vi.restoreAllMocks();
  writeText.mockReset();
  share.mockReset();
  Reflect.deleteProperty(navigator, 'clipboard');
  Reflect.deleteProperty(navigator, 'share');
});

describe('useViewerActions', () => {
  it('downloads the captured frame under the tank name and confirms it', () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const saved = vi.spyOn(toast, 'success');
    const { screenshot } = renderActions();

    screenshot();

    const link = click.mock.contexts[0];

    expect(link).toBeInstanceOf(HTMLAnchorElement);
    expect(link instanceof HTMLAnchorElement && link.download).toBe(`${SLUG}-${ARMOR_CANVAS.screenshotName}.png`);
    expect(link instanceof HTMLAnchorElement && link.href).toBe(IMAGE);
    expect(saved).toHaveBeenCalledWith(messages.en.armor.controls.screenshotSaved);
  });

  it('does nothing when the canvas gives no frame', () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const saved = vi.spyOn(toast, 'success');
    const { screenshot } = renderActions(() => '');

    screenshot();

    expect(click).not.toHaveBeenCalled();
    expect(saved).not.toHaveBeenCalled();
  });

  it('uses the native share sheet when the browser has one', async () => {
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    const copied = vi.spyOn(toast, 'success');
    const actions = renderActions();

    await act(() => actions.share());

    expect(share).toHaveBeenCalledWith(expect.objectContaining({ url: window.location.href }));
    expect(writeText).not.toHaveBeenCalled();
    expect(copied).not.toHaveBeenCalled();
  });

  it('stays quiet when the user dismisses the share sheet', async () => {
    share.mockRejectedValue(new DOMException('cancelled', 'AbortError'));
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    const actions = renderActions();

    await expect(act(() => actions.share())).resolves.toBeUndefined();
  });

  it('copies the link instead when sharing is not supported', async () => {
    const copied = vi.spyOn(toast, 'success');
    const actions = renderActions();

    await act(() => actions.share());

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(copied).toHaveBeenCalledWith(messages.en.armor.controls.shareCopied);
  });
});
