
// set DB getSongs
const mapDBgetSongs = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

// set DB getSongs
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

module.exports = { mapDBgetSongs, mapDBaddSong };
