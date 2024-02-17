/* eslint-disable no-return-assign */
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
      text: 'INSERT INTO playlistssongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].length) {
      throw new InvariantError('Lagu yang anda pilih gagal ditambahkan kedalam Playlist');
    }

    return result.rows[0].id;
  }

  async getSongsinPlaylist(playlistId) {
    const songQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
            FROM playlistssongs
            JOIN songs ON playlistssongs.song_id = songs.id
            WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const songQueryResult = await this._pool.query(songQuery);

    const playlistQuery = {
      text: `SELECT playlist.id, playlist.name, users.username
              FROM playlist
              LEFT JOIN users ON playlist.owner = users.id
              WHERE playlist.id = $1`,
      values: [playlistId],
    };

    const playlistQueryResult = await this._pool.query(playlistQuery);

    if (!songQueryResult.rows[0].length && !playlistQueryResult.rows[0].length) {
      throw new InvariantError('Gagal melihat lagu didalam playlist');
    }

    return playlistQueryResult.rows[0].songs = songQueryResult.rows;
  }

  async deleteSonginPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistssongs WHERE playlist_id=$1 AND song_id=$2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus lagu didalam Playlist');
    }
  }
}

module.exports = PlaylistSongsService;
