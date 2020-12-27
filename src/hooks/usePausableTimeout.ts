import { useEffect, useRef } from 'react';
import { useInterval, useUpdate } from 'react-use';

export const usePausableTimeout = (fullTimeMs: number, isPaused: boolean): number => {
  const update = useUpdate();
  useInterval(update, isPaused ? null : 500);

  const currentTime = Date.now();
  const startTime = useRef(currentTime);
  const pausedTime = useRef<number | null>(null);
  
  useEffect(() => {
    // TODO
  }, [isPaused]);


  return (pausedTime.current ?? currentTime) - startTime.current;
};
