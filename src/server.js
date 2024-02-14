
// impor dan menjalankan konfigurasi dotenv
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
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
