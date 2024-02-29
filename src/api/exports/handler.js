
class ExportsHandler {
  constructor(ProducerService, playlistService, validator) {
    this._producerService = ProducerService;
    this._playlistService = playlistService;
    this._validator = validator;
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPayload(request.payload);

    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);

    const message = {
      credentialId,
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._producerService.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Untuk sekarang Permintaan Anda dalam antrean. Mohon ditunggu yaa..',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
