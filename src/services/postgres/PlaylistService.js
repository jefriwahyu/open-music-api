
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvarianError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ForbiddenError = require('../../exceptions/ForbiddenError');
const { mapDBgetPlaylist } = require('../../utils');

class PlaylistService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvarianError('Gagal menambahkan Playlist');
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlist.*, users.username
      FROM playlist
      LEFT JOIN collaborations ON collaborations.playlist_id = playlist.id
      LEFT JOIN users ON playlist.owner = users.id
      WHERE playlist.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlist.id, users.username`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBgetPlaylist);
  }

  async getPlaylistById(id, credentialId) {
    const query = {
      text: `SELECT playlist.id, playlist.name, users.username FROM playlist
        INNER JOIN users ON users.id = playlist.owner
        LEFT JOIN collaborations ON collaborations.playlist_id = playlist.id
        WHERE (playlist.owner = $1 OR collaborations.user_id = $1) AND playlist.id = $2`,
      values: [credentialId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist yang anda cari tidak ditemukan');
    }

    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus Playlist, karena Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT id, owner FROM playlist WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist yang anda cari tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async verifyPlaylistsExist(playlistId) {
    const query = {
      text: 'SELECT id FROM playlist WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist anda tidak ditemukan.');
    }
  }
}

module.exports = PlaylistService;
