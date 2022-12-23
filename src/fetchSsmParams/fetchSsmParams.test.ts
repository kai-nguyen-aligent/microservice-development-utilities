import { fetchSsmParams } from './fetchSsmParams';

const getParam = jest.fn();
const getParams = jest.fn();

jest.mock('aws-sdk', () => {
  return {
    SSM: jest.fn().mockImplementation(() => {
      return {
        getParameter: () => ({ promise: getParam }),
        getParameters: () => ({ promise: getParams })
      };
    })
  };
});

describe('fetchSsmParams', () => {

  afterEach(() => {
    getParam.mockReset();
    getParams.mockReset();
  });

  it('should error when no params are passed', async () => {
    try {
      await fetchSsmParams();
    } catch (ex) {
      expect(ex).toBeTruthy();
    }
  });

  it('should fetch a single parameter if only one is supplied', async () => {
    try {
      await fetchSsmParams('');
    // eslint-disable-next-line no-empty
    } catch {}
    expect(getParam).toHaveBeenCalledTimes(1);
    expect(getParams).toHaveBeenCalledTimes(0);
  });

  it('should fetch a multiple parameters if more than one is supplied', 
    async () => {
      try {
        await fetchSsmParams('', '', '');
      // eslint-disable-next-line no-empty
      } catch {}
      expect(getParam).toHaveBeenCalledTimes(0);
      expect(getParams).toHaveBeenCalledTimes(1);
    });
});

