

class LikeAlbumHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;
  }

  async postLikeAlbumHandler(request, h) {
    const { id: credentialId } = request.payload;
    const albumId = request.params;

    await this._service.addAlbumLikes(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Like album berhasil',
    });
    response.code(201);
    return response;
  }

  async getLikeAlbumByIdHandler(request, h) {
    const albumId = request.params;
    const likes = await this._service.getAlbumLikes(albumId);

    const { likesCount, source } = likes; // check

    const dataLikeCount = JSON.parse(likesCount);

    const response = h.response({
      status: 'success',
      data: {
        likes: dataLikeCount,
      },
    });

    response.header('X-Data-Source', source);

    return response;
  }

  async getAlbumLikeHandler(request, h) {
    const { albumId } = request.params;
    const { likes, isChache = 0 } = await this._service.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: likes.length,
      },
    });
    response.code(200);

    if (isChache) response.header('X-Data-Source', 'cache');
    return response;
  }
}

module.exports = LikeAlbumHandler;
