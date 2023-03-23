import { SimplifyIntersection } from '../remap/remap';

/**
 * Ensure that the given properties are defined on the object.
 * @param obj The object to check.
 * @param keys The keys to check.
 * @returns the object with the correct type.
 *
 * @example when a key is defined
 * ```ts
 * type Foo = { a?: number; b?: number };
 * const foo: Foo = { a: 1, b: 2 };
 * const bar = ensurePropertiesDefined(foo, 'a');
 * //    ^? const bar: {
 * //         a: number;
 * //         b?: number;
 * //       }
 * ```
 * @example when a key is not defined
 * ```ts
 * type Foo = { a?: number; b?: number };
 * const foo: Foo = {};
 * const bar = ensurePropertiesDefined(foo, 'a', 'b');
 * // Error: Keys a, b were not defined on the object
 * ```
 */
function ensurePropertiesDefined<
  T extends { [key: string]: any },
  K extends keyof T
>(
  obj: T,
  ...keys: K[]
): SimplifyIntersection<Required<Pick<T, K>> & Omit<T, K>> {
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
