export const arrayWithLength = (length: number): null[] => {
  const array = new Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = null;
  }
  return array;
}
