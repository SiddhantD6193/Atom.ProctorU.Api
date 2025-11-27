const { adminApiRequest } = require('../lib/adminApiRequestClient');
const appConfig = require('../configLoader'); // your YAML loader
const logger = require('../logger');

/**
 * Handles ProctorU webhook payloads by forwarding them to atom-admin-api.
 * @param {Object} ctx - Koa context
 * @param {string} accessToken - JWT access token from Auth API
 */
async function processWebhook(ctx, accessToken) {
  const payload = ctx.request.body;

  // Log incoming payload for traceability
  logger.info('[ProctorU Service] Incoming payload:', JSON.stringify(payload));

  // Forward to atom-admin-api webhook
  const forwardResponse = await adminApiRequest({
    url: `${appConfig.services.adminApi.host}${appConfig.services.adminApi.path}`,
    method: 'POST',
    body: payload,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,   // ✅ pass token here
      'x-proctoru-secret': appConfig.services.proctorU.secret
    }
  });

  logger.info('[ProctorU Service] Forwarded to Admin API:', forwardResponse.status);

  return forwardResponse;
}

module.exports = { processWebhook };
