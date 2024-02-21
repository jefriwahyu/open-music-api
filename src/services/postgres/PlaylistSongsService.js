
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addingSongtoPlaylist(playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistssongs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu yang anda pilih gagal ditambahkan kedalam Playlist');
    }

    return result.rows.id;
  }

  async getSongsinPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer 
      FROM songs
      INNER JOIN playlistssongs ON songs.id = playlistssongs.song_id
      INNER JOIN playlist ON playlist.id = playlistssongs.playlist_id
      WHERE playlist.id = $1;`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteSonginPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistssongs WHERE playlist_id=$1 AND song_id=$2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus lagu didalam Playlist');
    }
  }
}

module.exports = PlaylistSongsService;
