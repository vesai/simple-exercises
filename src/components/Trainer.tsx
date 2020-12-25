import classNames from 'classnames';
import { FC, useMemo, useState } from 'react';
import { useDrag } from 'react-use-gesture';
import { useSpring, animated } from 'react-spring';

import css from './Trainer.module.css';
import { steps } from '../modules/steps';
import { Card } from './Card';

const xx = {
  friction: 50,
  tension: 800 
};

// TODO use parts

type SpringType = {
  prevCard: [number, number];
  currentCard: [number, number];
  nextCard: [number, number];
};
const getXZFromX = (x: number): [number, number] => {
  const newX = x < 0 ? x : 0;
  const widthPart = x / window.innerWidth;
  const newZ = x < 0 ? 1 : Math.max((1 - widthPart / 5), 0);

  return [newX, newZ];
};


export const Trainer: FC = () => {
  const initialSpring = useMemo(() => ({
    prevCard: getXZFromX(-window.innerWidth),
    currentCard: getXZFromX(0),
    nextCard: getXZFromX(window.innerWidth)
  }), []);

  const [{ currentCard, nextCard, prevCard }, set] = useSpring<SpringType>(() => initialSpring);

  const bind = useDrag(({ down, movement: [x] }) => {
    const width = window.innerWidth;

    set({
      prevCard: down ? getXZFromX(x - width) : initialSpring.prevCard,
      currentCard: down ? getXZFromX(x) : initialSpring.currentCard,
      nextCard: down ? getXZFromX(x + width) : initialSpring.nextCard,
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
    <div {...bind()} className={css.root}>
      
      <animated.div
        className={css.card}
        style={{
          transform: nextCard.interpolate(
            ((x: number, scale: number) => `scale(${scale}) translateX(${x}px)`) as any
          )
        }}
      >
        <Card step={steps[stepIndex]} />
      </animated.div>
      <animated.div
        className={css.card}
        style={{
          transform: currentCard.interpolate(
            ((x: number, scale: number) => `scale(${scale}) translateX(${x}px)`) as any
          )
        }}
      >
        <Card step={steps[stepIndex]} />
      </animated.div>
      <animated.div
        className={css.card}
        style={{
          transform: prevCard.interpolate(
            ((x: number, scale: number) => `scale(${scale}) translateX(${x}px)`) as any
          )
        }}
      >
        <Card step={steps[stepIndex]} />
      </animated.div>
    </div>
  );
};
