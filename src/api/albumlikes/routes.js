
const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{albumId}/likes',
    handler: (request, h) => handler.postLikeAlbumHandler(request, h),
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{albumId}/likes',
    handler: (request, h) => handler.getLikeAlbumHandler(request, h),
  },

  {
    method: 'DELETE',
    path: '/albums/{albumId}/likes',
    handler: (request, h) => handler.deleteLikeAlbumHandler(request, h),
    options: {
      auth: 'musicapp_jwt',
    },
  },
];

module.exports = routes;
