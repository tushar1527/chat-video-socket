/**
 * api uris
 */
const apiUris = {};

/**
 * base uri
 */
const baseUri = "http://localhost:5001";

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
