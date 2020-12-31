import { FC, useCallback, useState } from 'react';
import { playIconHtml, pauseIconHtml } from '../modules/icons';
import { ButtonWithCircle } from './ButtonWithCircle';

type Props = {
  isPaused: boolean;
  onFreezeBeforePlay(): void;
  onPlay(): void;
  onPause(): void;
};

export const PlayPauseButton: FC<Props> = ({ isPaused, onFreezeBeforePlay, onPlay, onPause }) => {
  const [isFreezeBeforePlay, setFreezeBeforePlay] = useState(false);
  // TODO progress

  const handlePlay = useCallback(() => {
    onFreezeBeforePlay();
    setFreezeBeforePlay(true);
    setTimeout(() => {
      setFreezeBeforePlay(false);
      onPlay();
    }, 1000);
  }, [onFreezeBeforePlay, onPlay]);

  return (
    <ButtonWithCircle
      isFreezed={isFreezeBeforePlay}
      dangerouslySetInnerHTML={isPaused ? playIconHtml : pauseIconHtml}
      onClick={isFreezeBeforePlay ? undefined : isPaused ? handlePlay : onPause}
    />
  );
};
