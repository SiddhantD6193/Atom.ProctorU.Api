// Polyfill Web APIs for Node 16
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = require('web-streams-polyfill').ReadableStream;
}
if (typeof global.Blob === 'undefined') {
  global.Blob = require('buffer').Blob;
}
if (typeof global.Response === 'undefined') {
  global.Response = require('node-fetch').Response;
}



const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const appConfig = require('./configLoader');

// Controllers
const proctoruWebhookController = require('./controllers/proctoruWebhook.controller');

const app = new Koa();
const router = new Router();

// Global request logger
app.use(async (ctx, next) => {
  console.log(`[Global] ${ctx.method} ${ctx.url}`);
  await next();
});

// Parse JSON bodies
app.use(bodyParser());

// Mount controllers
proctoruWebhookController(router);

// Register router middleware
app.use(router.routes()).use(router.allowedMethods());

// Parse port from YAML server.uri
const uri = appConfig.server.uri; // e.g. "http://localhost:4000"
const PORT = process.env.PORT || new URL(uri).port || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Middleware API running at ${uri}`);
});
