
const { Pool } = require('pg');
 
class PlaylistService {
  constructor() {
    this._pool = new Pool();
}
 
    async getPlaylist(playlistId) {
      const query = {
        text: 'SELECT id, name FROM playlist WHERE id = $1',
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      return result.rows[0];
  }
}

module.exports = PlaylistService;
