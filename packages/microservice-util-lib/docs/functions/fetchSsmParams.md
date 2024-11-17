[**@aligent/microservice-util-lib**](../modules.md) • **Docs**

***

[@aligent/microservice-util-lib](../modules.md) / fetchSsmParams

# Function: fetchSsmParams()

Fetch SSM Parameters

## Param

the keys of the parameters to fetch

## fetchSsmParams(param)

> **fetchSsmParams**(`param`): `Promise`\<`Parameter` \| `undefined`\>

Fetch one SSM parameter

### Parameters

• **param**: `string`

key of the parameter to fetch

### Returns

`Promise`\<`Parameter` \| `undefined`\>

### Param

the keys of the parameters to fetch

### Defined in

[fetchSsmParams/fetchSsmParams.ts:14](https://github.com/aligent/microservice-development-utilities/blob/aa4b5d2c0fc3925dee03a46aa2f9ce02720aa69b/packages/microservice-util-lib/src/fetchSsmParams/fetchSsmParams.ts#L14)

## fetchSsmParams(params)

> **fetchSsmParams**(...`params`): `Promise`\<(`Parameter` \| `undefined`)[]\>

Fetch a list of SSM parameters

### Parameters

• ...**params**: `string`[]

list of parameter keys to fetch

### Returns

`Promise`\<(`Parameter` \| `undefined`)[]\>

### Param

the keys of the parameters to fetch

### Defined in

[fetchSsmParams/fetchSsmParams.ts:21](https://github.com/aligent/microservice-development-utilities/blob/aa4b5d2c0fc3925dee03a46aa2f9ce02720aa69b/packages/microservice-util-lib/src/fetchSsmParams/fetchSsmParams.ts#L21)
