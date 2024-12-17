const { assert } = require('chai');
const lib = require('./lib');
const db = require('../db');
const sinon = require('sinon');
const { clearDatabase } = require('../test/test.helpers');
const spotifyLib = require('./spotify/spotify.lib');
const {
  api_get_me_200,
  api_token_swap_code_200,
} = require('../test/mockResponses/spotify');
const {
  createPlayolaUserSeed,
  createUser,
  createStationSongsWithSongs,
  createSpinsWithSongs,
  createSpotifyUser,
} = require('../test/testDataGenerator');
const encryption = require('./spotify/spotify.encryption');
const eventStream = require('./events');
const events = require('./events/events');
const errors = require('./errors');
const nock = require('nock');
const { v4: UUID } = require('uuid');

describe('User library functions', function () {
  before(async function () {
    await clearDatabase(db);
  });

  afterEach(async function () {
    await clearDatabase(db);
  });

  describe('User-oriented', function () {
    var playolaUserSeed, getPlayolaUserSeedStub, userCreatedPublishStub;

    const accessToken = 'asdfafsd';
    const refreshToken = encryption.encrypt(
      api_token_swap_code_200['refresh_token']
    );
    const spotifyUserId = 'aSpotifyUID';
    const email = api_get_me_200['email'];

    beforeEach(async function () {
      playolaUserSeed = createPlayolaUserSeed({ spotifyUserId, email });
      await db.models.SpotifyUser.create({
        accessToken,
        refreshToken,
        spotifyUserId,
        email,
      });
      userCreatedPublishStub = sinon.stub(eventStream.allEvents, 'publish');
      getPlayolaUserSeedStub = sinon
        .stub(spotifyLib, 'getPlayolaUserSeed')
        .resolves(playolaUserSeed);
    });

    afterEach(async function () {
      getPlayolaUserSeedStub.restore();
      userCreatedPublishStub.restore();
    });

    describe('CREATE', function () {
      it('just gets a user if they already exist', async function () {
        let existingUser = await db.models.User.create(playolaUserSeed);
        let createdUser = await lib.createUserViaSpotifyTokens({
          accessToken,
          refreshToken,
        });
        assert.equal(createdUser.id, existingUser.id);
      });

      it('creates a user if they do not exist', async function () {
        let createdUser = await lib.createUserViaSpotifyTokens({
          accessToken,
          refreshToken,
        });
        assert.ok(createdUser);
        assert.equal(createdUser.email, playolaUserSeed.email);
        assert.equal(
          createdUser.profileImageUrl,
          playolaUserSeed.profileImageUrl
        );
        assert.equal(createdUser.spotifyUserId, playolaUserSeed.spotifyUserId);
      });

      it('broadcasts an event if the user was created', async function () {
        let createdUser = await lib.createUserViaSpotifyTokens({
          accessToken,
          refreshToken,
        });
        sinon.assert.calledOnce(userCreatedPublishStub);
        sinon.assert.calledWith(userCreatedPublishStub, events.USER_CREATED, {
          user: createdUser,
        });
      });

      it('does not broadcast an event if the user was just updated', async function () {
        await db.models.User.create(playolaUserSeed);
        await lib.createUserViaSpotifyTokens({
          accessToken,
          refreshToken,
        });
        sinon.assert.notCalled(userCreatedPublishStub);
      });
    });

    describe('GET', function () {
      it('GETS a user', async function () {
        let user = await createUser(db);
        let foundUser = await lib.getUser({ userId: user.id });
        assert.equal(foundUser.id, user.id);
      });
    });
  });

  /*
   * Helper Functions
   */
});
