/* eslint-disable import/no-extraneous-dependencies */

// impor dan menjalankan konfigurasi dotenv
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
const Inert = require('@hapi/inert');
const ClientError = require('./exceptions/ClientError');

// Albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// Songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// Users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// Authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// Playlist
const playlist = require('./api/playlist');
const PlaylistService = require('./services/postgres/PlaylistService');
const PlaylistValidator = require('./validator/playlist');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');

// Collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// Exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// Uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// Album Like
const albumlikes = require('./api/albumlikes');
const AlbumLikesService = require('./services/postgres/AlbumLikesService');

// Chace
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService(cacheService);
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistService = new PlaylistService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const albumLikesService = new AlbumLikesService(cacheService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // plugin jwt
  await server.register([
    {
      plugin: Jwt,
    },

    {
      plugin: Inert,
    },
  ]);

  // strategy autentikasi jwt
  server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    // plugin albums
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },

    // plugin songs
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },

    // plugin users
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },

    // plugin authentications
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },

    // plugin playlist
    {
      plugin: playlist,
      options: {
        playlistService,
        playlistSongsService,
        songsService,
        validator: PlaylistValidator,
      },
    },

    // plugin collaborations
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        usersService,
        playlistService,
        validator: CollaborationsValidator,
      },
    },

    // plugin exports
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
      },
    },

    // plugin uploads
    {
      plugin: uploads,
      options: {
        storageService,
        albumsService,
        validator: UploadsValidator,
      },
    },

    // plugin album like
    {
      plugin: albumlikes,
      options: {
        service: albumLikesService,
        albumsService,
      },
    },

  ]);

  server.ext('onPreResponse', (request, h) => {
    // get response from request
    const { response } = request;

    if (response instanceof Error) {
      // backup error internal
      // eslint-disable-next-line no-undef
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // mempertahankan error secara native
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'server mengalami kegagalan',
      });
      console.error(response);
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error lanjutkan response sebelumnya
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
