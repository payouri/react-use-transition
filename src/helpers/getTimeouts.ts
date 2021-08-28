import { Timeout } from '../types';

export const getTimeout = (
  timeout: Timeout
): {
  exit: number;
  enter: number;
  appear?: number;
} => {
  if (typeof timeout === 'number') {
    return {
      enter: timeout,
      appear: undefined,
      exit: timeout,
    };
  }
  const { exit, enter, appear } = timeout;
  return { exit, enter, appear };
};
