import { UI_BUILD } from '../vite.constants';

export const scopedClassName = (name: string, filename: string): string => {
  const file = filename.split('?')[0]?.split(/[/\\]/).pop() ?? filename;

  return `${UI_BUILD.style.classPrefix}-${file.replace(/\.module\.scss$/, '')}__${name}`;
};
