export function pick<T, K extends keyof T>(source: T, keys: K[]): Pick<T, K> {
  const target: any = {};

  keys.forEach(key => {
    target[key] = source[key];
  });

  return target;
}
