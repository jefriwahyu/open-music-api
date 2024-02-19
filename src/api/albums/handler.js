
// membuat class handler album
class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  // fungsi handler untuk membuat data Album
  async postAlbumHandler(request, h) {
    await this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;

    const album_id = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId: album_id,
      },
    });
    response.code(201);
    return response;
  }

  // fungsi handler untuk mendapatkan data Album berdasarkan id
  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album: album,
      },
    };
  }

  // fungsi handler untuk memperbarui data Album berdasarkan id
  async putAlbumByIdHandler(request) {
    await this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  // fungsi handler untuk menghapus data Album berdasarkan id
  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
