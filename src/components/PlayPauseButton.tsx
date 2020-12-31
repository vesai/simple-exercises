import { FC } from 'react';
import { playIconHtml, pauseIconHtml } from '../modules/icons';
import { ButtonWithCircle } from './ButtonWithCircle';

type Props = {
  isFreezeBeforePlay: boolean;
  isPaused: boolean;
  onClick(): void;
};

export const PlayPauseButton: FC<Props> = ({ isFreezeBeforePlay, isPaused, onClick }) => {
  return (
    <ButtonWithCircle
      isFreezed={isFreezeBeforePlay}
      dangerouslySetInnerHTML={isPaused ? playIconHtml : pauseIconHtml}
      onClick={isFreezeBeforePlay ? undefined : onClick}
    />
  );
};
