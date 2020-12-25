import classNames from 'classnames';
import { FC, useState } from 'react';
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture';

import css from './Trainer.module.css';
import { steps } from '../modules/steps';
import { Card } from './Card';

export const Trainer: FC = () => {
  const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))

  const bind = useDrag(({ down, movement: [mx, my] }) => {
    set({ x: down ? mx : 0, y: 0 })
  })
  const [stepIndex] = useState(0); // setStepIndex

  // const handlePrev = useCallback(() => {
  //   setStepIndex(Math.max(stepIndex - 1, 0));
  // }, [stepIndex]);

  // const handleNext = useCallback(() => {
  //   setStepIndex(Math.min(stepIndex + 1, steps.length - 1));
  // }, [stepIndex]);

  return (
    <div className={css.root}>
      {/* <div className={classNames(css.card, css.card_type_prev)}>
        
      </div> */}
      <animated.div {...bind()} style={{ x, y, touchAction: 'none' }}
        className={classNames(css.card, css.card_type_current)}
      >
        <Card step={steps[stepIndex]} />
      </animated.div>
      {/* <div className={classNames(css.card, css.card_type_next)}>
        
      </div> */}
      {/* <div>
        
      </div> */}
    </div>
  );
};
