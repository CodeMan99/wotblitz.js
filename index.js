var wotblitz = {
  auth: require('./bin/wotblitz-auth'),
  clans: require('./bin/wotblitz-clans'),
  players: require('./bin/wotblitz-players'),
  servers: require('./bin/wotblitz-servers'),
  session: require('./lib/session.js'),
  tankopedia: require('./bin/wotblitz-tankopedia'),
  tankStats: require('./bin/wotblitz-tank-stats')
};

module.exports = process.env.APPLICATION_ID ? wotblitz : setAppId;

function setAppId(applicationId) {
  if (applicationId) process.env.APPLICATION_ID = applicationId;
  if (!process.env.APPLICATION_ID) throw new Error('no APPLICATION_ID set in the env');

  return wotblitz;
}
