const getAwsIdFromArn = (resourceArn: string): string => {
  if (resourceArn.length === 0) {
    throw new Error('Received an empty resourceArn, unable to get an ID.');
  }
  const startIdx = resourceArn.lastIndexOf(':') + 1;
  return resourceArn.substring(startIdx);
};
export default getAwsIdFromArn;
