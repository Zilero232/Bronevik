import { describe, expect, it } from 'vitest';

import { toClassicScript } from '../classic-script';

const PAGE = [
  '<!doctype html>',
  '<html lang="ru">',
  '  <head>',
  '    <meta charset="UTF-8" />',
  '    <script type="module" crossorigin>(function(){var a=`$&`;})();</script>',
  '    <style rel="stylesheet" crossorigin>.a{color:red}</style>',
  '  </head>',
  '  <body>',
  '    <div id="root"></div>',
  '  </body>',
  '</html>'
].join('\n');

describe(toClassicScript, () => {
  it('drops the module type of the inlined script', () => {
    const html = toClassicScript(PAGE);

    expect(html).not.toContain('type="module"');
  });

  it('moves the inlined script, replacement patterns intact, to the end of the body', () => {
    const html = toClassicScript(PAGE);

    expect(html).toMatch(/<div id="root"><\/div>\n\s*<script>\(function\(\)\{var a=`\$&`;\}\)\(\);<\/script>\n\s*<\/body>/);
  });

  it('keeps the head styles where they are', () => {
    const html = toClassicScript(PAGE);

    expect(html).toContain('<style rel="stylesheet" crossorigin>.a{color:red}</style>\n  </head>');
  });

  it('leaves a page without a module script unchanged', () => {
    const page = '<html><body><div></div></body></html>';

    const html = toClassicScript(page);

    expect(html).toBe(page);
  });
});
