
const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.postLikeAlbumHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.getAlbumLikes(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.deleteAlbumLikes(request, h),
  },
];

module.exports = routes;
