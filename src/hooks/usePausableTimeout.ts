import { useCallback, useEffect, useRef } from 'react';
import { useInterval, useUpdate } from 'react-use';

type UsePausableTimeoutReturn = [
  timeFromStart: number,
  reset: () => void
]

export const usePausableTimeout = (isPaused: boolean): UsePausableTimeoutReturn => {
  const update = useUpdate();
  useInterval(update, isPaused ? null : 50);

  const currentTime = Date.now();
  const startTime = useRef(currentTime);
  const pausedTime = useRef<number | null>(null);
  
  useEffect(() => {
    if (isPaused) {
      pausedTime.current = Date.now();
    } else if (pausedTime.current !== null) {
      startTime.current += Date.now() - pausedTime.current;
      pausedTime.current = null;
    }
  }, [isPaused]);

  const timeFromStart = (pausedTime.current ?? currentTime) - startTime.current;
  const reset = useCallback(() => {
    const time = Date.now();
    startTime.current = time;
    if (pausedTime.current !== null) {
      pausedTime.current = time;
    }
  }, []);

  return [timeFromStart, reset];
};
