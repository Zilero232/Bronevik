import { connection } from 'next/server';

export const RequestTime = async () => {
  await connection();

  return null;
};
