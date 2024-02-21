
// set map getSongs
const mapDBgetSongs = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

// set map addSongs
const mapDBaddSong = ({
  id,
  title,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  genre,
  performer,
  duration,
  albumId: album_id,
});

// set map getPlaylists
const mapDBgetPlaylist = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

// set map getAlbumById
const mapDBgetAlbumById = ({
  id,
  name,
  cover,
}) => ({
  id,
  name,
  coverUrl: cover,
});

module.exports = {
  mapDBgetSongs,
  mapDBaddSong,
  mapDBgetPlaylist,
  mapDBgetAlbumById,
};
