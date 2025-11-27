const fetch = require('node-fetch');

/**
 * Makes a request to the Auth API to fetch an access token.
 * @param {Object} options
 * @param {string} options.url - Auth API token endpoint
 * @param {string} options.method - HTTP method (default POST)
 * @param {Object} options.body - Request body
 * @param {Object} options.headers - Request headers
 */
async function authRequest({ url, method = 'POST', body, headers }) {
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body)
    });

    let data;
    try {
      data = await response.json();   // parse JSON directly
    } catch {
      data = await response.text();   // fallback to text
    }

    return { status: response.status, body: data };
  } catch (err) {
    throw err;
  }
}

module.exports = { authRequest };
