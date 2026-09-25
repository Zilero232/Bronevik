const pad = (value: number) => String(value).padStart(2, '0');

export const clock = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));

  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
};
