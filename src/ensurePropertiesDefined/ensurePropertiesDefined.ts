function ensurePropertiesDefined<
  T extends { [key: string]: any },
  K extends keyof T
>(obj: T, ...keys: K[]): Required<Pick<T, K>> {
  const failures: K[] = [];

  keys.forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      failures.push(key);
    }
  });

  if (failures.length > 0) {
    throw new Error(`Keys ${failures.join(', ')} were not defined on object`);
  }

  return obj as any;
}

export default ensurePropertiesDefined;
