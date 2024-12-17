/*!
 * node-s3-url-encode - Because s3 urls are annoying
 */

var encodings: { [key: string]: string } = {
  '+': '%2B',
  '!': '%21',
  '"': '%22',
  '#': '%23',
  $: '%24',
  '&': '%26',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '*': '%2A',
  ',': '%2C',
  ':': '%3A',
  ';': '%3B',
  '=': '%3D',
  '?': '%3F',
  '@': '%40',
};

export function encodeForS3(key: string) {
  return encodeURI(key) // Do the standard url encoding
    .replace(/(\+|!|"|#|\$|&|'|\(|\)|\*|\+|,|:|;|=|\?|@)/gim, function (match) {
      return encodings[match];
    });
}
