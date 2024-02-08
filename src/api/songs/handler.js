/* eslint-disable prefer-destructuring */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable object-shorthand */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */

// const AlbumsService = require('../../services/inMemory/AlbumsService');

class SongsHandler {
  constructor(service) {
    this._service = service;
  }

  async postSongHandler(request, h) {
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;

    // const albumsService = new AlbumsService();
    // const latesAlbum = albumsService.getLatestAlbum();
    // const albumId = latesAlbum.id;

    const song_id = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
    });

    const response = h.response({
      status: 'success',
      data: {
        song: {
          id: song_id,
          title,
          year,
          genre,
          performer,
          duration,
          albumId,
        },
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs: songs,
      },
    };
  }

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

  async putSongByIdHandler(request) {
    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
