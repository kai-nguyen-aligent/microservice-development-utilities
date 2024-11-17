[**@aligent/microservice-util-lib**](../modules.md) • **Docs**

***

[@aligent/microservice-util-lib](../modules.md) / retryWrapper

# Function: retryWrapper()

> **retryWrapper**\<`T`\>(`fn`, `config`): `Promise`\<`T`\>

Retry an async function if it fails

## Type Parameters

• **T**

## Parameters

• **fn**

the function to be retried

• **config**: [`RetryConfig`](../interfaces/RetryConfig.md)

the configuration for retries

## Returns

`Promise`\<`T`\>

## Example

```ts
retryWrapper(someAsyncFunction, {
  retries: 3,
  onRetry: (_, error) => console.error(error)
});
```

## Defined in

[retryWrapper/retryWrapper.ts:78](https://github.com/aligent/microservice-development-utilities/blob/aa4b5d2c0fc3925dee03a46aa2f9ce02720aa69b/packages/microservice-util-lib/src/retryWrapper/retryWrapper.ts#L78)
