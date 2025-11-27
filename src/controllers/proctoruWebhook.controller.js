const { authRequest } = require('../lib/authRequestClient');
const { adminApiRequest } = require('../lib/adminApiRequestClient');
const appConfig = require('../configLoader');

module.exports = function (router) {
  router.post('/proctoru/webhooks', async ctx => {
    try {
      // Step 1: Validate secret
      const proctorUSecret = ctx.headers['x-proctoru-secret'];
      const expectedSecret = appConfig.services.proctorU.secret;
      if (!proctorUSecret || proctorUSecret !== expectedSecret) {
        ctx.throw(401, 'Invalid shared secret');
      }

      // Step 2: Get JWT
      const tokenResponse = await authRequest({
        url: `${appConfig.services.auth.host}${appConfig.services.auth.tokenPath}`,
        method: 'POST',
        body: { grant_type: 'client_credentials', scope: 'atom-admin-api' },
        headers: {
          'Content-Type': 'application/json',
          appId: appConfig.services.auth.appId,
          Authorization: `Basic ${appConfig.services.auth.basicAuth}`
        }
      });

      const accessToken = tokenResponse.body?.accessToken;
      if (!accessToken) ctx.throw(500, 'Failed to obtain access token from Auth API');

      // 🔎 Log the access token for debugging
      console.log(`[Middleware Controller] Obtained access token: ${accessToken}`);

      // Step 3: Forward to Admin API
      const forwardResponse = await adminApiRequest({
        url: `${appConfig.services.adminApi.host}${appConfig.services.adminApi.path}`,
        method: 'POST',
        body: ctx.request.body,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-proctoru-secret': appConfig.services.proctorU.secret
        }
      });

      // Step 4: Respond back safely
      ctx.status = forwardResponse.status || 200;
      ctx.type = 'application/json';
      ctx.body = forwardResponse.body; // ✅ always plain JSON/text from helper
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.type = 'application/json';
      ctx.body = { message: err.message || 'Internal Server Error' };
    }
  });
};
