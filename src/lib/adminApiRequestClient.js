const fetch = require('node-fetch');

/**
 * Makes a request to the Admin API webhook.
 * @param {Object} options
 * @param {string} options.url - Admin API endpoint
 * @param {string} options.method - HTTP method (default POST)
 * @param {Object} options.body - Request body
 * @param {Object} options.headers - Request headers
 */
async function adminApiRequest({ url, method = 'POST', body, headers }) {
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    // Always consume the response fully into JSON or text
    let data;
    try {
      data = await response.json();   // parse JSON if possible
    } catch (err) {
      data = await response.text();   // fallback to text
    }

    // Return only plain values, never a stream
    return {
      status: response.status,
      body: data
    };
  } catch (err) {
    // Bubble up the error so caller can handle
    throw err;
  }
}

module.exports = { adminApiRequest };
