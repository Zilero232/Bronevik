import { describe, expect, it } from 'vitest';

import { ROUTES, SITE_FOOTER_GROUPS, SITE_NAV } from '@/shared/constants';

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
  it('maps detail pages to their section and group', () => {
    expect(activeSiteNav(ROUTES.tanks.detail('is-7'))).toEqual({ href: ROUTES.tanks.catalog, groupKey: 'vehicles' });
    expect(activeSiteNav(ROUTES.tanks.list)).toEqual({ href: ROUTES.tanks.list, groupKey: 'vehicles' });
    expect(activeSiteNav(ROUTES.players.profile('Nick'))).toEqual({ href: ROUTES.players.list, groupKey: 'players' });
    expect(activeSiteNav(ROUTES.competitions.detail('spring'))).toEqual({ href: ROUTES.tournaments.list, groupKey: 'community' });
    expect(activeSiteNav(ROUTES.play.guessTank)).toEqual({ href: ROUTES.play.hub, groupKey: 'community' });
  });

  it('maps streamer pages to the streamer directory', () => {
    expect(activeSiteNav(ROUTES.streamers.profile('nick'))).toEqual({ href: ROUTES.streamers.list, groupKey: 'community' });
    expect(activeSiteNav(ROUTES.streamers.settings.table)).toEqual({ href: ROUTES.streamers.list, groupKey: 'community' });
    expect(activeSiteNav(ROUTES.streamers.forStreamers)).toEqual({ href: null, groupKey: null });
  });

  it('maps every social tab to the competitions hub', () => {
    [ROUTES.social.feed, ROUTES.social.leagues, ROUTES.social.challenges].forEach((pathname) =>
      expect(activeSiteNav(pathname)).toEqual({ href: ROUTES.social.leagues, groupKey: 'community' })
    );
  });

  it('leaves account pages unmarked', () => {
    expect(activeSiteNav(ROUTES.account.billing)).toEqual({ href: null, groupKey: null });
  });
});

describe('SITE_NAV', () => {
  const menuHrefs = [...SITE_NAV.groups.flatMap((group) => group.items.map((item) => item.href)), SITE_NAV.tools.href, SITE_NAV.plus.href];

  it('keeps at most six top-level entries', () => {
    expect(SITE_NAV.groups.length + 1).toBeLessThanOrEqual(6);
  });

  it('keeps every group at seven links or fewer', () => {
    SITE_NAV.groups.forEach((group) => expect(group.items.length).toBeLessThanOrEqual(7));
  });

  it('lists every route exactly once', () => {
    expect(new Set(menuHrefs).size).toBe(menuHrefs.length);
  });

  it('keeps project pages out of the header menu', () => {
    [ROUTES.developers, ROUTES.design, ROUTES.pulse, ROUTES.streamers.forStreamers, '/competitions'].forEach((href) =>
      expect(menuHrefs).not.toContain(href)
    );
  });

  it('gives the footer only pages the header does not list, besides tools and plus', () => {
    const footerOnly = SITE_FOOTER_GROUPS.flatMap((group) => group.items.map((item) => item.href)).filter(
      (href) => href !== SITE_NAV.tools.href && href !== SITE_NAV.plus.href
    );

    footerOnly.forEach((href) => expect(menuHrefs).not.toContain(href));
  });
});
