import { useCallback, useState } from 'react';

import css from './Trainer.module.css';

const stepGroups = [{
  title: "Сидеть",
  steps: [
    { title: "Зажмурится на 3-5 секунд; разомкнуть веки 3-5 секунд 7-8 раз." },
    { title: "Быстро моргать 10-15 секунд; закрыть глаза на 10 секунд 3-4 раза." },
    { title: "Аккуратно массировать закрытые глаза указательными пальцами минуту." },
    { title: "Лёгкие надавливающие движения на глазное яблоко в течение 1-3 секунд 3-4 раза." }
  ]
}, {
  title: "Ровно сидеть",
  steps: [
    { title: "Вверх-вниз 10-12 раз." },
    { title: "Влево-вправо 10-12 раз." },
    { title: "Вверх-вниз, влево-вправо 8-10 раз." },
    { title: "Вращение по и против часовой 5-6 раз." }
  ]
}, {
  title: "Стоять",
  steps: [
    { title: "Палец на 30 см от глаз. 2-3 секунды на стену; 5 секунд на палец. 9-12 раз." },
    { title: "Палец на вытянутой руке Смотреть и приближать до двоения. 7-8 раз." },
    { title: "Метка на окне и в даль по 3-5 секунд. Каждый глаз, оба по 2 минуты." }
  ]
}];

export const Trainer = () => {
  const [groupIndex, setGroupIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const currentGroup = stepGroups[groupIndex];
  const currentStep = currentGroup.steps[stepIndex];

  const handleNext = useCallback(() => {
    if (stepIndex < currentGroup.steps.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }

    if (groupIndex < stepGroups.length - 1) {
      setGroupIndex(groupIndex + 1);
      setStepIndex(0);
      return;
    }
    setGroupIndex(0);
    setStepIndex(0);
  }, [currentGroup.steps.length, groupIndex, stepIndex]);

  const handlePrev = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      return;
    }
    if (groupIndex > 0) {
      setGroupIndex(groupIndex - 1);
      setStepIndex(stepGroups[groupIndex - 1].steps.length - 1);
      return;
    }
  }, [groupIndex, stepIndex]);

  return (
    <div className={css.root}>
      <div className={css.group}>
        {groupIndex + 1}/{stepGroups.length} {currentGroup.title}
      </div>
      <div className={css.step}>
        <div className={css.stepHeader}>{stepIndex + 1}/{currentGroup.steps.length}</div>
        <div className={css.stepBody}>{currentStep.title}</div>
        <div className={css.buttons}>
          <button
            disabled={groupIndex === 0 && stepIndex === 0}
            className={css.button}
            onClick={handlePrev}
          >
            Prev
          </button>
          <button className={css.button} onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
};
