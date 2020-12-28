import NoSleep from 'nosleep.js';
import { useEffect, useState } from 'react';

const noSleep = new NoSleep();

let requestersCount = 0;

const createNoSleepClient = () => {
  let isEnabled = false;

  return {
    enable() {
      if (isEnabled) {
        return;
      }
      isEnabled = true;
      if (requestersCount === 0) {
        noSleep.enable();
      }
      requestersCount++;
    },
    disable() {
      if (!isEnabled) {
        return;
      }
      isEnabled = false;
      requestersCount--;
      if (requestersCount === 0) {
        noSleep.disable();
      }
    }
  };
}

export const useNoSleep = () => {
  const [noSleep] = useState(createNoSleepClient);
  useEffect(() => {
    return () => {
      noSleep.disable();
    }
  }, [noSleep]);

  return noSleep;
};
