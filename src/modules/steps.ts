const stepGroups = [{
  title: "Сидеть",
  steps: [
    {
      items: [
        {
          title: "Зажмурится",
          timeSec: 4
        },
        {
          title: "Разомкнуть веки",
          timeSec: 4
        },
      ],
      repeatCount: 8
    },
    {
      items: [
        {
          title: "Быстро моргать",
          timeSec: 15
        },
        {
          title: "Закрыть глаза",
          timeSec: 10
        },
      ],
      repeatCount: 4
    },
    {
      items: [{
        title: "Массировать указательными пальцами",
        timeSec: 60
      }],
      repeatCount: 1
    },
    {
      items: [{
        title: "Лёгкие надавливающие движения",
        timeSec: 3
      }, {
        title: "Отдых",
        timeSec: 3
      }],
      repeatCount: 4
    }
  ]
},
{
  title: "Ровно сидеть",
  steps: [
    {
      items: [{
        title: "Вверх-вниз",
        timeSec: 3
      }],
      repeatCount: 12
    },
    {
      items: [{
        title: "Влево-вправо",
        timeSec: 3
      }],
      repeatCount: 12
    },
    {
      items: [{
        title: "Вверх-вниз, влево-вправо",
        timeSec: 6
      }],
      repeatCount: 10
    },
    {
      items: [{
        title: "Вращение по и против часовой",
        timeSec: 3
      }],
      repeatCount: 6
    }
  ]
},
{
  title: "Стоять",
  steps: [
    {
      items: [
        {
          title: "Стена",
          timeSec: 3
        },
        {
          title: "Палец 30 см от глаз",
          timeSec: 5
        }
      ],
      repeatCount: 12
    },
    {
      items: [{
        title: "Палец на вытянутой руке: cмотреть и приближать до двоения",
        timeSec: 4
      }],
      repeatCount: 8
    },
  ]
},
{
  // TODO special page!
  title: "Стоять у окна",
  subtitle: "Метка на окне, объект в дали. По 3 секунды",
  steps: [
    {
      items: [{
        title: "Левый глаз",
        timeSec: 120
      }, {
        title: "Оба глаза",
        timeSec: 120
      }, {
        title: "Правый глаз",
        timeSec: 120
      }],
      repeatCount: 1
    }
  ]
}];

export type LinearizedStep = {
  title: string;
  subtitle?: string;
  repeatCount: number;
  data: {
    items: {
      title: string;
      timeSec: number;
    }[];
  };
};

export const steps: LinearizedStep[] = [];

for (const group of stepGroups) {
  for (const step of group.steps) {
    steps.push({
      title: group.title,
      subtitle: group.subtitle,
      repeatCount: step.repeatCount,
      data: step
    });
  }
}
