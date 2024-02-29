
const { Pool } = require('pg');
 
class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
}
 
    async getSongsinPlaylist(playlistId) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer
        FROM playlist
        INNER JOIN playlistssongs ON playlistssongs.playlist_id = playlist.id
        INNER JOIN songs ON songs.id = playlistssongs.song_id
        WHERE playlist.id = $1`,
        values: [playlistId],
      };
      
    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistSongsService;
