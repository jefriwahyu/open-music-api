
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
      text: 'SELECT id FROM albums WHERE id = $1',
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

    if (resultLikeinAlbum.rowCount >= 1) {
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
      const result = await this._cacheService.get(`album-like:${albumId}`);

      const likes = JSON.parse(result);

      return {
        likes,
        source: 'cache',
      };
    } catch (error) {
      const query = {
        text: `SELECT * FROM userlike
               WHERE album_id = $1`,
        values: [albumId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(
        `album-like:${albumId}`,
        JSON.stringify(result.rowCount),
      );

      return {
        likes: result.rowCount,
        source: 'database',
      };
    }
  }

  async deleteAlbumLikes(userId, albumId) {
    const checkLikeQ = {
      text: `SELECT id FROM userlike 
             WHERE user_id = $1 
             AND album_id = $2`,
      values: [userId, albumId],
    };

    const resultLikeCheck = await this._pool.query(checkLikeQ);

    if (resultLikeCheck.rowCount) {
      const deleteLikeQ = {
        text: 'DELETE FROM userlike WHERE id = $1',
        values: [resultLikeCheck.rows[0].id],
      };

      const resultDeleteLike = await this._pool.query(deleteLikeQ);

      await this._cacheService.delete(`album-like:${albumId}`, JSON.stringify(resultDeleteLike.rowCount));
    }
  }
}

module.exports = AlbumsLikesService;
