
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

    const { id } = request.params; // playlistId
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._songsService.verifySongsExist(songId);

    await this._playlistService.verifyPlaylistsExist(id);

    await this._playlistService.verifyPlaylistAccess(id, credentialId);

    await this._playlistSongsService.addingSongtoPlaylist(id, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu telah berhasil ditambahkan di Playlist. Selamat menikmati lagumu.',
    });
    response.code(201);
    return response;
  }

  async getSongsinPlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistsExist(id);

    await this._playlistService.verifyPlaylistAccess(id, credentialId);

    const playlist = await this._playlistService.getPlaylistById(id, credentialId);
    const songs = await this._playlistSongsService.getSongsinPlaylist(id);

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    };
  }

  async deleteSonginPlaylistHandler(request) {
    this._validator.validatePlaylistSongIdPayload(request.payload);

    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._songsService.verifySongsExist(songId);

    await this._playlistService.verifyPlaylistsExist(id);

    await this._playlistService.verifyPlaylistAccess(id, credentialId);

    await this._playlistSongsService.deleteSonginPlaylist(id, songId);

    return {
      status: 'success',
      message: 'Lagu telah berhasil dihapus dari playlist anda',
    };
  }
}

module.exports = PlaylistHandler;
