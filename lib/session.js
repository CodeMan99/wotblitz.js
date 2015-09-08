module.exports = WargamingOpenIdSession;

function WargamingOpenIdSession(config, accessToken, accountId, expiresAt, nickname) {
  this.config = config;
  this.accessToken = accessToken; //access token is passed in to all methods that require authentication
  this.accountId = accountId;     //expiration date of access_token
  this.expiresAt = expiresAt;     //user ID
  this.nickname = nickname;       //user name.
}
