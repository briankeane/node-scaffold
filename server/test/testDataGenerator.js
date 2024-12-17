const { faker } = require('@faker-js/faker');
const encryption = require('../lib/spotify/spotify.encryption');

/*
 * Creates a SpotifyUser
 * if there is no userId provided, it will create a user, too.
 */
async function createSpotifyUser(db, data = {}) {
  const encrpytedRefreshToken =
    data.refreshToken || encryption.encrypt(faker.datatype.uuid());
  return await db.models.SpotifyUser.create({
    spotifyUserId: data.spotifyUserId || faker.datatype.uuid(),
    accessToken: data.accessToken || faker.datatype.uuid().toString(),
    refreshToken: encrpytedRefreshToken,
  });
}

const createUser = async function (db, data = {}) {
  return await db.models.User.create({
    spotifyUserId: data.spotifyUserId || faker.datatype.uuid(),
    displayName: data.displayName || faker.name.firstName(),
    email: data.email || faker.internet.email(),
    profileImageUrl: data.profileImageUrl || randomImageURL(),
    role: data.role || 'user',
  });
};

const createPlayolaUserSeed = function (data) {
  return {
    displayName: data.displayName || faker.name.firstName(),
    email: data.email || faker.internet.email(),
    profileImageUrl: data.profileImageUrl || randomImageURL(),
    spotifyUserId: data.spotifyUserId || faker.datatype.uuid(),
  };
};

function randomImageURL() {
  return `${faker.image.image()}/${Math.round(Math.random() * 1000)}`;
}

module.exports = {
  createSpotifyUser,
  createPlayolaUserSeed,
  createUser,
};
