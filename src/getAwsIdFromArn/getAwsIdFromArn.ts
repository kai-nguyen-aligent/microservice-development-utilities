const getAwsIdFromArn = (resourceArn: string): string => {
  const startIdx = resourceArn.lastIndexOf(':') + 1;
  return resourceArn.substring(startIdx);
};
export default getAwsIdFromArn;
