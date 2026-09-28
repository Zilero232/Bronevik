export type LocalizedTextInput<T extends string | null> = {
  locale: string;
  text: T;
  english: string | null | undefined;
};
