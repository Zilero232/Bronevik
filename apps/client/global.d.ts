import type { RowData } from '@tanstack/react-table';

import type { FORMATS, Locale, Messages } from '@/shared/i18n';

declare module 'next-intl' {
  // eslint-disable-next-line ts/consistent-type-definitions -- next-intl reads its typed config through interface merging
  interface AppConfig {
    Formats: typeof FORMATS;
    Locale: Locale;
    Messages: Messages;
  }
}

declare module 'react' {
  // eslint-disable-next-line ts/consistent-type-definitions -- CSS custom properties are added to React's CSSProperties by interface merging
  interface CSSProperties {
    [key: `--${string}`]: number | string | undefined;
  }
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line ts/consistent-type-definitions -- column meta is typed by interface merging and must keep the library's generics
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'center' | 'end' | 'start';
    isMedia?: boolean;
    isNumeric?: boolean;
    isSticky?: boolean;
    width?: number | string;
  }
}
