const db = require('../db');
const spotifyLib = require('./spotify/spotify.lib');
const eventStream = require('./events');
const events = require('./events/events');

/*
 * Users
 */
const createUserViaSpotifyTokens = async function ({
  accessToken,
  refreshToken,
}) {
  function finish(user, created) {
    if (created) eventStream.allEvents.publish(events.USER_CREATED, { user });
    return user;
  }

  let profile = await spotifyLib.getPlayolaUserSeed({
    accessToken,
    refreshToken,
  });
  const [user, created] = await db.models.User.findOrCreate({
    where: { spotifyUserId: profile.spotifyUserId },
    defaults: {
      ...cleanUserSeed(profile),
    },
  });
  return finish(user, created);
};

const getUser = async function ({ userId, extendedPlaylist = false }) {
  let user = await db.models.User.findByPk(userId);
  if (!user) throw new Error(errors.USER_NOT_FOUND);
  return user;
};

/*
 * Helper methods
 */

function cleanUserSeed(seed) {
  return {
    displayName: seed.displayName,
    email: seed.email,
    profileImageUrl: seed.profileImageUrl,
  };
}

module.exports = {
  createUserViaSpotifyTokens,
  getUser,
};
