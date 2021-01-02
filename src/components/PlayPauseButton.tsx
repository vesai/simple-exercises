import { FC, useCallback, useEffect, useState } from 'react';
import { usePausableTimeout } from '../hooks/usePausableTimeout';
import { playIconHtml, pauseIconHtml } from '../modules/icons';
import { ButtonWithCircle } from './ButtonWithCircle';

type Props = {
  isPaused: boolean;
  onFreezeBeforePlay(): void;
  onPlay(): void;
  onPause(): void;
};

const freezeTime = 800;

export const PlayPauseButton: FC<Props> = ({ isPaused, onFreezeBeforePlay, onPlay, onPause }) => {
  const [isFreezeBeforePlay, setFreezeBeforePlay] = useState(false);
  const [time, resetTimer] = usePausableTimeout(!isFreezeBeforePlay);

  const handlePlay = useCallback(() => {
    onFreezeBeforePlay();
    resetTimer();
    setFreezeBeforePlay(true);
  }, [onFreezeBeforePlay, resetTimer]);

  const needEnd = time > freezeTime;

  useEffect(() => {
    if (needEnd) {
      setFreezeBeforePlay(false);
      onPlay();
    }
  }, [needEnd, onPlay]);

  return (
    <ButtonWithCircle
      freezePercent={time / freezeTime}
      isFreezed={isFreezeBeforePlay}
      dangerouslySetInnerHTML={isPaused ? playIconHtml : pauseIconHtml}
      onClick={isFreezeBeforePlay ? undefined : isPaused ? handlePlay : onPause}
    />
  );
};
