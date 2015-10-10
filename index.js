var wotblitz = {
  auth: require('./wotblitz-auth'),
  clans: require('./wotblitz-clans'),
  players: require('./wotblitz-players'),
  servers: require('./wotblitz-servers'),
  session: require('./lib/session.js'),
  tankopedia: require('./wotblitz-tankopedia'),
  tankStats: require('./wotblitz-tank-stats')
};

module.exports = process.env.APPLICATION_ID ? wotblitz : setAppId;

function setAppId(applicationId) {
  if (applicationId) process.env.APPLICATION_ID = applicationId;
  if (!process.env.APPLICATION_ID) throw new Error('no APPLICATION_ID set in the env');

  return wotblitz;
}
