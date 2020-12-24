export const secToString = (timeSec: number): string => {
  if (timeSec < 60) {
    return `${timeSec}s`;
  }
  return `${Math.floor(timeSec/60)}m`;
}
