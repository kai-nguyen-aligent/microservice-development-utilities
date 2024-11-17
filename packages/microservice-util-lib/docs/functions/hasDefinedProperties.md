[**@aligent/microservice-util-lib**](../modules.md) • **Docs**

***

[@aligent/microservice-util-lib](../modules.md) / hasDefinedProperties

# Function: hasDefinedProperties()

> **hasDefinedProperties**\<`T`, `K`\>(`obj`, ...`keys`): `obj is SimplifyIntersection<Required<Pick<T, K>> & Omit<T, K>>`

Ensure that the given properties are defined on the object.

## Type Parameters

• **T** *extends* `object`

• **K** *extends* `string` \| `number` \| `symbol`

## Parameters

• **obj**: `object` \| `T`

The object to check.

• ...**keys**: `K`[]

The keys to check.

## Returns

`obj is SimplifyIntersection<Required<Pick<T, K>> & Omit<T, K>>`

`true` if the object has the given properties defined, `false` otherwise.

## Example

```ts
type Foo = { a?: number; b?: number };
const foo: Foo = { a: 1, b: 2 };
if (hasDefinedProperties(foo, 'a')) {
  console.log(foo);
 //          ^? const bar: {
 //               a: number;
 //               b?: number;
 //             }
}
```

## Defined in

[hasPropertiesDefined/hasPropertiesDefined.ts:22](https://github.com/aligent/microservice-development-utilities/blob/aa4b5d2c0fc3925dee03a46aa2f9ce02720aa69b/packages/microservice-util-lib/src/hasPropertiesDefined/hasPropertiesDefined.ts#L22)
