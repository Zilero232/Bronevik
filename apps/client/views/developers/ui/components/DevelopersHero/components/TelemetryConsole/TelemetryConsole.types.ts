export type ConsoleToken = {
  kind: 'key' | 'number' | 'punct' | 'string' | 'wn8';
  text: string;
};

export type ConsoleLine = ConsoleToken[];

export type ConsoleTokenViewProps = {
  token: ConsoleToken;
  isVisible: boolean;
};
