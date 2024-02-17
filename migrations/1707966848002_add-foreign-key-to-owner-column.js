/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // membuat user baru
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_playlist', 'old_playlist', 'old_playlist', 'old playlist')");

  // mengubah nilai owner pada playlist yang owner-nya bernilai NULL
  pgm.sql("UPDATE playlist SET owner = 'old_playlist' WHERE owner IS NULL");

  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint('playlist', 'fk_playlist.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_playlist.owner_users.id pada tabel playlist
  pgm.dropConstraint('playlist', 'fk_playlist.owner_users.id');

  // mengubah nilai owner old_playlist pada playlist menjadi NULL
  pgm.sql("UPDATE playlist SET owner = NULL WHERE owner = 'old_playlist'");

  // menghapus user baru
  pgm.sql("DELETE FROM users WHERE id = 'old_playlist'");
};
