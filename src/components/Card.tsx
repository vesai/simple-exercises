import { FC, useCallback, useEffect, useMemo, useState } from 'react';
// import classNames from 'classnames';

import css from './Card.module.css';
import { secToString } from '../tools/time';
import { arrayWithLength } from '../tools/array';
import { LinearizedStep } from '../modules/steps';
import classNames from 'classnames';
import { usePausableTimeout } from '../hooks/usePausableTimeout';

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

export const Card: FC<CardProps> = ({ isActive, step, stepIndex, stepsCount }) => {
  const [isPaused, setPaused] = useState(true);

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

  useEffect(() => {
    if (isStarted) {
      navigator.vibrate(300);
    }
  }, [activeStep, isStarted]);
  
  const stepItems = useMemo(
    () => arrayWithLength(stepsCount),
    [stepsCount]
  );

  const repeatItems = useMemo(
    () => arrayWithLength(step.repeatCount),
    [step.repeatCount]
  );

  const handleStartPause = useCallback(() => {
    setStarted(true);
    setPaused(p => !p);
  }, []);

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
            <div className={classNames(index === activeStep && isStarted && css.itemTitle_active)}>
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
        <button onClick={handleStartPause}>Start/pause</button>
      </div>
    </div>
  );
};
