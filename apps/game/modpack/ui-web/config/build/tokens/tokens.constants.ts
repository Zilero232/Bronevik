export const TOKENS = {
  themeSelectors: new Set<string>([':root', ":root, [data-theme='dark']"]),
  declaration: /(--[\w-]+):([^;]+);/g,
  variable: /var\((--[\w-]+)\)/g,
  modernRgb: /rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+%?)\s*\)/g,
  pixels: /(\d+(?:\.\d+)?|\.\d+)px\b/g,
  maxDepth: 8
} as const;
