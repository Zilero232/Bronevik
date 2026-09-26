export const TWITCH_PANEL = {
  helperScript: 'https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js',
  refreshMs: 60_000,
  copyKeys: [
    'title',
    'session',
    'live',
    'noSession',
    'battles',
    'winRate',
    'avgDamage',
    'marks',
    'closest',
    'noMarks',
    'open',
    'notConnected',
    'error',
    'attribution'
  ]
} as const;

export const PANEL_STYLE = `
:root{color-scheme:dark;--bg:#111114;--panel:#18181d;--line:#2c2c32;--text:#ececf1;--dim:#9a9aa6;--accent:#d4b25a}
:root[data-theme=light]{color-scheme:light;--bg:#f6f6f8;--panel:#fff;--line:#dcdce2;--text:#16161a;--dim:#5e5e6a;--accent:#9c7a1f}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:13px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif}
#panel{display:flex;flex-direction:column;gap:10px;padding:12px}
.head{display:flex;flex-direction:column;gap:2px}
.eyebrow{color:var(--accent);font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
.nick{font-size:18px}
.block{display:flex;flex-direction:column;gap:8px;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--panel)}
.block-title{margin:0;color:var(--dim);font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.stat{display:flex;flex-direction:column}
.stat-value{font-size:16px;font-weight:700;font-variant-numeric:tabular-nums}
.stat-label{color:var(--dim);font-size:11px}
.counts{display:flex;gap:8px}
.count{flex:1;padding:6px;border-radius:6px;background:var(--bg);text-align:center}
.mark{display:flex;flex-direction:column;gap:4px}
.mark-row{display:flex;justify-content:space-between;gap:8px}
.bar{height:4px;border-radius:2px;background:var(--line);overflow:hidden}
.bar>span{display:block;height:100%;background:var(--accent)}
.empty{margin:0;color:var(--dim)}
.open{color:var(--accent);font-weight:600;text-decoration:none}
.note{margin:0;color:var(--dim);font-size:10px}
`;

export const PANEL_SCRIPT = `
(() => {
  const root = document.getElementById('panel');
  const config = JSON.parse(root.dataset.config);
  const copy = config.copy;
  const number = new Intl.NumberFormat(config.locale, { maximumFractionDigits: 0 });
  const percent = new Intl.NumberFormat(config.locale, { style: 'percent', maximumFractionDigits: 1 });
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const stat = (label, value) => {
    const box = el('div', 'stat');
    box.append(el('span', 'stat-value', value), el('span', 'stat-label', label));
    return box;
  };
  const footer = () => el('p', 'note', copy.attribution);
  const fail = () => root.replaceChildren(el('p', 'empty', copy.error), footer());
  const sessionBlock = (session) => {
    const block = el('section', 'block');
    block.append(el('h2', 'block-title', session && session.isOpen ? copy.live : copy.session));
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
  const marksBlock = (marks) => {
    const block = el('section', 'block');
    const counts = el('div', 'counts');
    counts.append(el('span', 'count', '3 × ' + marks.moe3), el('span', 'count', '2 × ' + marks.moe2), el('span', 'count', '1 × ' + marks.moe1));
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
      row.append(el('span', '', line.tankName), el('strong', '', line.percent.toFixed(2) + '%'));
      fill.style.width = Math.max(0, Math.min(100, line.percent)) + '%';
      bar.append(fill);
      mark.append(row, bar);
      block.append(mark);
    }
    return block;
  };
  const render = (data) => {
    const head = el('header', 'head');
    head.append(el('span', 'eyebrow', copy.title), el('strong', 'nick', data.nickname || copy.notConnected));
    const nodes = [head, sessionBlock(data.session), marksBlock(data.marks)];
    if (data.profileUrl) {
      const link = el('a', 'open', copy.open);
      link.href = data.profileUrl;
      link.target = '_blank';
      link.rel = 'noreferrer';
      nodes.push(link);
    }
    root.replaceChildren(...nodes, footer());
  };
  let channel = new URLSearchParams(location.search).get('channel');
  const load = () => {
    if (!channel) return fail();
    fetch(config.apiUrl + '/streamers/twitch-panel/' + encodeURIComponent(channel))
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then(render)
      .catch(fail);
  };
  const ext = window.Twitch && window.Twitch.ext;
  if (ext) {
    ext.onContext((context) => {
      if (context.theme) document.documentElement.dataset.theme = context.theme;
    });
    ext.onAuthorized((auth) => {
      channel = auth.channelId;
      load();
    });
  } else {
    load();
  }
  setInterval(load, config.refreshMs);
})();
`;
