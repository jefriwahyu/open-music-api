
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLikes(userId, albumId) {
    const id = `album-likes-${nanoid(16)}`;

    const albumCheckQ = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };

    const resultAlbumCheck = await this._pool.query(albumCheckQ);

    if (!resultAlbumCheck.rowCount) {
      throw new NotFoundError('Like gagal. album tidak ada');
    }

    const checkLikeinAlbumQ = {
      text: 'SELECT * FROM userlike WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const resultLikeinAlbum = await this._pool.query(checkLikeinAlbumQ);

    if (!resultLikeinAlbum.rowCount >= 1) {
      throw new InvariantError('Like gagal. Anda sudah menyukai album ini');
    }

    const query = {
      text: 'INSERT INTO userlike VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Like gagal');
    }

    await this._cacheService.delete(`album:${albumId}`);
    return result.rows[0].id;
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`album:${albumId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT COUNT(id)
               FROM userlike
               WHERE album_id = $1`,
        values: [albumId],
      };

      const result = await this._pool.query(query);

      const likesCount = result.rows[0].count;

      await this._cacheService.set(`album:${albumId}`, JSON.stringify(likesCount));

      return { likesCount };
    }
  }

  async deleteAlbumLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM userlike WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Album Likes gagal dihapus');
    }

    await this._cacheService.delete(`album:${albumId}`);
  }
}

module.exports = AlbumsLikesService;
