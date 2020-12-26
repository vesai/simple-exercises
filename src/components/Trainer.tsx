import { FC, useState } from 'react';
import { useDrag } from 'react-use-gesture';
import { animated, interpolate, useSprings } from 'react-spring';

import css from './Trainer.module.css';
import { steps } from '../modules/steps';
import { Card } from './Card';

const animationConifg = {
  friction: 50,
  tension: 800 
};

// TODO change to useSpring!?

const defaultOffset = window.innerWidth + 32; // 2rem

const getPos = (index: number) => (x: number, down: number) => {
  x += index * defaultOffset;
  const newX = x < 0 ? x : 0;
  const widthPart = x / window.innerWidth;
  const newZ = x < 0 ? 1 : Math.max((1 - widthPart / 5), 0);
  return `scale(${newZ - down * 0.1}) translateX(${newX}px)`;
};

export const Trainer: FC = () => {
  const [animationProps, setAnimationProps] = useSprings(steps.length, () => ({
    x: 0,
    down: 0,
    config: animationConifg
  }));

  const [stepIndex, setStepIndex] = useState(0);

  const bind = useDrag(({ down, movement: [x] }) => {
    if (down) {
      setAnimationProps({ x: x - defaultOffset * stepIndex, down: 1 });
      return;
    }

    if (Math.abs(x) < (window.innerWidth / 4)) {
      setAnimationProps({ x: -defaultOffset * stepIndex, down: 0 });
      return;
    }

    const direction = x < 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(steps.length - 1, stepIndex + direction));
    setStepIndex(newIndex);
    setAnimationProps({ x: -defaultOffset * newIndex, down: 0 });
  });

  return (
    <div {...bind()} className={css.root}>
      {animationProps.map(({ x, down }, revI) => {
        const i = animationProps.length - revI - 1;

        return (
          <animated.div
            key={i}
            className={css.card}
            style={{
              transform: interpolate([x, down], getPos(i))
            }}
          >
            <Card stepIndex={i} stepsCount={steps.length} step={steps[i]} />
          </animated.div>
        );
      })}
    </div>
  );
};
