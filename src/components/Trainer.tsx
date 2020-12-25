import classNames from 'classnames';
import { FC, useState } from 'react';
import { useDrag } from 'react-use-gesture';
import { useSpring, animated } from 'react-spring';

import css from './Trainer.module.css';
import { steps } from '../modules/steps';
import { Card } from './Card';

const xx = {
  friction: 50,
  tension: 800 
};

const initialValue: [number, number] = [0, 1];

export const Trainer: FC = () => {
  const [{ wow }, set] = useSpring<{ wow: [number, number] }>(() => ({ wow: initialValue }));

  const bind = useDrag(({ down, movement: [x] }) => {
    const newX = x < 0 ? x : 0;
    const newZ = x < 0 ? Math.max((1 + x / 3 / window.innerWidth), 0.9) : Math.max((1 - x / window.innerWidth), 0.8);
    
    set({
      wow: down ? [newX, newZ] : initialValue,
      config: down ? xx : undefined
    })
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
        style={{ x, y, touchAction: 'none' }}
      </div> */}
      <animated.div {...bind()}
        style={{
          transform: wow.interpolate(
            ((x: number, scale: number) => `scale(${scale}) translateX(${x}px)`) as any
          )
        }}
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
