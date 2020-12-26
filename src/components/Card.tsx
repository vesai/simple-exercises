import { FC, useMemo } from 'react';
// import classNames from 'classnames';

import css from './Card.module.css';
import { secToString } from '../tools/time';
import { arrayWithLength } from '../tools/array';
import { LinearizedStep } from '../modules/steps';
import classNames from 'classnames';

type CardProps = {
  stepIndex: number;
  stepsCount: number;
  step: LinearizedStep;
};

export const Card: FC<CardProps> = ({ step, stepIndex, stepsCount }) => {
  const stepItems = useMemo(
    () => arrayWithLength(stepsCount),
    [stepsCount]
  );

  const repeatItems = useMemo(
    () => arrayWithLength(step.repeatCount),
    [step.repeatCount]
  );

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
            {item.title}
          </div>
        ))}
        {step.repeatCount !== 1 && (
          <div className={css.item}>
            <div className={css.repeatCount}>
              x{step.repeatCount}
            </div>
            {repeatItems.map((_, index) => (
              <div key={index} className={css.repeatItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
