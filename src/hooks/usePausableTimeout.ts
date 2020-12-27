import { useEffect, useRef } from 'react';
import { useInterval, useUpdate } from 'react-use';

export const usePausableTimeout = (isPaused: boolean): number => {
  const update = useUpdate();
  useInterval(update, isPaused ? null : 500);

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


  return (pausedTime.current ?? currentTime) - startTime.current;
};
