module.exports = WargamingOpenIdSession;

function WargamingOpenIdSession(config, access_token, account_id, expires_at, nickname) {
  this.config = config;
  this.access_token = access_token; //access token is passed in to all methods that require authentication
  this.account_id = account_id;     //expiration date of access_token
  this.expires_at = expires_at;     //user ID
  this.nickname = nickname;         //user name.
}
