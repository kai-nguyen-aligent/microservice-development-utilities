import { SSM } from 'aws-sdk';

const ssm = new SSM();

/**
 * Fetch one SSM parameter
 * @param param key of the parameter to fetch
 */
async function fetchSsmParams(param: string):
  Promise<SSM.Parameter>;

/**
 * Fetch a list of SSM parameters
 * @param params list of parameter keys to fetch
 */
async function fetchSsmParams(...params: string[]):
  Promise<SSM.ParameterList>;

/**
 * Fetch SSM Parameters
 * @param params the keys of the parameters to fetch
 */
async function fetchSsmParams(...params: string[]) {
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

  return params.map(paramName => {
    return result.Parameters.find(param => param.Name === paramName);
  });
}

export default fetchSsmParams;
