/**
 * api uris
 */
const apiUris = {};

/**
 * base uri
 */
const baseUri =
  "https://fce0-2401-4900-1f3e-203f-cb33-c4a2-4046-4046.in.ngrok.io";

/**
 * account api method declarations
 */

const account = {
  getUser: `${baseUri}/`,
};
apiUris.account = account;
/**
 * export default api uris
 */
export default apiUris;
