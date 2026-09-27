import { secondsInMinute } from 'date-fns/constants';

export const formatCountdown = (seconds: number) => `${Math.floor(seconds / secondsInMinute)}:${String(seconds % secondsInMinute).padStart(2, '0')}`;
