
exports.up = (pgm) => {
  // membuat tabel playlist_songs
  pgm.createTable('userlike', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('userlike', 'unique_user_id_and_album_id', 'UNIQUE(user_id, album_id)');

  pgm.addConstraint('userlike', 'fk_userlike_user_id_users_id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');

  pgm.addConstraint('userlike', 'fk_userlike_album_id_albums_id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('userlike');
};
