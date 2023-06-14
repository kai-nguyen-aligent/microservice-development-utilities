import getAwsIdFromArn from './getAwsIdFromArn';

describe('getAWsIdFromArn', () => {
  it('should return the short execution ID when given a valid ARN', () => {
    expect(
      getAwsIdFromArn(
        'arn:aws:states:ap-southeast-2:123123123:execution:prj-int-entity-ac-dc-dev-machine-name:this-is-the-id'
      )
    ).toEqual('this-is-the-id');
  });

  it('should return an empty string when given an empty ARN', () => {
    expect(getAwsIdFromArn('')).toEqual('');
  });

  it('returns the provided string where it is assumed to be already a short ID', () => {
    expect(getAwsIdFromArn('my-execution')).toEqual('my-execution');
  });
});
