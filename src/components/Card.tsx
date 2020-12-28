import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useLatest } from 'react-use';

import css from './Card.module.css';
import { secToString } from '../tools/time';
import { arrayWithLength } from '../tools/array';
import { LinearizedStep } from '../modules/steps';
import { usePausableTimeout } from '../hooks/usePausableTimeout';
import { pauseIconHtml, playIconHtml } from '../modules/icons';
import { useNoSleep } from '../hooks/useNoSleep';

enum VibrateType {
  Short,
  Double
}

const tryVibrate = (type: VibrateType) => {
  if (navigator.vibrate) {
    // If support
    switch (type) {
      case VibrateType.Short:
        navigator.vibrate(50);
        break;
      case VibrateType.Double:
        navigator.vibrate([50, 50, 50]);
        break;
    }
  }
}

// TODO make normal name
const getItemIndexFromValueAndArray = (value: number, array: number[]): number => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (value > array[i]) {
      return i;
    }
  }
  return 0; // TODO Hmm
};

type CardProps = {
  isActive: boolean;
  stepIndex: number;
  stepsCount: number;
  step: LinearizedStep;
};

// TODO reset when not active!?
// TODO 

export const Card: FC<CardProps> = ({ isActive, step, stepIndex, stepsCount }) => {
  const [isPaused, setPaused] = useState(true);
  const [isFreezeBeforePlay, setFreezeBeforePlay] = useState(false);
  const isActiveLatest = useLatest(isActive);
  const noSleep = useNoSleep();

  useEffect(() => {
    if (!isActive) {
      setPaused(true);
      noSleep.disable();
    }
  }, [isActive, noSleep]);

  const cycleTimingsMs = useMemo(() => {
    const dataItems = step.data.items;

    const timings = [0];
    for (let i = 1; i < dataItems.length; i++) {
      timings.push(timings[i-1] + (dataItems[i].timeSec * 1000));
    }
    return timings;
  }, [step.data.items]);

  const oneCycleTimeMs = cycleTimingsMs[cycleTimingsMs.length - 1] + step.data.items[cycleTimingsMs.length - 1].timeSec * 1000;

  const currentTimeFromStart = usePausableTimeout(isPaused);

  const repeatDone = Math.floor(currentTimeFromStart / oneCycleTimeMs);
  const thisTurnTime = currentTimeFromStart - repeatDone * oneCycleTimeMs;

  // TODO NOT OPTIMAL DO IT EVERY TIME
  const activeStep = getItemIndexFromValueAndArray(thisTurnTime, cycleTimingsMs);
  const [isStarted, setStarted] = useState(false);
  const isStartedLatest = useLatest(isStarted);
  const isEnded = repeatDone >= step.repeatCount;

  useEffect(() => {
    if (!isStartedLatest.current && !isEnded) {
      tryVibrate(VibrateType.Short);
    }
  }, [isStartedLatest, isEnded, repeatDone, activeStep]); // activeStep, repeatDone needs for vibrate every time when step changed

  useEffect(() => {
    if (isEnded) {
      tryVibrate(VibrateType.Double);
      setPaused(true);
      noSleep.disable();
    }
  }, [isEnded, noSleep]);
  
  const stepItems = useMemo(
    () => arrayWithLength(stepsCount),
    [stepsCount]
  );

  const repeatItems = useMemo(
    () => arrayWithLength(step.repeatCount),
    [step.repeatCount]
  );

  const handleStartPause = useCallback(() => {
    // TODO show freeze in interface
    setStarted(true);
    if (isPaused) {
      setFreezeBeforePlay(true);
      noSleep.enable();
      setTimeout(() => {
        setFreezeBeforePlay(false);
        if (isActiveLatest.current) {
          setPaused(false);
          tryVibrate(VibrateType.Short);
        }
      }, 1000);
    } else {
      setPaused(true);
      noSleep.disable();
    }
  }, [isActiveLatest, isPaused, noSleep]);

  return (
    <div className={css.root}>
      <div className={css.stepsList}>
        {stepItems.map((_, index) => (
          <div
            className={classNames(css.stepsItem, stepIndex >= index && css.item_active)}
            key={index}
          />
        ))}
      </div>
      <div className={css.title}>
        {step.title}
      </div>
      {step.subtitle !== undefined && (
        <div className={css.subtitle}>
          {step.subtitle}
        </div>
      )}
      <div className={css.data}>
        {step.data.items.map((item, index) => (
          <div key={index} className={css.item}>
            <div className={css.time}>{secToString(item.timeSec)}</div>
            <div
              className={classNames(
                index === activeStep && isStarted && !isEnded && css.itemTitle_active
              )}
            >
              {item.title}
            </div>
          </div>
        ))}
        {step.repeatCount !== 1 && (
          <div className={css.item}>
            <div className={css.repeatCount}>
              x{step.repeatCount}
            </div>
            {repeatItems.map((_, index) => (
              <div
                key={index}
                className={classNames(
                  css.repeatItem,
                  index < repeatDone && css.repeatItem_done
                )}
              />
            ))}
          </div>
        )}
      </div>
      {!isEnded && (
        <button
          className={classNames(
            css.playPauseButton,
            isFreezeBeforePlay && css.playPauseButton_freezed
          )}
          dangerouslySetInnerHTML={isPaused ? playIconHtml : pauseIconHtml}
          onClick={isFreezeBeforePlay ? undefined : handleStartPause}
        />
      )}
    </div>
  );
};
