import type { PanelHtmlInput } from './panel-html.types';

import { PANEL_SCRIPT, PANEL_STYLE, TWITCH_PANEL } from '../../config';

const escapeHtml = (text: string): string => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export const panelHtml = ({ apiUrl, locale, copy }: PanelHtmlInput): string => {
  const config = JSON.stringify({ apiUrl: apiUrl.replace(/\/$/u, ''), locale, copy, refreshMs: TWITCH_PANEL.refreshMs });

  return [
    '<!doctype html>',
    `<html lang="${locale === 'en' ? 'en' : 'ru'}">`,
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(copy.title)}</title>`,
    `<style>${PANEL_STYLE}</style>`,
    `<script src="${TWITCH_PANEL.helperScript}"></script>`,
    '</head>',
    '<body>',
    `<main id="panel" aria-live="polite" data-config="${escapeHtml(config)}"></main>`,
    `<script>${PANEL_SCRIPT}</script>`,
    '</body>',
    '</html>'
  ].join('');
};
