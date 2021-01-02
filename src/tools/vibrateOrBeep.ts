export enum VibrateBeepType {
  Short,
  Double
}

export const vibrateOrBeep = (type: VibrateBeepType) => {
  tryVibrate(type);
  switch (type) {
    case VibrateBeepType.Short:
      // TODO
      break;
    case VibrateBeepType.Double:
      // TODO
      break;
  }
};

export const unlockBeepAfterClick = () => {
  // TODO
};

const tryVibrate = (type: VibrateBeepType) => {
  if (navigator.vibrate) {
    // If support
    switch (type) {
      case VibrateBeepType.Short:
        navigator.vibrate(50);
        break;
      case VibrateBeepType.Double:
        navigator.vibrate([50, 50, 50]);
        break;
    }
  }
}
