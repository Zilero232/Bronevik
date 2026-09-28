import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useIsCrawler } from '@/shared/lib';

const SEARCH_BOT = 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)';
const BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';

describe('useIsCrawler', () => {
  it('recognises a search engine crawler', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(SEARCH_BOT);

    expect(renderHook(() => useIsCrawler()).result.current).toBe(true);
  });

  it('treats a regular browser as a person', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(BROWSER);

    expect(renderHook(() => useIsCrawler()).result.current).toBe(false);
  });
});
