import _ from 'lodash';

/** Turn a type like { foo: number } & { bar: string } into { foo: number; bar: string; } */
type SimplifyIntersection<
    A,
> = A extends object
    ? {
        [K in keyof A]: A[K] extends object
            ? SimplifyIntersection<A[K]>
            : A[K]
    }
    : A;

/** A list of keys to keys, with an optional parser function */
type ObjectMap = readonly ((readonly [string, string, ((...args: any[]) => any)?]))[];

type GetKeyType<
    Key extends string, 
    O extends { [key: string]: any },
    M extends ObjectMap[number]
> =
    M extends readonly [string, string, ((...args: any[]) => (infer U))]
        ? unknown extends U
            ? Key extends `${infer K}.${infer Rest}`
                ? GetKeyType<Rest, O[K], M>
                : O[Key]
            : U
        : Key extends `${infer K}.${infer Rest}`
            ? GetKeyType<Rest, O[K], M>
            : O[Key];


type OverrideIndex<
    M extends ObjectMap[number],
    V extends string
> = readonly [M[0], V, M[2]];

type ConstructTypeFromPropertiesInternal<
    M extends ObjectMap[number],
    O extends { [key: string]: any }
> =
    M[1] extends `${infer P}.${infer Rest}`
            ? { [key in P]: ConstructTypeFromPropertiesInternal<OverrideIndex<M, Rest>, O> }
            : { [key in M[1]]: GetKeyType<M[0], O, M> };

type Length<T extends any[] | readonly any[]> =
    T extends { length: infer L } ? L : never;

type BuildTuple<L extends number, T extends any[] = []> = 
    T extends { length: L } ? T : BuildTuple<L, [...T, any]>;

type Add<A extends number, B extends number> = 
    Length<[...BuildTuple<A>, ...BuildTuple<B>]>;

/**
 * Given an object, and an array which remaps the keys of that object,
 * return an object with the new structure
 */
type ConstructTypeFromProperties<
    M extends ObjectMap,
    O extends { [key: string]: any },
    L extends number = 0
> =
    L extends Length<M>
        ? unknown
        : Add<L, 1> extends number
            ? ConstructTypeFromPropertiesInternal<M[L], O> & ConstructTypeFromProperties<M, O, Add<L, 1>>
            : never;

type Remap<
    M extends ObjectMap,
    O extends { [key: string]: any }
> = SimplifyIntersection<ConstructTypeFromProperties<M, O>>;


/**
 * Map one object's values to another structure
 * @param object the object to map from
 * @param map the keys for the mapping
 */
function remap<
    T extends ObjectMap,
    O extends { [key: string]: any }
>(object: O, map: T): Remap<T, O> {
    const out = {};
    map.forEach(item => {
        const parser = item[2] ? item[2] : (val: any) => val;
        const value = item[0] ? _.get(object, item[0]) : object;
        return _.set(out, item[1], parser(value as any));
    });
    return out as any;
}

export { Remap, ObjectMap, remap, SimplifyIntersection };
