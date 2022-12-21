/**
 * Split an array into chunks of a certain size
 * @param source the array to split up
 * @param chunkSize the size of each chunk. (The final chunk will be whatever is remaining)
 */
function chunkBy<T>(source: T[], chunkSize: number) {
  const numberOfChunks = Math.ceil(source.length / chunkSize);
  return Array.from(new Array(numberOfChunks), (_, i) => {
    return source.slice(i * chunkSize, (i + 1) * chunkSize);
  });
}

export default chunkBy;
