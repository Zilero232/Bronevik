import type { TwitchPanel } from '@otmetki/schemas';

import type { PanelConfig, PanelWindow } from './panel-script.types';

export const runPanelScript = (): void => {
  const root = document.getElementById('panel');

  if (!root?.dataset.config) {
    return;
  }

  const config: PanelConfig = JSON.parse(root.dataset.config);
  const { copy } = config;
  const number = new Intl.NumberFormat(config.locale, { maximumFractionDigits: 0 });
  const percent = new Intl.NumberFormat(config.locale, { style: 'percent', maximumFractionDigits: 1 });

  const el = (tag: string, className = '', text?: string) => {
    const node = document.createElement(tag);

    node.className = className;

    if (text !== undefined) {
      node.textContent = text;
    }

    return node;
  };

  const stat = (label: string, value: string) => {
    const box = el('div', 'stat');

    box.append(el('span', 'stat-value', value), el('span', 'stat-label', label));

    return box;
  };

  const footer = () => el('p', 'note', copy.attribution);
  const fail = () => root.replaceChildren(el('p', 'empty', copy.error), footer());

  const sessionBlock = (session: TwitchPanel['session']) => {
    const block = el('section', 'block');

    block.append(el('h2', 'block-title', session?.isOpen ? copy.live : copy.session));

    if (!session || session.battles === 0) {
      block.append(el('p', 'empty', copy.noSession));

      return block;
    }

    const grid = el('div', 'grid');

    grid.append(
      stat(copy.battles, number.format(session.battles)),
      stat(copy.winRate, percent.format(session.wins / session.battles)),
      stat(copy.avgDamage, number.format(session.avgDamage)),
      stat('WN8', session.wn8 === null ? '—' : number.format(session.wn8))
    );

    block.append(grid);

    return block;
  };

  const marksBlock = (marks: TwitchPanel['marks']) => {
    const block = el('section', 'block');
    const counts = el('div', 'counts');

    counts.append(el('span', 'count', `3 × ${marks.moe3}`), el('span', 'count', `2 × ${marks.moe2}`), el('span', 'count', `1 × ${marks.moe1}`));
    block.append(el('h2', 'block-title', copy.marks), counts);

    if (marks.closest.length === 0) {
      block.append(el('p', 'empty', copy.noMarks));

      return block;
    }

    block.append(el('h2', 'block-title', copy.closest));

    for (const line of marks.closest) {
      const mark = el('div', 'mark');
      const row = el('div', 'mark-row');
      const bar = el('div', 'bar');
      const fill = el('span');

      row.append(el('span', '', line.tankName), el('strong', '', `${line.percent.toFixed(2)}%`));
      fill.style.width = `${Math.max(0, Math.min(100, line.percent))}%`;
      bar.append(fill);
      mark.append(row, bar);
      block.append(mark);
    }

    return block;
  };

  const render = (data: TwitchPanel) => {
    const head = el('header', 'head');
    const nodes = [head, sessionBlock(data.session), marksBlock(data.marks)];

    head.append(el('span', 'eyebrow', copy.title), el('strong', 'nick', data.nickname ?? copy.notConnected));

    if (data.profileUrl) {
      const link = Object.assign(document.createElement('a'), {
        className: 'open',
        textContent: copy.open,
        href: data.profileUrl,
        target: '_blank',
        rel: 'noreferrer'
      });

      nodes.push(link);
    }

    root.replaceChildren(...nodes, footer());
  };

  let channel = new URLSearchParams(window.location.search).get('channel');

  const load = () => {
    if (!channel) {
      fail();

      return;
    }

    fetch(`${config.apiUrl}/streamers/twitch-panel/${encodeURIComponent(channel)}`)
      .then((response): Promise<TwitchPanel> => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then(render)
      .catch(fail);
  };

  const panelWindow: PanelWindow = window;
  const ext = panelWindow.Twitch?.ext;

  if (ext) {
    ext.onContext((context) => {
      if (context.theme) {
        document.documentElement.dataset.theme = context.theme;
      }
    });

    ext.onAuthorized((auth) => {
      channel = auth.channelId;
      load();
    });
  } else {
    load();
  }

  window.setInterval(load, config.refreshMs);
};
