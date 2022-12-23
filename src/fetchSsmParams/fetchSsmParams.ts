import { SSM } from 'aws-sdk';

const ssm = new SSM();

/**
 * Fetch one SSM param
 * @param param key of the parameter to fetch
 */
export async function fetchSsmParams(param: string): Promise<SSM.Parameter>;

/**
 * Fetch multiple ssm params
 * @param params list of parameter keys to fetch
 */
export async function fetchSsmParams(...params: string[]):
  Promise<SSM.ParameterList>;

export async function fetchSsmParams(...params: string[]) {
  if (params.length === 0) {
    throw new Error('No SSM Params supplied');
  }

  if (params.length === 1) {
    const result = await ssm.getParameter({
      Name: params[0],
      WithDecryption: true
    })
      .promise();
    return result.Parameter;
  }

  const result = await ssm.getParameters({
    Names: params,
    WithDecryption: true
  })
    .promise();

  return result.Parameters;
}
