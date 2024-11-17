[**@aligent/microservice-util-lib**](../modules.md) • **Docs**

***

[@aligent/microservice-util-lib](../modules.md) / remap

# Function: remap()

> **remap**\<`Original`, `MapArray`\>(`object`, `map`): [`Remap`](../type-aliases/Remap.md)\<`MapArray`, `Original`\>

Map one object's values to another structure

## Type Parameters

• **Original** *extends* `object`

• **MapArray** *extends* [`ObjectMap`](../type-aliases/ObjectMap.md)

## Parameters

• **object**: `Original`

the object to map from

• **map**: `MapArray`

the keys for the mapping

## Returns

[`Remap`](../type-aliases/Remap.md)\<`MapArray`, `Original`\>

the remapped object

## Examples

```ts
const map = [
  ['foo', 'baz'],
  ['bar', 'qux.0']
] as const;
const obj = { foo: 'hi', bar: 7 }
remap(obj, map); // { baz: 'hi', qux: [7] }
```

```ts
const map = [
 ['foo', 'baz'],
 ['bar', 'qux.0', (x: number) => x + 1]
] as const;
const obj = { foo: 'hi', bar: 7 }
remap(obj, map); // { baz: 'hi', qux: [8] }
```

```ts
const map = [
  ['', 'baz', (x: { foo: number, bar: number }) => x.foo + x.bar]
]
const obj = { foo: 3, bar: 7 }
remap(obj, map); // { baz: 10 }
```

## Defined in

[remap/remap.ts:181](https://github.com/aligent/microservice-development-utilities/blob/aa4b5d2c0fc3925dee03a46aa2f9ce02720aa69b/packages/microservice-util-lib/src/remap/remap.ts#L181)
