
exports.up = (pgm) => {
  // membuat tabel playlist_songs
  pgm.createTable('playlistssongs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('playlistssongs', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');

  pgm.addConstraint('playlistssongs', 'fk_playlistssongs_playlist_id_playlist_id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');
  pgm.addConstraint('playlistssongs', 'fk_playlistssongs_song_id_songs_id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('playlistssongs');
};
