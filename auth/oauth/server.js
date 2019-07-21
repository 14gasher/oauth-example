const OAuthServer = require('express-oauth-server')
const model = require('./model')

module.exports = new OAuthServer({
  model: model,
  grants: ['authorization_code', 'refresh_token'],
  accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
})
