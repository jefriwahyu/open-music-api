
const LikeAlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likealbum',
  version: '1.0.0',
  register: async (server, { service, albumsService }) => {
    const likeAlbumHandler = new LikeAlbumHandler(service, albumsService);
    server.route(routes(likeAlbumHandler));
  },
};
