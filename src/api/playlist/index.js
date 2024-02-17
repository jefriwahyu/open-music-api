/* eslint-disable max-len */
const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, {
    playlistService, playlistSongsService, songsService, validator,
  }) => {
    const playlistHandler = new PlaylistHandler(playlistService, playlistSongsService, songsService, validator);
    server.route(routes(playlistHandler));
  },
};
