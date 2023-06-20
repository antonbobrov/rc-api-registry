const map: Map<string, string> = new Map();

export const camelToSnakeCase = (value: string) => {
  if (map.get(value)) {
    return map.get(value) ?? '';
  }

  let snakeString = value.replace(
    /[A-Z]/g,
    (letter) => `_${letter.toLowerCase()}`
  );

  if (snakeString.slice(0, 1) === '_') {
    snakeString = snakeString.slice(1);
  }

  map.set(value, snakeString);

  return snakeString;
};
