const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const logger = require('./logger');

function loadConfig() {
  const env = process.env.NODE_ENV || 'dev';
  const filePath = path.join(__dirname, 'config', `${env}.yaml`);
  const config = yaml.load(fs.readFileSync(filePath, 'utf8'));
  logger.info(`[ConfigLoader] Loaded ${env}.yaml`);
  return config;
}

module.exports = loadConfig();
