
class Listener {
    constructor(playlistService, playlistSongsService, mailSender) {
      this._playlistService = playlistService;
      this._playlistSongsService = playlistSongsService;
      this._mailSender = mailSender;
   
      this.listen = this.listen.bind(this);
    }
   
    async listen(message) {
      try {
        const { playlistId, targetEmail } = JSON.parse(message.content.toString());
        
        const playlist = await this._playlistService.getPlaylist(playlistId);
        const songs = await this._playlistSongsService.getSongsinPlaylist(playlistId);
        
        const dataPlaylistSong = {
          playlist: {
            id: playlist.id,
            name: playlist.name,
            songs: songs,
          }
        }

        const result = await this._mailSender.sendEmail(
          targetEmail,
          JSON.stringify(dataPlaylistSong),
        );

        console.log(result);
      
      } catch (error) {

        console.error(error);
      
      }
    }
  }
   
  module.exports = Listener;