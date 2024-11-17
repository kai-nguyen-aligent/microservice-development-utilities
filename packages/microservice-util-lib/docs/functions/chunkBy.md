[**@aligent/microservice-util-lib**](../modules.md) • **Docs**

***

[@aligent/microservice-util-lib](../modules.md) / chunkBy

# Function: chunkBy()

> **chunkBy**\<`ArrayItem`\>(`source`, `chunkSize`): `ArrayItem`[][]

Split an array into chunks of a certain size

## Type Parameters

• **ArrayItem**

## Parameters

• **source**: `ArrayItem`[]

the array to split up

• **chunkSize**: `number`

the size of each chunk. (The final chunk will be whatever is remaining)

## Returns

`ArrayItem`[][]

## Example

```ts
chunkBy([1, 2, 3, 4, 5, 6, 7], 2) // [[1, 2], [3, 4], [5, 6], [7]]
```

## Defined in

[chunkBy/chunkBy.ts:10](https://github.com/aligent/microservice-development-utilities/blob/aa4b5d2c0fc3925dee03a46aa2f9ce02720aa69b/packages/microservice-util-lib/src/chunkBy/chunkBy.ts#L10)
