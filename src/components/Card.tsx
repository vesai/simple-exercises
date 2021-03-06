import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { useLatest } from 'react-use';

import css from './Card.module.css';
import { secToString } from '../tools/time';
import { arrayWithLength } from '../tools/array';
import { LinearizedStep } from '../modules/steps';
import { usePausableTimeout } from '../hooks/usePausableTimeout';
import { nextIconHtml } from '../modules/icons';
import { useNoSleep } from '../hooks/useNoSleep';
import { PartialCircle } from './PartialCircle';
import { pixelsInRem } from '../common';
import { ButtonWithCircle } from './ButtonWithCircle';
import { PlayPauseButton } from './PlayPauseButton';
import { unlockBeepAfterClick, VibrateBeepType, vibrateOrBeep } from '../tools/vibrateOrBeep';

const strokeWidthTimeCircle = 4;

type CardProps = {
  isActive: boolean;
  stepIndex: number;
  stepsCount: number;
  step: LinearizedStep;
  goCard(index: number): void;
};

export const Card: FC<CardProps> = ({ isActive, step, stepIndex, stepsCount, goCard }) => {
  const [isPaused, setPaused] = useState(true);
  const isActiveLatest = useLatest(isActive);
  const noSleep = useNoSleep();

  const [currentTimeFromStart, resetTimer] = usePausableTimeout(isPaused);

  useEffect(() => {
    if (!isActive) {
      setPaused(true);
      setStarted(false);
      resetTimer();
      noSleep.disable();
    }
  }, [isActive, noSleep, resetTimer]);

  const cycleTimingsMs = useMemo(() => {
    const dataItems = step.data.items;

    const timings = [0];
    for (let i = 0; i < dataItems.length - 1; i++) {
      timings.push(timings[i] + (dataItems[i].timeSec * 1000));
    }
    return timings;
  }, [step.data.items]);

  const oneCycleTimeMs = cycleTimingsMs[cycleTimingsMs.length - 1] + step.data.items[cycleTimingsMs.length - 1].timeSec * 1000;

  const repeatDone = Math.floor(currentTimeFromStart / oneCycleTimeMs);
  const thisTurnTime = currentTimeFromStart - repeatDone * oneCycleTimeMs;

  const activeStep = useItemWithNearestLessValue(thisTurnTime, cycleTimingsMs);
  const thisStepTime = thisTurnTime - (activeStep === -1 ? 0 : cycleTimingsMs[activeStep]);
  const [isStarted, setStarted] = useState(false);
  const isStartedLatest = useLatest(isStarted);
  const isEnded = repeatDone >= step.repeatCount;

  useEffect(() => {
    if (isStartedLatest.current && !isEnded) {
      vibrateOrBeep(VibrateBeepType.Short);
    }
  }, [isStartedLatest, isEnded, repeatDone, activeStep]); // activeStep, repeatDone needs for vibrate every time when step changed

  useEffect(() => {
    if (isEnded) {
      vibrateOrBeep(VibrateBeepType.Double);
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

  const handleFreezeBeforePlay = useCallback(() => {
    setStarted(true);
    unlockBeepAfterClick();
    noSleep.enable();
  }, [noSleep]);

  const handlePlay = useCallback(() => {
    if (isActiveLatest.current) {
      setPaused(false);
      vibrateOrBeep(VibrateBeepType.Short);
    }
  }, [isActiveLatest]);

  const handlePause = useCallback(() => {
    setPaused(true);
    noSleep.disable();
  }, [noSleep]);

  const handleGoNext = useCallback(() => {
    goCard(Math.min(stepsCount, stepIndex + 1));
  }, [goCard, stepIndex, stepsCount]);

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
        {step.data.items.map((item, index) => {
          const isActiveItem = index === activeStep && isStarted && !isEnded;
          return (
            <div key={index} className={css.item}>
              <div className={css.time}>
                <div className={css.timeCircle}>
                  <PartialCircle
                    part={
                      isActiveItem
                        ? thisStepTime / 1000 / item.timeSec
                        : isEnded || index < activeStep ? 1 : 0
                    }
                    size={2 * pixelsInRem + strokeWidthTimeCircle}
                    strokeWidth={strokeWidthTimeCircle}
                  />
                </div>
                <div className={classNames(css.timeCircle, css.timeCircle_full)}>
                  <PartialCircle
                    part={1}
                    size={2 * pixelsInRem + strokeWidthTimeCircle}
                    strokeWidth={strokeWidthTimeCircle}
                  />
                </div>
                {secToString(item.timeSec)}
              </div>
              <div className={classNames(isActiveItem && css.itemTitle_active)}>
                {item.title}
              </div>
            </div>
          );
        })}
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
                  isStarted && index <= repeatDone && css.repeatItem_done
                )}
              />
            ))}
          </div>
        )}
      </div>
      <div className={css.playPause}>
        {isEnded ? (
          <ButtonWithCircle
            isFreezed={false}
            dangerouslySetInnerHTML={nextIconHtml}
            onClick={handleGoNext}
          />
        ) : (
          <PlayPauseButton
            isPaused={isPaused}
            onFreezeBeforePlay={handleFreezeBeforePlay}
            onPlay={handlePlay}
            onPause={handlePause}
          />
        )}
      </div>
    </div>
  );
};

type IntervalAndResult = {
  array: number[];
  index: number;
};

const useItemWithNearestLessValue = (value: number, sortedAscArray: number[]): number => {
  const prevIntervalAndResult = useRef<IntervalAndResult | null>(null);
  const currentData = prevIntervalAndResult.current;
  if (
    currentData !== null
    && currentData.array === sortedAscArray
    && currentData.array[currentData.index] <= value
    && (
      currentData.index === currentData.array.length - 1
      || currentData.array[currentData.index + 1] > value
    )
  ) {
    return currentData.index;
  }

  const index = getItemIndexWithNearestLessValue(value, sortedAscArray);
  prevIntervalAndResult.current = {
    array: sortedAscArray,
    index
  };
  
  return index;
};

const getItemIndexWithNearestLessValue = (value: number, sortedAscArray: number[]): number => {
  for (let i = sortedAscArray.length - 1; i >= 0; i--) {
    if (value >= sortedAscArray[i]) {
      return i;
    }
  }
  return -1;
};