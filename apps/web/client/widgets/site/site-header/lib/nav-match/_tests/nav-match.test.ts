import { describe, expect, it } from 'vitest';

import { ROUTES, SITE_FOOTER_COLUMNS, SITE_HUB_GROUPS, SITE_LINKS, SITE_NAV, SITE_NAV_GROUPS } from '@/shared/constants';

import { activeNavHref, activeSiteNav, isNavHrefMatch } from '../nav-match';

describe('isNavHrefMatch', () => {
  it('matches the exact path and nested paths on a segment boundary', () => {
    expect(isNavHrefMatch({ href: ROUTES.tanks.list, pathname: ROUTES.tanks.list })).toBe(true);
    expect(isNavHrefMatch({ href: ROUTES.tanks.list, pathname: ROUTES.tanks.compare })).toBe(true);
    expect(isNavHrefMatch({ href: ROUTES.top, pathname: ROUTES.tournaments.list })).toBe(false);
  });
});

describe('activeNavHref', () => {
  it('prefers the longest matching link', () => {
    expect(activeNavHref({ hrefs: [ROUTES.tanks.list, ROUTES.tanks.compare], pathname: ROUTES.tanks.compare })).toBe(ROUTES.tanks.compare);
    expect(activeNavHref({ hrefs: [ROUTES.tanks.list, ROUTES.tanks.compare], pathname: ROUTES.tanks.list })).toBe(ROUTES.tanks.list);
  });

  it('returns null when nothing matches', () => {
    expect(activeNavHref({ hrefs: [ROUTES.tanks.list], pathname: ROUTES.account.overview })).toBeNull();
  });
});

describe('activeSiteNav', () => {
  it('maps detail pages to their section and menu entry', () => {
    expect(activeSiteNav(ROUTES.tanks.detail('is-7'))).toEqual({ href: ROUTES.tanks.catalog, entryKey: 'vehicles' });
    expect(activeSiteNav(ROUTES.tanks.list)).toEqual({ href: ROUTES.tanks.list, entryKey: 'vehicles' });
    expect(activeSiteNav(ROUTES.players.profile('Nick'))).toEqual({ href: ROUTES.players.list, entryKey: 'players' });
    expect(activeSiteNav(ROUTES.clans.detail('TAG'))).toEqual({ href: ROUTES.clans.list, entryKey: 'players' });
    expect(activeSiteNav(ROUTES.competitions.detail('spring'))).toEqual({ href: ROUTES.tournaments.list, entryKey: 'community' });
  });

  it('marks a direct link as its own menu entry', () => {
    expect(activeSiteNav(ROUTES.marks)).toEqual({ href: ROUTES.marks, entryKey: 'marks' });
    expect(activeSiteNav(ROUTES.modProfile)).toEqual({ href: ROUTES.mod, entryKey: 'mod' });
  });

  it('maps streamer pages to the streamer directory', () => {
    expect(activeSiteNav(ROUTES.streamers.profile('nick'))).toEqual({ href: ROUTES.streamers.list, entryKey: 'community' });
    expect(activeSiteNav(ROUTES.streamers.settings.table)).toEqual({ href: ROUTES.streamers.list, entryKey: 'community' });
    expect(activeSiteNav(ROUTES.streamers.forStreamers)).toEqual({ href: null, entryKey: null });
  });

  it('maps every social tab to the competitions hub', () => {
    [ROUTES.social.feed, ROUTES.social.leagues, ROUTES.social.challenges].forEach((pathname) =>
      expect(activeSiteNav(pathname)).toEqual({ href: ROUTES.social.leagues, entryKey: 'community' })
    );
  });

  it('leaves account and hub-only pages without a menu entry', () => {
    expect(activeSiteNav(ROUTES.account.billing)).toEqual({ href: null, entryKey: null });
    expect(activeSiteNav(ROUTES.hub)).toEqual({ href: ROUTES.hub, entryKey: null });
    expect(activeSiteNav(ROUTES.platoons)).toEqual({ href: null, entryKey: null });
  });
});

describe('SITE_NAV', () => {
  const menuHrefs = SITE_NAV.menu.flatMap((entry) => ('items' in entry ? entry.items.map((item) => item.href) : [entry.href]));
  const hubHrefs = SITE_HUB_GROUPS.flatMap((group) => group.items.map((item) => item.href));

  it('keeps at most six top-level entries', () => {
    expect(SITE_NAV.menu.length).toBeLessThanOrEqual(6);
  });

  it('keeps every dropdown at five links or fewer', () => {
    SITE_NAV_GROUPS.forEach((group) => expect(group.items.length).toBeLessThanOrEqual(5));
  });

  it('lists every header route exactly once', () => {
    expect(new Set(menuHrefs).size).toBe(menuHrefs.length);
  });

  it('keeps project pages out of the header menu', () => {
    [ROUTES.developers, ROUTES.design, ROUTES.pulse, ROUTES.streamers.forStreamers, '/competitions'].forEach((href) =>
      expect(menuHrefs).not.toContain(href)
    );
  });

  it('puts every section on the hub exactly once', () => {
    const sections = Object.values(SITE_LINKS)
      .map(({ href }) => href)
      .filter((href) => href !== ROUTES.hub);

    expect(new Set(hubHrefs).size).toBe(hubHrefs.length);
    expect([...hubHrefs].sort()).toEqual([...sections].sort());
  });

  it('keeps every header link reachable from the hub and the footer', () => {
    const footerHrefs = SITE_FOOTER_COLUMNS.flatMap((group) => group.items.map((item) => item.href));

    menuHrefs.forEach((href) => expect(hubHrefs).toContain(href));
    expect(footerHrefs).toContain(ROUTES.hub);
  });
});
