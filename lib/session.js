module.exports = WargamingOpenIdSession;

function WargamingOpenIdSession(config, accessToken, accountId, expiresAt, nickname) {
  this.config = config;
  this.accessToken = accessToken; // access token is passed in to all methods that require authentication
  this.accountId = accountId;     // user ID
  this.expiresAt = expiresAt;     // expiration date of access_token
  this.nickname = nickname;       // user name.
}
