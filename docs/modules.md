aligent-microservices-utilities

# aligent-microservices-utilities

## Table of contents

### Classes

- [S3Dao](classes/S3Dao.md)

### Interfaces

- [RetryConfig](interfaces/RetryConfig.md)

### Type Aliases

- [ObjectMap](modules.md#objectmap)
- [Remap](modules.md#remap)

### Functions

- [chunkBy](modules.md#chunkby)
- [ensurePropertiesDefined](modules.md#ensurepropertiesdefined)
- [fetchSsmParams](modules.md#fetchssmparams)
- [remap](modules.md#remap-1)
- [retryWrapper](modules.md#retrywrapper)

## Type Aliases

### <a id="objectmap" name="objectmap"></a> ObjectMap

Ƭ **ObjectMap**: readonly readonly [`string`, `string`, Function?][]

A list of keys to keys, with an optional parser function

#### Defined in

[remap/remap.ts:15](https://bitbucket.org/aligent/microservices-utilities/src/96c029f/src/remap/remap.ts#lines-15)

___

### <a id="remap" name="remap"></a> Remap

Ƭ **Remap**<`MapArray`, `Original`\>: `SimplifyIntersection`<`ConstructTypeFromProperties`<`MapArray`, `Original`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MapArray` | extends [`ObjectMap`](modules.md#objectmap) |
| `Original` | extends `Object` |

#### Defined in

[remap/remap.ts:133](https://bitbucket.org/aligent/microservices-utilities/src/96c029f/src/remap/remap.ts#lines-133)

## Functions

### <a id="chunkby" name="chunkby"></a> chunkBy

▸ **chunkBy**<`ArrayItem`\>(`source`, `chunkSize`): `ArrayItem`[][]

Split an array into chunks of a certain size

**`Example`**

```ts
chunkBy([1, 2, 3, 4, 5, 6, 7], 2) // [[1, 2], [3, 4], [5, 6], [7]]
```

#### Type parameters

| Name |
| :------ |
| `ArrayItem` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `ArrayItem`[] | the array to split up |
| `chunkSize` | `number` | the size of each chunk. (The final chunk will be whatever is remaining) |

#### Returns

`ArrayItem`[][]

#### Defined in

[chunkBy/chunkBy.ts:10](https://bitbucket.org/aligent/microservices-utilities/src/96c029f/src/chunkBy/chunkBy.ts#lines-10)

___

### <a id="ensurepropertiesdefined" name="ensurepropertiesdefined"></a> ensurePropertiesDefined

▸ **ensurePropertiesDefined**<`T`, `K`\>(`obj`, `...keys`): `SimplifyIntersection`<`Required`<`Pick`<`T`, `K`\>\> & `Omit`<`T`, `K`\>\>

Ensure that the given properties are defined on the object.

**`Example`**

when a key is defined
```ts
type Foo = { a?: number; b?: number };
const foo: Foo = { a: 1, b: 2 };
const bar = ensurePropertiesDefined(foo, 'a');
//    ^? const bar: {
//         a: number;
//         b?: number;
//       }
```

**`Example`**

when a key is not defined
```ts
type Foo = { a?: number; b?: number };
const foo: Foo = {};
const bar = ensurePropertiesDefined(foo, 'a', 'b');
// Error: Keys a, b were not defined on the object
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `T` | The object to check. |
| `...keys` | `K`[] | The keys to check. |

#### Returns

`SimplifyIntersection`<`Required`<`Pick`<`T`, `K`\>\> & `Omit`<`T`, `K`\>\>

the object with the correct type.

#### Defined in

[ensurePropertiesDefined/ensurePropertiesDefined.ts:27](https://bitbucket.org/aligent/microservices-utilities/src/96c029f/src/ensurePropertiesDefined/ensurePropertiesDefined.ts#lines-27)

___

### <a id="fetchssmparams" name="fetchssmparams"></a> fetchSsmParams

▸ **fetchSsmParams**(`param`): `Promise`<`SSM.Parameter`\>

Fetch one SSM parameter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `param` | `string` | key of the parameter to fetch |

#### Returns

`Promise`<`SSM.Parameter`\>

#### Defined in

[fetchSsmParams/fetchSsmParams.ts:9](https://bitbucket.org/aligent/microservices-utilities/src/96c029f/src/fetchSsmParams/fetchSsmParams.ts#lines-9)

▸ **fetchSsmParams**(`...params`): `Promise`<`SSM.ParameterList`\>

Fetch a list of SSM parameters

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...params` | `string`[] | list of parameter keys to fetch |

#### Returns

`Promise`<`SSM.ParameterList`\>

#### Defined in

[fetchSsmParams/fetchSsmParams.ts:16](https://bitbucket.org/aligent/microservices-utilities/src/96c029f/src/fetchSsmParams/fetchSsmParams.ts#lines-16)

___

### <a id="remap-1" name="remap-1"></a> remap

▸ **remap**<`Original`, `MapArray`\>(`object`, `map`): [`Remap`](modules.md#remap)<`MapArray`, `Original`\>

Map one object's values to another structure

**`Example`**

without a transformer function
```ts
const map = [
  ['foo', 'baz'],
  ['bar', 'qux.0']
] as const;
const obj = { foo: 'hi', bar: 7 }
remap(obj, map); // { baz: 'hi', qux: [7] }
```

**`Example`**

with a transformer function
```ts
const map = [
 ['foo', 'baz'],
 ['bar', 'qux.0', (x: number) => x + 1]
] as const;
const obj = { foo: 'hi', bar: 7 }
remap(obj, map); // { baz: 'hi', qux: [8] }
```

**`Example`**

with an empty initial key
```ts
const map = [
  ['', 'baz', (x: { foo: number, bar: number }) => x.foo + x.bar]
]
const obj = { foo: 3, bar: 7 }
remap(obj, map); // { baz: 10 }
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Original` | extends `Object` |
| `MapArray` | extends readonly readonly [`string`, `string`, (...`args`: `any`[]) => `any`][] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `object` | `Original` | the object to map from |
| `map` | `MapArray` | the keys for the mapping |

#### Returns

[`Remap`](modules.md#remap)<`MapArray`, `Original`\>

the remapped object

#### Defined in

[remap/remap.ts:172](https://bitbucket.org/aligent/microservices-utilities/src/96c029f/src/remap/remap.ts#lines-172)

___

### <a id="retrywrapper" name="retrywrapper"></a> retryWrapper

▸ **retryWrapper**<`T`\>(`fn`, `config`): `Promise`<`T`\>

Retry an async function if it fails

**`Example`**

```ts
retryWrapper(someAsyncFunction, {
  retries: 3,
  onRetry: (_, error) => console.error(error)
});
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | () => `Promise`<`T`\> | the function to be retried |
| `config` | [`RetryConfig`](interfaces/RetryConfig.md) | the configuration for retries |

#### Returns

`Promise`<`T`\>

#### Defined in

[retryWrapper/retryWrapper.ts:78](https://bitbucket.org/aligent/microservices-utilities/src/96c029f/src/retryWrapper/retryWrapper.ts#lines-78)
