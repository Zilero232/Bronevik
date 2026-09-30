export const onDistinct = <Value>(apply: (value: Value) => void): ((value: Value) => void) => {
  let last: { value: Value } | null = null;

  return (value) => {
    if (last !== null && last.value === value) {
      return;
    }

    last = { value };
    apply(value);
  };
};
