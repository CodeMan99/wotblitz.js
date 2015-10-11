var wotblitz = {
  auth: require('./bin/wotblitz-auth.js'),
  clans: require('./bin/wotblitz-clans.js'),
  players: require('./bin/wotblitz-players.js'),
  servers: require('./bin/wotblitz-servers.js'),
  session: require('./lib/session.js'),
  tankopedia: require('./bin/wotblitz-tankopedia.js'),
  tankStats: require('./bin/wotblitz-tank-stats.js')
};

module.exports = process.env.APPLICATION_ID ? wotblitz : setAppId;

function setAppId(applicationId) {
  if (applicationId) process.env.APPLICATION_ID = applicationId;
  if (!process.env.APPLICATION_ID) throw new Error('no APPLICATION_ID set in the env');

  return wotblitz;
}
