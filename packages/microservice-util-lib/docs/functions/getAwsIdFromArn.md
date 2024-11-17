[**@aligent/microservice-util-lib**](../modules.md) • **Docs**

***

[@aligent/microservice-util-lib](../modules.md) / getAwsIdFromArn

# Function: getAwsIdFromArn()

> **getAwsIdFromArn**(`resourceArn`): `string`

Get the AWS ID from its resource ARN

## Parameters

• **resourceArn**: `string`

the ARN of the AWS resource

## Returns

`string`

the ID (if present in the ARN) of the AWS resource/execution

## Throws

when the provided ARN is empty

## Example

```ts
getAwsIdFromArn('arn:aws:states:ap-southeast-2:123123123:execution:prj-int-entity-ac-dc-dev-machine-name:this-is-the-id')
```

## Defined in

[getAwsIdFromArn/getAwsIdFromArn.ts:11](https://github.com/aligent/microservice-development-utilities/blob/aa4b5d2c0fc3925dee03a46aa2f9ce02720aa69b/packages/microservice-util-lib/src/getAwsIdFromArn/getAwsIdFromArn.ts#L11)
