import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { steps } from '../modules/steps';
import { arrayWithLength } from '../tools/array';
import { secToString } from '../tools/time';

import css from './Trainer.module.css';

export const Trainer = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];

  const handlePrev = useCallback(() => {
    setStepIndex(Math.max(stepIndex - 1, 0));
  }, [stepIndex]);

  const handleNext = useCallback(() => {
    setStepIndex(Math.min(stepIndex + 1, steps.length - 1));
  }, [stepIndex]);

  const repeatItems = useMemo(
    () => arrayWithLength(currentStep.repeatCount),
    [currentStep.repeatCount]
  );

  return (
    <div className={css.root}>
      <div className={css.stepsList}>
        {steps.map((_, index) => (
          <div
            className={classNames(css.stepsItem, stepIndex >= index && css.item_active)}
            key={index}
          />
        ))}
      </div>
      <div className={css.title}>
        {currentStep.title}
      </div>
      {currentStep.subtitle !== undefined && (
        <div className={css.subtitle}>
          {currentStep.subtitle}
        </div>
      )}
      <div className={css.data}>
        {currentStep.data.items.map((item, index) => (
          <div key={index} className={css.item}>
            <div className={css.time}>{secToString(item.timeSec)}</div>
            {item.title}
          </div>
        ))}
        {currentStep.repeatCount !== 1 && (
          <div className={css.item}>
            <div className={css.repeatCount}>
              x{currentStep.repeatCount}
            </div>
            {repeatItems.map((_, index) => (
              <div key={index} className={css.repeatItem} />
            ))}
          </div>
        )}
      </div>
      <div className={css.prevNext}>
        <button onClick={handlePrev}>
          Prev
        </button>
        <button onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};
