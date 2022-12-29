[aligent-microservices-utilities](../README.md) / [Exports](../modules.md) / RetryConfig

# Interface: RetryConfig

Configuration for the retryWrapper

## Table of contents

### Properties

- [backoffAmount](RetryConfig.md#backoffamount)
- [delay](RetryConfig.md#delay)
- [onRetry](RetryConfig.md#onretry)
- [retries](RetryConfig.md#retries)

## Properties

### backoffAmount

• `Optional` **backoffAmount**: `number`

The amount to increase the delay by each retry (in ms)

**`Default`**

0

#### Defined in

[retryWrapper/retryWrapper.ts:17](https://bitbucket.org/aligent/microservices-utilities/src/a0a85a2/src/retryWrapper/retryWrapper.ts#lines-17)

___

### delay

• `Optional` **delay**: `number`

The base delay between retries (in ms)

**`Default`**

0

#### Defined in

[retryWrapper/retryWrapper.ts:12](https://bitbucket.org/aligent/microservices-utilities/src/a0a85a2/src/retryWrapper/retryWrapper.ts#lines-12)

___

### onRetry

• `Optional` **onRetry**: (`retries`: `number`, `error`: `Error`, `config`: [`RetryConfig`](RetryConfig.md)) => `void`

#### Type declaration

▸ (`retries`, `error`, `config`): `void`

A callback to run before each retry

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `retries` | `number` | the number of retries so far (will start at 1) |
| `error` | `Error` | the error from the last attempt |
| `config` | [`RetryConfig`](RetryConfig.md) | - |

##### Returns

`void`

#### Defined in

[retryWrapper/retryWrapper.ts:23](https://bitbucket.org/aligent/microservices-utilities/src/a0a85a2/src/retryWrapper/retryWrapper.ts#lines-23)

___

### retries

• `Optional` **retries**: `number`

The number of retries to attempt after the first run

**`Default`**

1

#### Defined in

[retryWrapper/retryWrapper.ts:7](https://bitbucket.org/aligent/microservices-utilities/src/a0a85a2/src/retryWrapper/retryWrapper.ts#lines-7)
