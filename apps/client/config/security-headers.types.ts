export type CspInput = {
  apiUrl: string | undefined;
  isDev: boolean;
};

export type Directives = Record<string, string[]>;

export type PolicyInput = CspInput & {
  extra?: Directives;
};

export type FrameableInput = PolicyInput & {
  ancestors: string[];
};
