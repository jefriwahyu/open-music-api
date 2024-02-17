/* eslint-disable no-unused-vars */
/* eslint-disable indent */

// membuat class handler playlist
class PlaylistHandler {
  constructor(
    playlistService,
    playlistSongsService,
    songsService,
    validator,
    ) {
    this._playlistService = playlistService;
    this._playlistSongsService = playlistSongsService;
    this._songsService = songsService;
    this._validator = validator;
  }

  // fungsi handler untuk membuat data playlist
  async postPlaylistHandler(request, h) {
    await this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistService.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  // fungsi handler untuk mendapatkan semua data playlist berdasarkan id credential
  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistService.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  // fungsi handler untuk menghapus data playlist berdasarkan id credential
  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(id, credentialId);
    await this._playlistService.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist telah berhasil dihapus',
    };
  }

  // fungsi handler untuk mendapatkan data playlist berdasarkan playlistId
  async postSongsinPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongIdPayload(request.payload);

    const { playlist_id: id } = request.params;
    const { song_id } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(id, credentialId);

    const playlistId = await this._playlistSongsService.addingSongtoPlaylist(id, song_id);

    const response = h.response({
      status: 'success',
      message: 'Lagu telah berhasil ditambahkan di Playlist. Selamat menikmati lagumu.',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsinPlaylistHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(id, credentialId);

    const playlist = await this._playlistSongsService.getSongsinPlaylist(id);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSonginPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongIdPayload(request.payload);

    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(id, credentialId);

    await this._playlistSongsService.deleteSonginPlaylist(id, songId);

    return {
      status: 'success',
      message: 'Lagu telah berhasil dihapus dari playlist anda',
    };
  }
}

module.exports = PlaylistHandler;
