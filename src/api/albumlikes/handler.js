

class LikeAlbumHandler {
  constructor(albumLikesService, albumsService) {
    this._albumLikesService = albumLikesService;
    this._albumsService = albumsService;
  }

  async postLikeAlbumHandler(request, h) {
    const { albumId } = request.params;

    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);

    await this._albumLikesService.addAlbumLikes(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Like album berhasil',
    });
    response.code(201);

    return response;
  }

  async getLikeAlbumByIdHandler(request, h) {
    const { albumId } = request.params;

    const likes = await this._albumLikesService.getAlbumLikes(albumId);

    const { likesCount, cache } = likes;

    const response = h.response({
      status: 'success',
      data: {
        likes: likesCount,
      },
    });

    if (cache) response.header('X-Data-Source', 'cache');
    return response;
  }

  async getLikeAlbumHandler(request, h) {
    const { albumId } = request.params;

    await this._albumsService.getAlbumById(albumId);

    const result = await this._albumLikesService.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: result.likes,
      },
    });
    response.code(200);

    response.header('X-Data-Source', result.source);

    return response;
  }

  async deleteLikeAlbumHandler(request, h) {
    const { albumId } = request.params;

    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);

    await this._albumLikesService.deleteAlbumLikes(credentialId, albumId);

    return h.response({
      status: 'success',
      message: 'Like berhasil dihapus',
    });
  }
}

module.exports = LikeAlbumHandler;
