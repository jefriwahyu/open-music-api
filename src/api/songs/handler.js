
// membuat class handler song
class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  // fungsi handler untuk membuat data song
  async postSongHandler(request, h) {
    await this._validator.validateSongPayload(request.payload);
    const {
      title, year, genre, performer, duration, album_id,
    } = request.payload;

    const song_id = await this._service.addSong({
      title, year, genre, performer, duration, album_id,
    });

    const response = h.response({
      status: 'success',
      data: {
        songId: song_id,
      },
    });
    response.code(201);
    return response;
  }

  // fungsi handler untuk mendapatkan semua data song
  async getSongsHandler() {
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs: songs,
      },
    };
  }

  // fungsi handler untuk mendapatkan data song berdasarkan id
  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song: song,
      },
    };
  }

  // fungsi handler untuk memperbarui data song
  async putSongByIdHandler(request) {
    await this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Lagu telah berhasil diperbarui',
    };
  }

  // fungsi handler untuk menghapus data song berdasarkan id
  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return {
      status: 'success',
      message: 'Lagu telah berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
