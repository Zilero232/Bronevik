export type WeekGroup<T> = {
  week: string;
  entries: T[];
};

export type WeekGroupsInput<T> = {
  entries: readonly T[];
  dateOf: (entry: T) => Date;
};
